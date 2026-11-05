import java.nio.file.*;
import java.util.*;
import java.util.jar.*;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.*;

/** Offline builder. Does not write to the server directory. */
public final class BuildDamageFix implements Opcodes {
    static final String RULES = "dev/shadowsoffire/attributeslib/api/ALCombatRules";
    static final String TOAD = "com/github/alexthe666/alexsmobs/entity/EntityWarpedToad";
    static final String GUARD = "cdr$finiteDamage";
    static final float SPECIAL_DAMAGE = 1_000_000f;

    static byte[] read(Path jar, String name) throws Exception {
        try (JarFile file = new JarFile(jar.toFile())) {
            return file.getInputStream(file.getJarEntry(name + ".class")).readAllBytes();
        }
    }

    static ClassNode parse(byte[] bytes) {
        ClassNode node = new ClassNode();
        new ClassReader(bytes).accept(node, 0);
        return node;
    }

    static byte[] write(ClassNode node) throws Exception {
        for (MethodNode method : node.methods) {
            if ((method.access & (ACC_ABSTRACT | ACC_NATIVE)) == 0)
                new Analyzer<BasicValue>(new BasicVerifier()).analyze(node.name, method);
        }
        ClassWriter writer = new ClassWriter(ClassWriter.COMPUTE_MAXS);
        node.accept(writer);
        return writer.toByteArray();
    }

    static byte[] patchToad(byte[] bytes) throws Exception {
        ClassNode node = parse(bytes);
        int changes = 0;
        for (MethodNode method : node.methods) {
            if (!method.name.equals("m_8119_") || !method.desc.equals("()V")) continue;
            for (AbstractInsnNode instruction : method.instructions) {
                if (instruction instanceof LdcInsnNode ldc && ldc.cst instanceof Float
                        && ldc.cst.equals(Float.MAX_VALUE)) {
                    // Only the mosquito-specific branch in this version uses MAX_VALUE.
                    AbstractInsnNode previous = instruction.getPrevious();
                    while (previous != null && previous.getOpcode() < 0) previous = previous.getPrevious();
                    if (!(previous instanceof JumpInsnNode jump) || jump.getOpcode() != IFEQ)
                        throw new IllegalStateException("Unexpected mosquito branch layout");
                    AbstractInsnNode condition = previous.getPrevious();
                    while (condition != null && condition.getOpcode() < 0) condition = condition.getPrevious();
                    if (!(condition instanceof TypeInsnNode type) || type.getOpcode() != INSTANCEOF
                            || !type.desc.endsWith("/EntityCrimsonMosquito"))
                        throw new IllegalStateException("MAX_VALUE is not guarded by the mosquito type check");
                    ldc.cst = SPECIAL_DAMAGE;
                    changes++;
                }
            }
        }
        if (changes != 1) throw new IllegalStateException("Expected exactly one special attack, found " + changes);
        return write(node);
    }

    static byte[] patchRules(byte[] bytes) throws Exception {
        ClassNode node = parse(bytes);
        if (node.methods.stream().anyMatch(m -> m.name.equals(GUARD)))
            throw new IllegalStateException("Guard already exists");
        Map<String, Integer> slots = Map.of(
            "getAValue(F)F", 0,
            "getArmorDamageReduction(FFF)F", 0,
            "getDamageAfterArmor(Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/damagesource/DamageSource;FFF)F", 2,
            "getDamageAfterProtection(Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/damagesource/DamageSource;FF)F", 2);
        int changes = 0;
        for (MethodNode method : node.methods) {
            Integer slot = slots.get(method.name + method.desc);
            if (slot == null) continue;
            InsnList guard = new InsnList();
            guard.add(new VarInsnNode(FLOAD, slot));
            guard.add(new MethodInsnNode(INVOKESTATIC, RULES, GUARD, "(F)F", false));
            guard.add(new VarInsnNode(FSTORE, slot));
            method.instructions.insert(guard);
            changes++;
        }
        if (changes != 4) throw new IllegalStateException("Expected four damage entry points, found " + changes);
        MethodNode method = new MethodNode(ACC_PRIVATE | ACC_STATIC | ACC_SYNTHETIC, GUARD, "(F)F", null, null);
        Label finite = new Label();
        Label nonpositive = new Label();
        method.visitCode();
        method.visitVarInsn(FLOAD, 0);
        method.visitMethodInsn(INVOKESTATIC, "java/lang/Float", "isFinite", "(F)Z", false);
        method.visitJumpInsn(IFNE, finite);
        // FCMPL deliberately puts NaN in the nonpositive branch.
        method.visitVarInsn(FLOAD, 0);
        method.visitInsn(FCONST_0);
        method.visitInsn(FCMPL);
        method.visitJumpInsn(IFLE, nonpositive);
        method.visitLdcInsn(SPECIAL_DAMAGE);
        method.visitInsn(FRETURN);
        method.visitLabel(nonpositive);
        method.visitFrame(F_SAME, 0, null, 0, null);
        method.visitInsn(FCONST_0);
        method.visitInsn(FRETURN);
        method.visitLabel(finite);
        method.visitFrame(F_SAME, 0, null, 0, null);
        method.visitVarInsn(FLOAD, 0);
        method.visitInsn(FRETURN);
        method.visitMaxs(2, 1);
        method.visitEnd();
        node.methods.add(method);
        return write(node);
    }

    public static void main(String[] args) throws Exception {
        Path mods = Path.of(args[0]);
        Path output = Path.of(args[1]);
        Files.createDirectories(output);
        Map<String, byte[]> patched = new LinkedHashMap<>();
        patched.put(TOAD, patchToad(read(mods.resolve("alexsmobs-1.22.9.jar"), TOAD)));
        patched.put(RULES, patchRules(read(mods.resolve("ApothicAttributes-1.20.1-1.3.7.jar"), RULES)));
        for (var entry : patched.entrySet()) {
            Path target = output.resolve("hotai/" + entry.getKey() + ".class");
            Files.createDirectories(target.getParent());
            Files.write(target, entry.getValue(), StandardOpenOption.CREATE_NEW);
            System.out.println("Built and ASM-verified " + target);
        }
    }
}
