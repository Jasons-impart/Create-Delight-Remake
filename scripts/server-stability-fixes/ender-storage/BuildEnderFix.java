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

/** Offline repair: preserve persisted ServerLevel path, isolate all other Level access. */
public class BuildEnderFix implements Opcodes {
    static final String NAME = "com/buuz135/functionalstorage/world/EnderSavedData";
    static final String LEVEL = "net/minecraft/world/level/Level";
    static ClassNode parse(byte[] b) { var n = new ClassNode(); new ClassReader(b).accept(n, 0); return n; }
    static byte[] bytes(ClassNode n) { var w = new ClassWriter(0); n.accept(w); return w.toByteArray(); }
    public static void main(String[] args) throws Exception {
        byte[] original = Files.readAllBytes(Path.of(args[0])); Path out=Path.of(args[1]);
        var node=parse(original);
        if (!node.name.equals(NAME)) throw new IllegalArgumentException("Wrong target");
        var m=node.methods.stream().filter(x -> x.name.equals("getInstance") && x.desc.equals("(Lnet/minecraft/world/level/LevelAccessor;)L"+NAME+";")).findFirst().orElseThrow();
        TypeInsnNode client=null;
        for(var i:m.instructions) if(i instanceof TypeInsnNode t && t.getOpcode()==INSTANCEOF && t.desc.equals("net/minecraft/client/multiplayer/ClientLevel")) {
            if(client!=null) throw new AssertionError("Duplicate client check"); client=t;
        }
        if(client==null) throw new AssertionError("Expected original client check");
        // Keep the complete ServerLevel branch and its entry label/frame unchanged.
        var load=client.getPrevious();
        if(!(load instanceof VarInsnNode v) || v.getOpcode()!=ALOAD || v.var!=0) throw new AssertionError("Unexpected branch");
        while(load!=null) { var next=load.getNext(); m.instructions.remove(load); load=next; }
        var nonLevel=new LabelNode();var isolated=new LabelNode();var body=new InsnList();
        body.add(new VarInsnNode(ALOAD,0));body.add(new TypeInsnNode(INSTANCEOF,LEVEL));body.add(new JumpInsnNode(IFEQ,nonLevel));
        // Preserve real client cache without resolving a client-only class. On dedicated servers
        // even client-flagged virtual levels must have isolated ephemeral inventories.
        body.add(new FieldInsnNode(GETSTATIC,"net/minecraftforge/fml/loading/FMLEnvironment","dist","Lnet/minecraftforge/api/distmarker/Dist;"));
        body.add(new FieldInsnNode(GETSTATIC,"net/minecraftforge/api/distmarker/Dist","CLIENT","Lnet/minecraftforge/api/distmarker/Dist;"));
        body.add(new JumpInsnNode(IF_ACMPNE,isolated));
        body.add(new VarInsnNode(ALOAD,0));body.add(new TypeInsnNode(CHECKCAST,LEVEL));
        body.add(new FieldInsnNode(GETFIELD,LEVEL,"f_46443_","Z"));body.add(new JumpInsnNode(IFEQ,isolated));
        body.add(new FieldInsnNode(GETSTATIC,NAME,"CLIENT","L"+NAME+";"));body.add(new InsnNode(ARETURN));
        body.add(isolated);body.add(new FrameNode(F_SAME,0,null,0,null));
        body.add(new TypeInsnNode(NEW,NAME));body.add(new InsnNode(DUP));body.add(new VarInsnNode(ALOAD,0));
        body.add(new TypeInsnNode(CHECKCAST,LEVEL));body.add(new MethodInsnNode(INVOKESPECIAL,NAME,"<init>","(L"+LEVEL+";)V",false));body.add(new InsnNode(ARETURN));
        body.add(nonLevel);body.add(new FrameNode(F_SAME,0,null,0,null));body.add(new InsnNode(ACONST_NULL));body.add(new InsnNode(ARETURN));
        m.instructions.add(body);m.maxStack=Math.max(m.maxStack,3);
        // LocalVariableTable end labels belonged to the replaced suffix; remove debug locals only.
        m.localVariables=null;
        for(var method:node.methods)new Analyzer<BasicValue>(new BasicVerifier()).analyze(node.name,method);
        byte[] expected=bytes(node);
        if(new String(expected, java.nio.charset.StandardCharsets.ISO_8859_1).contains("net/minecraft/client/"))throw new AssertionError("Client reference remains");
        Path staged=out.resolve("converted/hotai/"+NAME+".class");Files.createDirectories(staged.getParent());Files.write(staged,expected,StandardOpenOption.CREATE_NEW);
        var first=new BytecodeTransformer(out.resolve("converted/hotai"),Map.of(NAME,expected)).transform(parse(original),null);
        if(Files.exists(staged)||!Arrays.equals(bytes(first),expected))throw new AssertionError("Conversion");
        var diff=new MemoryDiff();
        try(var in=Files.newInputStream(out.resolve("converted/hotai/"+NAME+".badiff"))){diff.deserialize(DefaultSerialization.newInstance(),in);if(in.read()!=-1)throw new AssertionError("Trailing data");}
        byte[] baseline=bytes(parse(original));
        if(!Arrays.equals(MemoryDiffs.apply(baseline,diff),expected)||!Arrays.equals(MemoryDiffs.undo(expected,diff),baseline))throw new AssertionError("apply/undo");
        var replay=new DiffTransformer(Map.of(NAME,diff)).transform(parse(original),null);
        if(!Arrays.equals(bytes(replay),expected))throw new AssertionError("Replay");
        var target=out.resolve("replayed/"+NAME+".class");Files.createDirectories(target.getParent());Files.write(target,bytes(replay),StandardOpenOption.CREATE_NEW);
        System.out.println("PASS: ASM BasicVerifier; client class reference removed; actual Hotai conversion, MemoryDiff apply/undo and replay");
    }
}
