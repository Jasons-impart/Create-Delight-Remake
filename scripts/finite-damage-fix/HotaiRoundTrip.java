import java.io.*;
import java.nio.file.*;
import java.util.*;
import org.badiff.MemoryDiffs;
import org.badiff.imp.MemoryDiff;
import org.badiff.io.DefaultSerialization;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.tree.ClassNode;
import youyihj.hotai.transformers.BytecodeTransformer;
import youyihj.hotai.transformers.DiffTransformer;

/** Exercise the installed Hotai 1.0 converters, not a different binary diff format. */
public final class HotaiRoundTrip {
    static byte[] normalized(ClassNode node) {
        ClassWriter writer = new ClassWriter(0);
        node.accept(writer);
        return writer.toByteArray();
    }

    public static void main(String[] args) throws Exception {
        Path mods = Path.of(args[0]), patch = Path.of(args[1]);
        Path converted = Path.of(args[2]).resolve("hotai"), replayed = Path.of(args[3]).resolve("hotai");
        Map<String, String> targets = new LinkedHashMap<>();
        targets.put(BuildDamageFix.TOAD, "alexsmobs-1.22.9.jar");
        targets.put(BuildDamageFix.RULES, "ApothicAttributes-1.20.1-1.3.7.jar");
        for (var entry : targets.entrySet()) {
            String name = entry.getKey();
            byte[] original = BuildDamageFix.read(mods.resolve(entry.getValue()), name);
            byte[] expected = Files.readAllBytes(patch.resolve("hotai/" + name + ".class"));
            Path staged = converted.resolve(name + ".class");
            Files.createDirectories(staged.getParent());
            Files.write(staged, expected, StandardOpenOption.CREATE_NEW);
            ClassNode first = new BytecodeTransformer(converted, Map.of(name, expected))
                    .transform(BuildDamageFix.parse(original), null);
            if (Files.exists(staged) || !Arrays.equals(normalized(first), normalized(BuildDamageFix.parse(expected))))
                throw new AssertionError("First-load replacement failed: " + name);
            MemoryDiff diff = new MemoryDiff();
            Path diffPath = converted.resolve(name + ".badiff");
            try (InputStream in = Files.newInputStream(diffPath)) {
                diff.deserialize(DefaultSerialization.newInstance(), in);
                if (in.read() != -1) throw new AssertionError("Trailing diff data: " + name);
            }
            byte[] baseline = normalized(BuildDamageFix.parse(original));
            if (!Arrays.equals(MemoryDiffs.apply(baseline, diff), expected)
                    || !Arrays.equals(MemoryDiffs.undo(expected, diff), baseline))
                throw new AssertionError("Serialized diff apply/undo mismatch: " + name);
            ClassNode second = new DiffTransformer(Map.of(name, diff))
                    .transform(BuildDamageFix.parse(original), null);
            byte[] result = normalized(second);
            if (!Arrays.equals(result, normalized(first)))
                throw new AssertionError("Second-load replay failed: " + name);
            // Verify all methods again and leave replayed classes for semantic regression tests.
            BuildDamageFix.write(second);
            Path replayPath = replayed.resolve(name + ".class");
            Files.createDirectories(replayPath.getParent());
            Files.write(replayPath, result, StandardOpenOption.CREATE_NEW);
            System.out.println("PASS: actual Hotai first-load conversion, serialized apply/undo and second-load replay: " + name);
        }
    }
}
