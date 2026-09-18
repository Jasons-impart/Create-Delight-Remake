import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;
import java.util.jar.JarFile;
import org.badiff.imp.MemoryDiff;
import org.badiff.io.DefaultSerialization;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.tree.ClassNode;
import youyihj.hotai.transformers.DiffTransformer;

/** Extract review artifacts through the shipped Hotai transformer; never modifies patches. */
public class InspectHotaiPatch {
    public static void main(String[] args) throws Exception {
        if (args.length != 4) {
            throw new IllegalArgumentException(
                    "Usage: InspectHotaiPatch.java <repository> <internal-name> <original-jar|empty> <output-directory>");
        }
        Path root = Path.of(args[0]).toAbsolutePath().normalize();
        String name = args[1];
        if (!name.matches("[A-Za-z0-9_$]+(/[A-Za-z0-9_$]+)+")) {
            throw new IllegalArgumentException("Expected a JVM internal class name");
        }
        Path output = Path.of(args[3]).toAbsolutePath().normalize();
        if (output.startsWith(root.resolve("hotai"))) {
            throw new IllegalArgumentException("Inspection output must not enter the live hotai directory");
        }
        ClassNode original = new ClassNode();
        // ModLauncher 10.0.9 ClassTransformer's missing-class placeholder.
        original.name = name;
        original.version = 52;
        original.superName = "java/lang/Object";
        if (!args[2].equals("empty")) {
            Path jarPath = Path.of(args[2]);
            System.out.println("Input JAR SHA-256: " + hash(Files.readAllBytes(jarPath)));
            try (JarFile jar = new JarFile(jarPath.toFile())) {
                var entry = jar.getJarEntry(name + ".class");
                if (entry == null) throw new IllegalArgumentException("Target missing from " + jarPath);
                try (var stream = jar.getInputStream(entry)) {
                    new ClassReader(stream.readAllBytes()).accept(original, 0);
                }
            }
        }
        byte[] before = write(original);
        Path patch = root.resolve("hotai/" + name + ".badiff");
        MemoryDiff diff = new MemoryDiff();
        try (var stream = Files.newInputStream(patch)) {
            diff.deserialize(DefaultSerialization.newInstance(), stream);
        }
        ClassNode transformed = new DiffTransformer(Map.of(name, diff)).transform(original, null);
        if (!name.equals(transformed.name)) throw new IllegalStateException("Unexpected output class name");
        byte[] after = write(transformed);
        save(output.resolve("before/" + name + ".class"), before);
        save(output.resolve("after/" + name + ".class"), after);
        System.out.println("Patch SHA-256: " + hash(Files.readAllBytes(patch)));
        System.out.println("Normalized input SHA-256: " + hash(before));
        System.out.println("Patched class SHA-256: " + hash(after));
        System.out.println("Extracted: " + name + " (" + after.length + " bytes)");
    }
    private static byte[] write(ClassNode node) {
        ClassWriter writer = new ClassWriter(0);
        node.accept(writer);
        return writer.toByteArray();
    }
    private static void save(Path destination, byte[] bytes) throws Exception {
        Files.createDirectories(destination.getParent());
        Files.write(destination, bytes);
    }
    private static String hash(byte[] bytes) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
    }
}
