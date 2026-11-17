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

/** Version-pinned, offline ASM patch. Never writes into the server. */
public class BuildFuelFix implements Opcodes {
    static final String NAME="com/lowdragmc/mbd2/api/recipe/RecipeLogic";
    static final String RECIPE="com/lowdragmc/mbd2/api/recipe/MBDRecipe";
    static ClassNode parse(byte[] b){var n=new ClassNode();new ClassReader(b).accept(n,0);return n;}
    static byte[] bytes(ClassNode n){var w=new ClassWriter(0);n.accept(w);return w.toByteArray();}
    static MethodNode fuel(ClassNode n){return n.methods.stream().filter(m->m.name.equals("handleFuelRecipe")&&m.desc.equals("()Z")).findFirst().orElseThrow();}
    static AbstractInsnNode nextCode(AbstractInsnNode n){do{n=n.getNext();}while(n!=null&&n.getOpcode()<0);return n;}
    public static void main(String[] args)throws Exception{
        byte[] original=Files.readAllBytes(Path.of(args[0]));Path out=Path.of(args[1]);var n=parse(original);
        if(!n.name.equals(NAME))throw new AssertionError("Wrong class");
        var m=fuel(n);MethodInsnNode modify=null;
        for(var i:m.instructions)if(i instanceof MethodInsnNode c&&c.name.equals("modifyFuelRecipe")&&c.owner.equals("com/lowdragmc/mbd2/api/machine/IMachine")&&c.desc.equals("(L"+RECIPE+";)L"+RECIPE+";")){
            if(modify!=null)throw new AssertionError("Duplicate call");modify=c;
        }
        if(modify==null)throw new AssertionError("Call absent");
        var store=nextCode(modify);
        if(!(store instanceof VarInsnNode v)||v.getOpcode()!=ASTORE||v.var!=2)throw new AssertionError("Unexpected local");
        var load=nextCode(store);
        if(!(load instanceof VarInsnNode loaded)||loaded.getOpcode()!=ALOAD||loaded.var!=2)throw new AssertionError("Unexpected dereference");
        var loopJump=m.instructions.getLast();
        while(loopJump!=null&&!(loopJump instanceof JumpInsnNode j&&j.getOpcode()==GOTO))loopJump=loopJump.getPrevious();
        if(!(loopJump instanceof JumpInsnNode jump))throw new AssertionError("No loop");
        // Existing continue target has a frame that discards local slot 2. Jumping there
        // is valid with either null or a non-null modified recipe and needs no new frame.
        var guard=new InsnList();guard.add(new VarInsnNode(ALOAD,2));guard.add(new JumpInsnNode(IFNULL,jump.label));
        m.instructions.insert(store,guard);
        for(var method:n.methods)if((method.access&(ACC_ABSTRACT|ACC_NATIVE))==0)new Analyzer<BasicValue>(new BasicVerifier()).analyze(n.name,method);
        byte[] expected=bytes(n);
        // Prove all other class methods/fields/metadata are byte-for-byte preserved after normalization.
        var reverted=parse(expected);var fm=fuel(reverted);MethodInsnNode mc=null;
        for(var i:fm.instructions)if(i instanceof MethodInsnNode c&&c.name.equals("modifyFuelRecipe"))mc=c;
        var st=nextCode(mc);var a=nextCode(st);var b=nextCode(a);
        if(a.getOpcode()!=ALOAD||b.getOpcode()!=IFNULL)throw new AssertionError("Guard mismatch");
        fm.instructions.remove(a);fm.instructions.remove(b);
        if(!Arrays.equals(bytes(reverted),bytes(parse(original))))throw new AssertionError("Unrelated bytecode changed");
        Path staged=out.resolve("converted/hotai/"+NAME+".class");Files.createDirectories(staged.getParent());Files.write(staged,expected,StandardOpenOption.CREATE_NEW);
        var first=new BytecodeTransformer(out.resolve("converted/hotai"),Map.of(NAME,expected)).transform(parse(original),null);
        if(Files.exists(staged)||!Arrays.equals(bytes(first),expected))throw new AssertionError("First conversion");
        var diff=new MemoryDiff();
        try(var in=Files.newInputStream(out.resolve("converted/hotai/"+NAME+".badiff"))){diff.deserialize(DefaultSerialization.newInstance(),in);if(in.read()!=-1)throw new AssertionError("Trailing data");}
        byte[] baseline=bytes(parse(original));
        if(!Arrays.equals(MemoryDiffs.apply(baseline,diff),expected)||!Arrays.equals(MemoryDiffs.undo(expected,diff),baseline))throw new AssertionError("Apply/undo");
        var replay=new DiffTransformer(Map.of(NAME,diff)).transform(parse(original),null);
        if(!Arrays.equals(bytes(replay),expected))throw new AssertionError("Replay");
        var replayPath=out.resolve("replayed/"+NAME+".class");Files.createDirectories(replayPath.getParent());Files.write(replayPath,bytes(replay),StandardOpenOption.CREATE_NEW);
        // Exercise the real original/replayed method bytecode in a minimal host, avoiding
        // game initialization. Helpers and API boundaries are explicitly test substitutes.
        for(var entry:Map.of("fixture-original",original,"fixture-fixed",bytes(replay)).entrySet()){
            var fixture=parse(Files.readAllBytes(out.resolve("classes/"+NAME+".class")));
            fixture.methods.removeIf(x->x.name.equals("handleFuelRecipe"));fixture.methods.add(fuel(parse(entry.getValue())));
            var target=out.resolve(entry.getKey()+"/"+NAME+".class");Files.createDirectories(target.getParent());Files.write(target,bytes(fixture),StandardOpenOption.CREATE_NEW);
        }
        System.out.println("PASS: only ALOAD 2 / IFNULL continue inserted; all other normalized bytecode unchanged; ASM BasicVerifier; actual Hotai conversion, serialized apply/undo and replay");
    }
}
