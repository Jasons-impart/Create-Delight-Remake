import argparse,hashlib,json,os,subprocess,zipfile
from pathlib import Path

here=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description='Generate and replay version-bound Hotai patches with regression fixtures')
parser.add_argument('--server',type=Path,required=True,help='Runtime directory containing mods/ and libraries/')
parser.add_argument('--jdk',type=Path,required=True,help='JDK bin directory (javac and java)')
parser.add_argument('--out',type=Path,required=True,help='New output directory; never overwrites existing output')
parser.add_argument('--weather-jar',type=Path,help='Ecliptic Seasons target JAR (season-p2p only)')
args=parser.parse_args()
server=args.server.resolve()
out=args.out.resolve();out.mkdir(parents=True,exist_ok=False)
jdk=args.jdk.resolve()
deps=[server/'libraries/org/ow2/asm'/m/'9.8'/f'{m}-9.8.jar' for m in ['asm','asm-tree','asm-analysis']]
deps += [server/'mods/hotai-1.0.jar',server/'libraries/cpw/mods/modlauncher/10.0.9/modlauncher-10.0.9.jar',server/'libraries/org/slf4j/slf4j-api/2.0.1/slf4j-api-2.0.1.jar']
original=out/'original/com/buuz135/functionalstorage/world/EnderSavedData.class'
original.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(server/'mods/functionalstorage-1.20.1-1.2.14.jar') as z: original.write_bytes(z.read('com/buuz135/functionalstorage/world/EnderSavedData.class'))
if hashlib.sha256(original.read_bytes()).hexdigest() != '3262085932988b248f9425e01860771363035138203329c3f14f6eac09b83763':
 raise RuntimeError('Target class hash mismatch; regenerate and review the patch for this mod version')
stubs={
'net.minecraft.resources.ResourceKey': 'public class ResourceKey {}',
'net.minecraft.world.level.LevelAccessor':'public interface LevelAccessor {}',
'net.minecraft.world.level.Level': '''public class Level implements LevelAccessor {
 public static final net.minecraft.resources.ResourceKey f_46428_=new net.minecraft.resources.ResourceKey();
 public final boolean f_46443_; public Level(boolean client){f_46443_=client;}
}''',
'net.minecraft.nbt.Tag':'public class Tag {}',
'net.minecraft.nbt.CompoundTag':'''public class CompoundTag extends Tag {
 public final java.util.Map<String,Tag> values=new java.util.HashMap<>();
 public CompoundTag m_128469_(String k){return (CompoundTag)values.getOrDefault(k,new CompoundTag());}
 public java.util.Set<String> m_128431_(){return values.keySet();}
 public Tag m_128365_(String k,Tag v){return values.put(k,v);}
}''',
'net.minecraft.world.level.saveddata.SavedData':'''public abstract class SavedData {
 public abstract net.minecraft.nbt.CompoundTag m_7176_(net.minecraft.nbt.CompoundTag tag);
 public void m_77762_(){}
}''',
'net.minecraft.world.level.storage.DimensionDataStorage':'''public class DimensionDataStorage {
 public final java.util.Map<String,net.minecraft.world.level.saveddata.SavedData> values=new java.util.HashMap<>();
 public net.minecraft.nbt.CompoundTag disk;
 public net.minecraft.world.level.saveddata.SavedData m_164861_(java.util.function.Function<net.minecraft.nbt.CompoundTag,net.minecraft.world.level.saveddata.SavedData> loader,java.util.function.Supplier<net.minecraft.world.level.saveddata.SavedData> factory,String key) {
 return values.computeIfAbsent(key,k->disk==null?factory.get():loader.apply(disk));
 }
}''',
'net.minecraft.server.MinecraftServer':'''public class MinecraftServer {
 public net.minecraft.server.level.ServerLevel overworld;
 public net.minecraft.server.level.ServerLevel m_129880_(net.minecraft.resources.ResourceKey key){return overworld;}
}''',
'net.minecraft.server.level.ServerLevel':'''public class ServerLevel extends net.minecraft.world.level.Level {
 public final net.minecraft.server.MinecraftServer server; public final net.minecraft.world.level.storage.DimensionDataStorage storage=new net.minecraft.world.level.storage.DimensionDataStorage();
 public ServerLevel(net.minecraft.server.MinecraftServer s){super(false);server=s;}
 public net.minecraft.server.MinecraftServer m_7654_(){return server;}
 public net.minecraft.world.level.storage.DimensionDataStorage m_8895_(){return storage;}
}''',
'net.minecraftforge.api.distmarker.Dist':'public enum Dist { CLIENT, DEDICATED_SERVER }',
'net.minecraftforge.fml.loading.FMLEnvironment':'public class FMLEnvironment { public static net.minecraftforge.api.distmarker.Dist dist=net.minecraftforge.api.distmarker.Dist.DEDICATED_SERVER; }',
'com.buuz135.functionalstorage.inventory.EnderInventoryHandler':'''public class EnderInventoryHandler {
 public int count; public boolean locked; public final Object manager; public final String frequency;
 public EnderInventoryHandler(String f,com.buuz135.functionalstorage.world.EnderSavedData m){frequency=f;manager=m;}
 public net.minecraft.nbt.CompoundTag serializeNBT(){var t=new Payload();t.count=count;t.locked=locked;return t;}
 public void deserializeNBT(net.minecraft.nbt.CompoundTag tag){var t=(Payload)tag;count=t.count;locked=t.locked;}
 public static class Payload extends net.minecraft.nbt.CompoundTag {public int count;public boolean locked;}
}''',
# Compile-only target API; runtime uses the actual original/patched class in a child-first loader.
'com.buuz135.functionalstorage.world.EnderSavedData':'public class EnderSavedData {}',
}
sources=[]
for name,body in stubs.items():
 p=out/'stubs'/Path(name.replace('.','/')+'.java');p.parent.mkdir(parents=True,exist_ok=True)
 p.write_text('package '+name.rsplit('.',1)[0]+';\n'+body+'\n');sources.append(p)
cp=os.pathsep.join(map(str,deps));logs=[]
def run(cmd):
 p=subprocess.run(list(map(str,cmd)),text=True,capture_output=True)
 print(p.stdout,end='');print(p.stderr,end='');logs.append(p.stdout+p.stderr)
 if p.returncode: raise RuntimeError('Command failed')
run([jdk/'javac','--release','17','-cp',cp,'-d',out/'classes',here/'BuildEnderFix.java',here/'EnderRegression.java',*sources])
runtime=str(out/'classes')+os.pathsep+cp
run([jdk/'java','-Xverify:all','-cp',runtime,'BuildEnderFix',original,out])
run([jdk/'java','-Xverify:all','-cp',runtime,'EnderRegression',original,out/'replayed/com/buuz135/functionalstorage/world/EnderSavedData.class',out/'classes'])
(out/'test-results.txt').write_text(''.join(logs))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
manifest={'target':'Functional Storage 1.20.1-1.2.14','jar_sha256':sha(server/'mods/functionalstorage-1.20.1-1.2.14.jar'),'original_class_sha256':sha(original),'files':{str(p.relative_to(out)):sha(p) for p in out.rglob('*.badiff')}}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
