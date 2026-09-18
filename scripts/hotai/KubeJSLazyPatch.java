import org.badiff.MemoryDiffs;
import org.badiff.imp.MemoryDiff;
import org.badiff.io.DefaultSerialization;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.FieldInsnNode;
import org.objectweb.asm.tree.FrameNode;
import org.objectweb.asm.tree.MethodInsnNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.TypeInsnNode;
import youyihj.hotai.transformers.DiffTransformer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
import java.lang.management.ManagementFactory;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;
import java.util.jar.JarFile;
import javax.tools.ToolProvider;

/** Build/check the version-specific HotAI patch without recompiling upstream code. */
public class KubeJSLazyPatch {
    static final String TARGET = "dev/latvian/mods/kubejs/util/Lazy";
    static final String JAR = "mods/kubejs-forge-2001.6.5-build.24.jar";
    static final String SHA256 = "41719240421262acc0f348dfec92dc3c3654983662de6ae0358737029ad09076";
    static final String STATE = "createdelight$atomicState";

    public static void main(String[] args) throws Throwable {
        require(args.length == 2 && (args[0].equals("build") || args[0].equals("check")),
                "Usage: KubeJSLazyPatch.java build|check <repository>");
        Path root = Path.of(args[1]).toAbsolutePath();
        Path jarPath = root.resolve(JAR);
        require(hash(Files.readAllBytes(jarPath)).equals(SHA256),
                "KubeJS JAR changed; review the target and regenerate deliberately");
        byte[] original;
        try (JarFile jar = new JarFile(jarPath.toFile());
             var stream = jar.getInputStream(jar.getJarEntry(TARGET + ".class"))) {
            original = stream.readAllBytes();
        }
        ClassNode node = read(original);
        // HotAI diffs ClassNode -> ClassWriter(0), not the original JAR bytes.
        byte[] before = write(node);
        patch(node, compileTemplate(root));
        byte[] after = write(node);
        checkScope(before, after);
        ByteArrayOutputStream encoded = new ByteArrayOutputStream();
        MemoryDiffs.diff(before, after).serialize(DefaultSerialization.newInstance(), encoded);
        byte[] patch = encoded.toByteArray();
        Path destination = root.resolve("hotai/" + TARGET + ".badiff");
        if (args[0].equals("check")) {
            require(Arrays.equals(patch, Files.readAllBytes(destination)), "Patch is not reproducible");
        }

        MemoryDiff restored = new MemoryDiff();
        restored.deserialize(DefaultSerialization.newInstance(), new ByteArrayInputStream(patch));
        // Exercise the actual shipped HotAI transformer, including its ASM round trip.
        ClassNode transformed = new DiffTransformer(Map.of(TARGET, restored)).transform(read(original), null);
        byte[] applied = write(transformed);
        require(Arrays.equals(after, applied), "HotAI transform differs from expected class");
        Class<?> patchedClass = define(applied);
        checkSemantics(patchedClass);
        checkInvalidation(patchedClass, false);
        checkInvalidation(patchedClass, true);
        checkConcurrentMisses(patchedClass);
        checkCallbackProgress(patchedClass);
        require(!lockOrderProbe(define(original), "original"), "Original fixture unexpectedly deadlocked");
        require(!lockOrderProbe(patchedClass, "atomic"), "Atomic cache introduced a monitor cycle");
        ClassNode synchronizedNode = read(original);
        for (var method : synchronizedNode.methods) {
            if (method.name.equals("get") || method.name.equals("forget")) method.access |= Opcodes.ACC_SYNCHRONIZED;
        }
        require(lockOrderProbe(define(write(synchronizedNode)), "legacy-synchronized"), "Legacy lock-order control failed");
        long baseline = stress(define(original));
        long patched = stress(patchedClass);
        require(patched == 0, "Patched Lazy returned null under contention");
        if (args[0].equals("build")) {
            Files.createDirectories(destination.getParent());
            Files.write(destination, patch);
        }
        System.out.println("PASS: self-contained atomic cache; actual HotAI round-trip, scope and cache semantics verified");
        System.out.println("PASS: in-flight invalidation, concurrent misses, callback progress, JVM-confirmed lock-order control");
        System.out.printf("Concurrent get/forget: 2,000,000 operations per class; original nulls=%d; patched nulls=%d%n",
                baseline, patched);
        System.out.printf("Patch: %d bytes; SHA-256 %s%n", patch.length, hash(patch));
    }

    static ClassNode compileTemplate(Path root) throws Exception {
        var compiler = ToolProvider.getSystemJavaCompiler();
        require(compiler != null, "A Java 17 JDK (not a JRE) is required");
        Path temporary = Files.createTempDirectory("kubejs-lazy-template-");
        Path output = temporary.resolve("KubeJSLazyAtomicTemplate.class");
        try {
            int result = compiler.run(null, null, null, "--release", "17", "-g:none", "-proc:none",
                    "-d", temporary.toString(), root.resolve("scripts/hotai/KubeJSLazyAtomicTemplate.java").toString());
            require(result == 0, "Atomic cache template did not compile");
            return read(Files.readAllBytes(output));
        } finally {
            Files.deleteIfExists(output);
            Files.deleteIfExists(temporary);
        }
    }

    static void patch(ClassNode target, ClassNode template) {
        // The pinned build.24 constructor only calls Object() and assigns factory/expires.
        // Replacing it from the template is deliberate; review constructor side effects on any version change.
        require(target.name.equals(TARGET), "Unexpected target class");
        require(target.fields.stream().noneMatch(field -> field.name.equals(STATE)), "Cache field already exists");
        require(target.methods.stream().filter(method -> method.name.equals("<init>")).count() == 1,
                "Constructor shape changed");
        for (var field : template.fields) {
            if (!field.name.equals(STATE)) {
                require(target.fields.stream().anyMatch(existing -> existing.name.equals(field.name)
                                && existing.desc.equals(field.desc) && (existing.access & Opcodes.ACC_STATIC) == 0),
                        "Upstream field changed: " + field.name);
            }
        }
        var replacements = Map.of("<init>", "(Ljava/util/function/Supplier;J)V", "get", "()Ljava/lang/Object;", "forget", "()V");
        for (var entry : replacements.entrySet()) {
            MethodNode method = findMethod(target, entry.getKey(), entry.getValue());
            require((method.access & (Opcodes.ACC_STATIC | Opcodes.ACC_ABSTRACT | Opcodes.ACC_NATIVE | Opcodes.ACC_SYNCHRONIZED)) == 0,
                    "Unexpected target flags: " + method.name);
            findMethod(template, entry.getKey(), entry.getValue());
        }
        var state = template.fields.stream().filter(field -> field.name.equals(STATE)).findFirst().orElseThrow();
        require(state.desc.equals("Ljava/util/concurrent/atomic/AtomicReference;"), "Unexpected state type");
        target.fields.add(state);
        for (var method : target.methods) {
            if (!method.desc.equals(replacements.get(method.name))) continue;
            MethodNode body = findMethod(template, method.name, method.desc);
            for (var instruction : body.instructions) {
                if (instruction instanceof FieldInsnNode field && field.owner.equals(template.name)) field.owner = TARGET;
                if (instruction instanceof MethodInsnNode call && call.owner.equals(template.name)) call.owner = TARGET;
                if (instruction instanceof TypeInsnNode type && type.desc.equals(template.name)) type.desc = TARGET;
                if (instruction instanceof FrameNode frame) {
                    if (frame.local != null) frame.local.replaceAll(value -> template.name.equals(value) ? TARGET : value);
                    if (frame.stack != null) frame.stack.replaceAll(value -> template.name.equals(value) ? TARGET : value);
                }
                require(instruction.getOpcode() != Opcodes.MONITORENTER && instruction.getOpcode() != Opcodes.MONITOREXIT,
                        "Template must not introduce cache monitors");
            }
            method.instructions = body.instructions;
            method.tryCatchBlocks = body.tryCatchBlocks;
            method.maxStack = body.maxStack;
            method.maxLocals = body.maxLocals;
            method.localVariables = null;
            method.visibleLocalVariableAnnotations = null;
            method.invisibleLocalVariableAnnotations = null;
        }
    }

    static MethodNode findMethod(ClassNode type, String name, String descriptor) {
        return type.methods.stream().filter(method -> method.name.equals(name) && method.desc.equals(descriptor))
                .findFirst().orElseThrow(() -> new AssertionError("Missing method: " + name + descriptor));
    }

    static void checkScope(byte[] before, byte[] after) {
        ClassNode baseline = read(before);
        ClassNode restored = read(after);
        require(restored.fields.removeIf(field -> field.name.equals(STATE)), "Missing atomic state field");
        require(baseline.methods.size() == restored.methods.size(), "Unexpected method added/removed");
        for (int i = 0; i < restored.methods.size(); i++) {
            String name = restored.methods.get(i).name;
            if (name.equals("<init>") || name.equals("get") || name.equals("forget")) {
                restored.methods.set(i, baseline.methods.get(i));
            }
        }
        require(Arrays.equals(before, write(restored)), "Patch changed unrelated class contents");
    }

    static void checkSemantics(Class<?> type) throws Throwable {
        require(!java.lang.reflect.Modifier.isSynchronized(type.getMethod("get").getModifiers()), "Unexpected get monitor");
        require(!java.lang.reflect.Modifier.isSynchronized(type.getMethod("forget").getModifiers()), "Unexpected forget monitor");
        AtomicInteger calls = new AtomicInteger();
        Supplier<byte[]> factory = () -> { calls.incrementAndGet(); return new byte[]{1}; };
        Object instance = type.getMethod("of", Supplier.class).invoke(null, factory);
        Supplier<?> lazy = (Supplier<?>) instance;
        Object first = lazy.get();
        require(first == lazy.get() && calls.get() == 1, "Cache semantics changed");
        type.getMethod("forget").invoke(instance);
        require(first != lazy.get() && calls.get() == 2, "Forget semantics changed");
        Supplier<?> expired = (Supplier<?>) type.getMethod("of", Supplier.class, long.class)
                .invoke(null, factory, -1L);
        require(expired.get() != expired.get() && calls.get() == 4, "Expiry semantics changed");
        AtomicInteger nullCalls = new AtomicInteger();
        Supplier<?> nullable = create(type, () -> { nullCalls.incrementAndGet(); return null; });
        require(nullable.get() == null && nullable.get() == null && nullCalls.get() == 1, "Legitimate null not cached");
        AtomicInteger attempts = new AtomicInteger();
        Supplier<?> retry = (Supplier<?>) type.getMethod("of", Supplier.class).invoke(null,
                (Supplier<byte[]>) () -> {
                    if (attempts.getAndIncrement() == 0) throw new IllegalStateException("expected");
                    return new byte[]{2};
                });
        boolean threw = false;
        try { retry.get(); } catch (IllegalStateException expected) { threw = true; }
        require(threw, "Factory exception swallowed");
        var executor = daemonExecutor();
        try {
            require(executor.submit(retry::get).get(5, TimeUnit.SECONDS) != null && attempts.get() == 2,
                    "Cross-thread retry after factory exception failed");
        } finally {
            executor.shutdownNow();
        }
    }

    static Supplier<?> create(Class<?> type, Supplier<?> factory) throws Exception {
        return (Supplier<?>) type.getMethod("of", Supplier.class).invoke(null, factory);
    }

    static void await(CountDownLatch latch) {
        try {
            require(latch.await(5, TimeUnit.SECONDS), "Fixture coordination timed out");
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            throw new AssertionError(error);
        }
    }

    static java.util.concurrent.ExecutorService daemonExecutor() {
        return Executors.newSingleThreadExecutor(task -> {
            var thread = new Thread(task);
            thread.setDaemon(true);
            return thread;
        });
    }

    static void checkInvalidation(Class<?> type, boolean refillFirst) throws Exception {
        var entered = new CountDownLatch(1);
        var resume = new CountDownLatch(1);
        var calls = new AtomicInteger();
        Object oldValue = new Object();
        Object newValue = new Object();
        Supplier<?> lazy = create(type, () -> {
            if (calls.incrementAndGet() == 1) {
                entered.countDown();
                await(resume);
                return oldValue;
            }
            return newValue;
        });
        var executor = daemonExecutor();
        try {
            var computing = executor.submit(lazy::get);
            await(entered);
            type.getMethod("forget").invoke(lazy);
            type.getMethod("forget").invoke(lazy);
            if (refillFirst) require(lazy.get() == newValue, "New generation did not publish");
            resume.countDown();
            require(computing.get(5, TimeUnit.SECONDS) == oldValue, "In-flight caller lost its own result");
            require(lazy.get() == newValue && calls.get() == 2, "Pre-forget computation repopulated cache");
        } finally {
            resume.countDown();
            executor.shutdownNow();
        }
    }

    static void checkConcurrentMisses(Class<?> type) throws Exception {
        var entered = new CountDownLatch(1);
        var resume = new CountDownLatch(1);
        var calls = new AtomicInteger();
        Object slowValue = new Object();
        Object fastValue = new Object();
        Supplier<?> lazy = create(type, () -> {
            if (calls.incrementAndGet() == 1) {
                entered.countDown();
                await(resume);
                return slowValue;
            }
            return fastValue;
        });
        var executor = daemonExecutor();
        try {
            var computing = executor.submit(lazy::get);
            await(entered);
            require(lazy.get() == fastValue, "Concurrent miss was blocked");
            resume.countDown();
            require(computing.get(5, TimeUnit.SECONDS) == slowValue, "Slow caller lost its own result");
            require(lazy.get() == fastValue && calls.get() == 2, "First successful CAS was overwritten");
        } finally {
            resume.countDown();
            executor.shutdownNow();
        }
    }

    static void checkCallbackProgress(Class<?> type) throws Exception {
        var executor = daemonExecutor();
        var holder = new Object[1];
        var forget = type.getMethod("forget");
        try {
            Supplier<?> lazy = create(type, () -> {
                try {
                    executor.submit(() -> forget.invoke(holder[0])).get(5, TimeUnit.SECONDS);
                    return new Object();
                } catch (Exception error) {
                    throw new AssertionError("Callback blocked another thread's forget", error);
                }
            });
            holder[0] = lazy;
            require(lazy.get() != null, "Callback returned unexpected null");
        } finally {
            executor.shutdownNow();
        }
    }

    static boolean lockOrderProbe(Class<?> type, String label) throws Exception {
        Object external = new Object();
        Object value = new Object();
        var externalHeld = new CountDownLatch(1);
        var factoryEntered = new CountDownLatch(1);
        var failure = new AtomicReference<Throwable>();
        Supplier<?> lazy = create(type, () -> {
            factoryEntered.countDown();
            synchronized (external) { return value; }
        });
        var externalFirst = daemon(label + "-external-first", failure, () -> {
            synchronized (external) {
                externalHeld.countDown();
                await(factoryEntered);
                require(lazy.get() == value, "Wrong value");
            }
        });
        var lazyFirst = daemon(label + "-lazy-first", failure, () -> {
            await(externalHeld);
            require(lazy.get() == value, "Wrong value");
        });
        externalFirst.start();
        lazyFirst.start();
        var bean = ManagementFactory.getThreadMXBean();
        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(10);
        while (System.nanoTime() < deadline) {
            if (failure.get() != null) throw new AssertionError("Lock fixture failed", failure.get());
            long[] blocked = bean.findMonitorDeadlockedThreads();
            if (blocked != null && Arrays.stream(blocked).anyMatch(id -> id == externalFirst.getId())
                    && Arrays.stream(blocked).anyMatch(id -> id == lazyFirst.getId())) {
                System.out.println(label + ": JVM confirmed monitor cycle (controlled fixture, not in-game evidence)");
                for (var info : bean.getThreadInfo(new long[]{externalFirst.getId(), lazyFirst.getId()}, true, true)) {
                    System.out.println(info);
                }
                return true;
            }
            if (!externalFirst.isAlive() && !lazyFirst.isAlive()) {
                System.out.println(label + ": both threads completed");
                return false;
            }
            Thread.sleep(10);
        }
        throw new AssertionError(label + ": timeout without a verified monitor cycle");
    }

    static Thread daemon(String name, AtomicReference<Throwable> failure, Runnable action) {
        var thread = new Thread(() -> {
            try { action.run(); } catch (Throwable error) { failure.compareAndSet(null, error); }
        }, name);
        thread.setDaemon(true);
        return thread;
    }

    static long stress(Class<?> type) throws Throwable {
        Supplier<?> lazy = (Supplier<?>) type.getMethod("of", Supplier.class)
                .invoke(null, (Supplier<byte[]>) () -> new byte[]{1, 2, 3});
        var forget = MethodHandles.publicLookup().findVirtual(type, "forget", MethodType.methodType(void.class))
                .bindTo(lazy);
        var pool = Executors.newFixedThreadPool(8, task -> {
            Thread thread = new Thread(task);
            thread.setDaemon(true);
            return thread;
        });
        CountDownLatch start = new CountDownLatch(1);
        var results = new ArrayList<Future<Long>>();
        try {
            for (int t = 0; t < 8; t++) {
                results.add(pool.submit(() -> {
                    start.await();
                    long failures = 0;
                    for (int i = 0; i < 250000; i++) {
                        byte[] bytes = (byte[]) lazy.get();
                        if (bytes == null) { failures++; continue; }
                        require(new ByteArrayInputStream(bytes).read() == 1, "Corrupt resource bytes");
                        try { forget.invokeExact(); } catch (Throwable ex) { throw new AssertionError(ex); }
                    }
                    return failures;
                }));
            }
            start.countDown();
            long failures = 0;
            for (var result : results) failures += result.get(30, TimeUnit.SECONDS);
            return failures;
        } finally {
            pool.shutdownNow();
        }
    }

    static Class<?> define(byte[] bytes) {
        // Platform-only parent proves the patched class needs neither CDC nor a new dynamically created helper.
        return new ClassLoader(ClassLoader.getPlatformClassLoader()) {
            Class<?> load() { return defineClass(TARGET.replace('/', '.'), bytes, 0, bytes.length); }
        }.load();
    }
    static ClassNode read(byte[] bytes) {
        ClassNode node = new ClassNode();
        new ClassReader(bytes).accept(node, 0);
        return node;
    }
    static byte[] write(ClassNode node) {
        ClassWriter writer = new ClassWriter(0);
        node.accept(writer);
        return writer.toByteArray();
    }
    static String hash(byte[] bytes) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
    }
    static void require(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
