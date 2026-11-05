import java.lang.reflect.*;
import java.nio.file.*;
import java.util.*;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.damagesource.DamageSource;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.*;

/** Runs the actual original/patched ALCombatRules bytecode with lightweight game API stubs. */
public final class DamageFixRegression {
    static int checks;
    static void check(boolean condition, String message) {
        checks++;
        if (!condition) throw new AssertionError(message);
    }
    static Class<?> load(byte[] bytes) {
        return new ClassLoader(DamageFixRegression.class.getClassLoader()) {
            Class<?> define() { return defineClass(BuildDamageFix.RULES.replace('/', '.'), bytes, 0, bytes.length); }
        }.define();
    }
    static Object invoke(Class<?> cls, String name, Class<?>[] types, Object... args) throws Exception {
        return cls.getMethod(name, types).invoke(null, args);
    }
    static float a(Class<?> cls, float damage) throws Exception {
        return (float) invoke(cls, "getAValue", new Class<?>[]{float.class}, damage);
    }
    static float reduction(Class<?> cls, float damage, float armor, float toughness) throws Exception {
        return (float) invoke(cls, "getArmorDamageReduction", new Class<?>[]{float.class, float.class, float.class}, damage, armor, toughness);
    }
    static float afterArmor(Class<?> cls, float damage, float armor, float toughness) throws Exception {
        return (float) invoke(cls, "getDamageAfterArmor", new Class<?>[]{LivingEntity.class, DamageSource.class, float.class, float.class, float.class},
                null, new DamageSource(), damage, armor, toughness);
    }
    static float afterProtection(Class<?> cls, float damage, float protection) throws Exception {
        return (float) invoke(cls, "getDamageAfterProtection", new Class<?>[]{LivingEntity.class, DamageSource.class, float.class, float.class},
                null, new DamageSource(), damage, protection);
    }
    static void same(float original, float patched, String message) {
        check(Float.floatToRawIntBits(original) == Float.floatToRawIntBits(patched), message);
    }
    public static void main(String[] args) throws Exception {
        Path mods = Path.of(args[0]);
        Path patch = Path.of(args[1]);
        byte[] original = BuildDamageFix.read(mods.resolve("ApothicAttributes-1.20.1-1.3.7.jar"), BuildDamageFix.RULES);
        byte[] fixed = Files.readAllBytes(patch.resolve("hotai/" + BuildDamageFix.RULES + ".class"));
        Class<?> before = load(original);
        Class<?> after = load(fixed);
        // Reproduce the exact observed conversion exception with the original bytecode.
        try {
            reduction(before, Float.POSITIVE_INFINITY, 20f, 8f);
            throw new AssertionError("Original crash did not reproduce");
        } catch (InvocationTargetException e) {
            check(e.getCause() instanceof NumberFormatException, "Expected NumberFormatException");
            check(e.getCause().getMessage().contains("Infinite or NaN"), "Expected the observed crash message");
        }
        System.out.println("PASS: original NumberFormatException: Infinite or NaN reproduced");

        float[] finite = {0f, -0f, 0.001f, 1f, 10f, 20f, 100f, 1_000_000f, 1e20f, Float.MAX_VALUE};
        Random random = new Random(20261105);
        for (int i = 0; i < 210; i++) {
            float damage = i < finite.length ? finite[i] : random.nextFloat() * 100_000f;
            float armor = random.nextFloat() * 1000f;
            float toughness = random.nextFloat() * 100f;
            float protection = random.nextFloat() * 100f;
            same(a(before, damage), a(after, damage), "Finite A-value changed");
            same(reduction(before, damage, armor, toughness), reduction(after, damage, armor, toughness), "Finite reduction changed");
            same(afterArmor(before, damage, armor, toughness), afterArmor(after, damage, armor, toughness), "Finite armor result changed");
            same(afterProtection(before, damage, protection), afterProtection(after, damage, protection), "Finite protection result changed");
        }
        System.out.println("PASS: 840 finite-input results match bit for bit using the server's current formulas");

        for (float invalid : new float[]{Float.POSITIVE_INFINITY, Float.NEGATIVE_INFINITY, Float.NaN}) {
            float normalized = invalid > 0 ? 1_000_000f : 0f;
            same(a(before, normalized), a(after, invalid), "Invalid A-value policy mismatch");
            same(reduction(before, normalized, 20f, 8f), reduction(after, invalid, 20f, 8f), "Invalid reduction policy mismatch");
            same(afterArmor(before, normalized, 20f, 8f), afterArmor(after, invalid, 20f, 8f), "Invalid armor result policy mismatch");
            same(afterProtection(before, normalized, 10f), afterProtection(after, invalid, 10f), "Invalid protection result policy mismatch");
            check(Float.isFinite(afterArmor(after, invalid, 20f, 8f)), "Invalid damage still produced nonfinite result");
        }
        System.out.println("PASS: positive/negative infinity and NaN handled at all four entry points");

        // Verify that the toad change is confined to exactly one constant in the mosquito branch.
        byte[] originalToad = BuildDamageFix.read(mods.resolve("alexsmobs-1.22.9.jar"), BuildDamageFix.TOAD);
        byte[] fixedToad = Files.readAllBytes(patch.resolve("hotai/" + BuildDamageFix.TOAD + ".class"));
        ClassNode originalNode = BuildDamageFix.parse(originalToad);
        ClassNode fixedNode = BuildDamageFix.parse(fixedToad);
        check(originalNode.methods.size() == fixedNode.methods.size(), "Toad methods changed");
        int differences = 0;
        for (int i = 0; i < originalNode.methods.size(); i++) {
            MethodNode left = originalNode.methods.get(i), right = fixedNode.methods.get(i);
            check(left.name.equals(right.name) && left.desc.equals(right.desc), "Toad method signature changed");
            check(left.instructions.size() == right.instructions.size(), "Toad instruction count changed");
            for (int j = 0; j < left.instructions.size(); j++) {
                AbstractInsnNode l = left.instructions.get(j), r = right.instructions.get(j);
                check(l.getOpcode() == r.getOpcode(), "Toad opcode changed");
                if (l instanceof LdcInsnNode x && r instanceof LdcInsnNode y && !Objects.equals(x.cst, y.cst)) {
                    check(left.name.equals("m_8119_") && x.cst.equals(Float.MAX_VALUE) && y.cst.equals(1_000_000f), "Unexpected toad constant change");
                    differences++;
                }
            }
        }
        check(differences == 1, "Expected one changed constant");
        check(Float.isInfinite(Float.MAX_VALUE * 1.5f), "Original amplified special hit should overflow");
        check(Float.isFinite(1_000_000f * 1.5f), "Patched amplified special hit should remain finite");
        System.out.println("PASS: mosquito-specific constant replaced; a representative 1.5x amplification no longer overflows");
        System.out.println("ALL CHECKS PASSED: " + checks);
    }
}
