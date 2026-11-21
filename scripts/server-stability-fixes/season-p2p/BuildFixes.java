import java.nio.file.*;
import java.util.*;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.*;
import org.badiff.MemoryDiffs;
import org.badiff.imp.MemoryDiff;
import org.badiff.io.DefaultSerialization;
import youyihj.hotai.transformers.BytecodeTransformer;
import youyihj.hotai.transformers.DiffTransformer;

public class BuildFixes implements Opcodes {
    static final String WEATHER="com/teamtea/eclipticseasons/common/core/snow/WeatherStatusKeeper";
    static final String P2P="com/loliball/appliedcreate/p2p/StressP2PTunnelPart";
    static final String SERVER="net/minecraft/server/MinecraftServer";
    static ClassNode parse(byte[] b){var n=new ClassNode();new ClassReader(b).accept(n,0);return n;}
    static byte[] bytes(ClassNode n){var w=new ClassWriter(0);n.accept(w);return w.toByteArray();}
    static MethodNode method(ClassNode n,String name){return n.methods.stream().filter(m->m.name.equals(name)).reduce((a,b)->{throw new AssertionError("Overloaded "+name);}).orElseThrow();}
    static AbstractInsnNode nextCode(AbstractInsnNode n){do{n=n.getNext();}while(n!=null&&n.getOpcode()<0);return n;}
    static AbstractInsnNode firstCode(MethodNode m){var n=m.instructions.getFirst();while(n!=null&&n.getOpcode()<0)n=n.getNext();return n;}
    static void verify(ClassNode n)throws Exception{for(var m:n.methods)if((m.access&(ACC_NATIVE|ACC_ABSTRACT))==0)new Analyzer<BasicValue>(new BasicVerifier()).analyze(n.name,m);}
    static void patchWeather(ClassNode n){
        var m=method(n,"updateBiomeWhenEndTick");var load=firstCode(m);var get=nextCode(load);var bound=nextCode(get);var draw=nextCode(bound);
        if(!(load instanceof VarInsnNode v)||v.getOpcode()!=ALOAD||v.var!=1)throw new AssertionError("Unexpected world local");
        if(!(get instanceof MethodInsnNode c)||!c.owner.equals("net/minecraft/server/level/ServerLevel")||!c.name.equals("m_213780_")||!c.desc.equals("()Lnet/minecraft/util/RandomSource;"))throw new AssertionError("Unexpected world RNG");
        if(!(bound instanceof IntInsnNode b)||b.operand!=20)throw new AssertionError("Unexpected probability");
        if(!(draw instanceof MethodInsnNode d)||!d.owner.equals("net/minecraft/util/RandomSource")||!d.name.equals("m_188503_")||!d.desc.equals("(I)I"))throw new AssertionError("Unexpected draw");
        m.instructions.remove(load);
        m.instructions.set(get,new MethodInsnNode(INVOKESTATIC,"java/util/concurrent/ThreadLocalRandom","current","()Ljava/util/concurrent/ThreadLocalRandom;",false));
        m.instructions.set(draw,new MethodInsnNode(INVOKEVIRTUAL,"java/util/concurrent/ThreadLocalRandom","nextInt","(I)I",false));
    }
    static void guard(MethodNode m,int serverLocal){
        // These two methods introduce no locals beyond their arguments. Both their
        // existing return and the guard arrive with an empty stack and initial locals.
        var end=m.instructions.getLast();while(end!=null&&end.getOpcode()!=RETURN)end=end.getPrevious();
        if(end==null)throw new AssertionError("No void return");
        var exit=new LabelNode();var frame=new FrameNode(F_SAME,0,null,0,null);
        m.instructions.insertBefore(end,exit);m.instructions.insert(exit,frame);
        var ins=new InsnList();
        ins.add(new VarInsnNode(ALOAD,serverLocal));ins.add(new MethodInsnNode(INVOKEVIRTUAL,SERVER,"m_129918_","()Z",false));ins.add(new JumpInsnNode(IFNE,exit));
        ins.add(new VarInsnNode(ALOAD,serverLocal));ins.add(new MethodInsnNode(INVOKEVIRTUAL,SERVER,"m_130010_","()Z",false));ins.add(new JumpInsnNode(IFEQ,exit));
        m.instructions.insertBefore(firstCode(m),ins);
    }
    public static void main(String[] args)throws Exception{
        Path input=Path.of(args[0]),out=Path.of(args[1]);
        for(String name:List.of(WEATHER,P2P)){
            byte[] original=Files.readAllBytes(input.resolve(name+".class"));var n=parse(original);
            if(!n.name.equals(name))throw new AssertionError("Wrong target");
            List<String> changed;
            if(name.equals(WEATHER)){patchWeather(n);changed=List.of("updateBiomeWhenEndTick");}
            else{
                var schedule=method(n,"scheduleForNextTick");var callback=method(n,"scheduleForNextTick$lambda$0");
                if(!schedule.desc.equals("(L"+SERVER+";ILkotlin/jvm/functions/Function0;)V")||!callback.desc.equals("(L"+SERVER+";IL"+P2P+";Lkotlin/jvm/functions/Function0;)V"))throw new AssertionError("Unexpected scheduler signature");
                guard(schedule,1);guard(callback,0);changed=List.of(schedule.name,callback.name);
            }
            verify(n);byte[] expected=bytes(n);
            // Replacing only the explicitly modified methods must recover the entire
            // normalized original class (including unrelated methods and metadata).
            var reverted=parse(expected);var old=parse(original);
            for(String mn:changed){int i=reverted.methods.indexOf(method(reverted,mn));reverted.methods.set(i,method(old,mn));}
            if(!Arrays.equals(bytes(reverted),bytes(parse(original))))throw new AssertionError("Unrelated class content changed");
            Path staged=out.resolve("converted/hotai/"+name+".class");Files.createDirectories(staged.getParent());Files.write(staged,expected,StandardOpenOption.CREATE_NEW);
            var converted=new BytecodeTransformer(out.resolve("converted/hotai"),Map.of(name,expected)).transform(parse(original),null);
            if(Files.exists(staged)||!Arrays.equals(bytes(converted),expected))throw new AssertionError("Conversion mismatch");
            var diff=new MemoryDiff();try(var in=Files.newInputStream(out.resolve("converted/hotai/"+name+".badiff"))){diff.deserialize(DefaultSerialization.newInstance(),in);if(in.read()!=-1)throw new AssertionError("Trailing bytes");}
            byte[] baseline=bytes(parse(original));
            if(!Arrays.equals(MemoryDiffs.apply(baseline,diff),expected)||!Arrays.equals(MemoryDiffs.undo(expected,diff),baseline))throw new AssertionError("Apply/undo mismatch");
            byte[] replay=bytes(new DiffTransformer(Map.of(name,diff)).transform(parse(original),null));
            if(!Arrays.equals(replay,expected))throw new AssertionError("Hotai replay mismatch");
            var rp=out.resolve("replayed/"+name+".class");Files.createDirectories(rp.getParent());Files.write(rp,replay);
            for(var entry:Map.of("fixture-original",original,"fixture-fixed",replay).entrySet()){
                var fixture=parse(Files.readAllBytes(out.resolve("classes/"+name+".class")));
                for(String mn:changed){fixture.methods.removeIf(m->m.name.equals(mn));fixture.methods.add(method(parse(entry.getValue()),mn));}
                var target=out.resolve(entry.getKey()+"/"+name+".class");Files.createDirectories(target.getParent());Files.write(target,bytes(fixture));
            }
            System.out.println("PASS "+name+": ASM verification; unchanged unrelated class content; actual Hotai conversion/apply/undo/replay");
        }
    }
}
