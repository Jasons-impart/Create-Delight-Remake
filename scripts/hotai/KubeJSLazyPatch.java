import org.badiff.MemoryDiffs;
import org.badiff.imp.MemoryDiff;
import org.badiff.io.DefaultSerialization;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;
import youyihj.hotai.transformers.DiffTransformer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
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
import java.util.function.Supplier;
import java.util.jar.JarFile;

/** Build/check the version-specific HotAI patch without recompiling upstream code. */
public class KubeJSLazyPatch {
    static final String TARGET = "dev/latvian/mods/kubejs/util/Lazy";
    static final String JAR = "mods/kubejs-forge-2001.6.5-build.24.jar";
    static final String SHA256 = "41719240421262acc0f348dfec92dc3c3654983662de6ae0358737029ad09076";

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
        int changed = 0;
        for (var method : node.methods) {
            if ((method.name.equals("get") && method.desc.equals("()Ljava/lang/Object;"))
                    || (method.name.equals("forget") && method.desc.equals("()V"))) {
                require((method.access & (Opcodes.ACC_STATIC | Opcodes.ACC_SYNCHRONIZED)) == 0,
                        "Unexpected access flags on " + method.name);
                method.access |= Opcodes.ACC_SYNCHRONIZED;
                changed++;
            }
        }
        require(changed == 2, "Expected exactly get() and forget()");
        byte[] after = write(node);
        require(before.length == after.length, "Unexpected class size change");
        int byteChanges = 0;
        for (int i = 0; i < before.length; i++) {
            if (before[i] != after[i]) {
                require((before[i] ^ after[i]) == Opcodes.ACC_SYNCHRONIZED,
                        "Unexpected change outside synchronization flags");
                byteChanges++;
            }
        }
        require(byteChanges == 2, "Expected exactly two changed bytes");
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
        long baseline = stress(define(original));
        long patched = stress(patchedClass);
        require(patched == 0, "Patched Lazy returned null under contention");
        if (args[0].equals("build")) {
            Files.createDirectories(destination.getParent());
            Files.write(destination, patch);
        }
        System.out.printf("PASS: two access-flag bytes changed; HotAI round-trip and cache semantics verified%n");
        System.out.printf("Concurrent get/forget: 2,000,000 operations per class; original nulls=%d; patched nulls=%d%n",
                baseline, patched);
        System.out.printf("Patch: %d bytes; SHA-256 %s%n", patch.length, hash(patch));
    }

    static void checkSemantics(Class<?> type) throws Throwable {
        require(java.lang.reflect.Modifier.isSynchronized(type.getMethod("get").getModifiers()), "get lock missing");
        require(java.lang.reflect.Modifier.isSynchronized(type.getMethod("forget").getModifiers()), "forget lock missing");
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
        AtomicInteger attempts = new AtomicInteger();
        Supplier<?> retry = (Supplier<?>) type.getMethod("of", Supplier.class).invoke(null,
                (Supplier<byte[]>) () -> {
                    if (attempts.getAndIncrement() == 0) throw new IllegalStateException("expected");
                    return new byte[]{2};
                });
        boolean threw = false;
        try { retry.get(); } catch (IllegalStateException expected) { threw = true; }
        require(threw && retry.get() != null && attempts.get() == 2, "Factory exception/retry changed");
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
        return new ClassLoader(KubeJSLazyPatch.class.getClassLoader()) {
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
