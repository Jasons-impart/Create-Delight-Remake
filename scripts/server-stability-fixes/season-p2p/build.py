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
deps += [server/'mods/hotai-1.0.jar',server/'libraries/cpw/mods/modlauncher/10.0.9/modlauncher-10.0.9.jar',server/'libraries/org/slf4j/slf4j-api/2.0.1/slf4j-api-2.0.1.jar',server/'libraries/it/unimi/dsi/fastutil/8.5.9/fastutil-8.5.9.jar']
weather_jar=args.weather_jar.resolve() if args.weather_jar else server/'mods/EclipticSeasons-1.20.1-forge-0.13.8.1-all.jar'
targets={weather_jar:'com/teamtea/eclipticseasons/common/core/snow/WeatherStatusKeeper',server/'mods/appliedcreate-1.20.1-1.1.6.jar':'com/loliball/appliedcreate/p2p/StressP2PTunnelPart'}
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
expected_classes={'com/teamtea/eclipticseasons/common/core/snow/WeatherStatusKeeper':'b803fdd1ec1ce7553a5284637b9ea204c957e15a675f753720578a8daab1125c','com/loliball/appliedcreate/p2p/StressP2PTunnelPart':'eb73a80803764459f4bf45b692ebdbe7fb177e645da50fb1bcf84cd1ed192ab8'}
manifest={'patch_id':'season-p2p-20261116','targets':[]}
for jar,cls in targets.items():
 with zipfile.ZipFile(jar) as z:
  p=out/'original'/(cls+'.class');p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(cls+'.class'))
 if sha(p)!=expected_classes[cls]:raise RuntimeError('Target class hash mismatch: '+cls)
 manifest['targets'].append({'jar':jar.name,'jar_sha256':sha(jar),'class':cls,'original_class_sha256':sha(p)})
stubs={
'kotlin.Unit':'public final class Unit { public static final Unit INSTANCE=new Unit(); }',
'kotlin.jvm.functions.Function0':'public interface Function0<T> { T invoke(); }',
'kotlin.jvm.internal.Intrinsics':'public class Intrinsics { public static void checkNotNullParameter(Object o,String name){if(o==null)throw new NullPointerException(name);} }',
'net.minecraft.server.TickTask':'public class TickTask implements Runnable { public final int tick;public final Runnable action;public TickTask(int t,Runnable a){tick=t;action=a;}public void run(){action.run();} }',
'net.minecraft.server.MinecraftServer':'''public class MinecraftServer {
 public int tick; public boolean running=true,stopped;public int enqueued; public final java.util.ArrayDeque<Runnable> queue=new java.util.ArrayDeque<>();
 public boolean m_130010_(){return running;}public boolean m_129918_(){return stopped;}public int m_129921_(){return tick;}
 public void m_6937_(Runnable r){enqueued++;queue.add(r);}public void poll(){queue.remove().run();}
}''',
'com.loliball.appliedcreate.p2p.StressP2PTunnelPart':'''public class StressP2PTunnelPart {
 private void scheduleForNextTick(net.minecraft.server.MinecraftServer s,int t,kotlin.jvm.functions.Function0<kotlin.Unit> c){throw new AssertionError("not transplanted");}
 private static void scheduleForNextTick$lambda$0(net.minecraft.server.MinecraftServer s,int t,StressP2PTunnelPart p,kotlin.jvm.functions.Function0<kotlin.Unit> c){throw new AssertionError("not transplanted");}
}''',
'net.minecraft.util.RandomSource':'public interface RandomSource { int m_188503_(int bound); }',
'net.minecraft.world.level.Level':'public class Level {}',
'net.minecraft.server.level.ServerLevel':'''public class ServerLevel extends net.minecraft.world.level.Level {
 public final java.util.concurrent.atomic.AtomicInteger reads=new java.util.concurrent.atomic.AtomicInteger();public volatile boolean contested;public int draw;
 public net.minecraft.util.RandomSource m_213780_(){reads.incrementAndGet();return b->{if(contested)throw new IllegalStateException("World RNG contested");return draw;};}
}''',
'net.minecraft.core.Holder':'public class Holder<T> {}',
'com.teamtea.eclipticseasons.common.core.biome.WeatherManager':'''public class WeatherManager {
 public static class BiomeWeather {public byte snowDepth;public long lastRainTime;public byte getSnowDepth(){return snowDepth;}}
 public static final java.util.Map<net.minecraft.core.Holder<?>,BiomeWeather> weather=new java.util.concurrent.ConcurrentHashMap<>();
 public static BiomeWeather getBiomeWeather(net.minecraft.world.level.Level l,net.minecraft.core.Holder<?> h){return weather.get(h);}
}''',
'com.teamtea.eclipticseasons.common.core.snow.WeatherStatusKeeper':'''public class WeatherStatusKeeper {
 public final java.util.Set<net.minecraft.core.Holder<?>> biomeUse=new java.util.HashSet<>();
 public final java.util.Map<net.minecraft.core.Holder<?>,it.unimi.dsi.fastutil.ints.IntLongMutablePair> snowDepthRecord=new java.util.HashMap<>();
 public boolean change;public Object cacheTag;public int changed;
 protected void setChange(){change=true;cacheTag=null;changed++;}
 protected void updateBiomeWhenEndTick(net.minecraft.server.level.ServerLevel l){throw new AssertionError("not transplanted");}
 public void update(net.minecraft.server.level.ServerLevel l){updateBiomeWhenEndTick(l);}
}'''
}
sources=[]
for name,body in stubs.items():
 p=out/'stubs'/Path(name.replace('.','/')+'.java');p.parent.mkdir(parents=True,exist_ok=True);p.write_text('package '+name.rsplit('.',1)[0]+';\n'+body+'\n');sources.append(p)
cp=os.pathsep.join(map(str,deps));logs=[]
def run(cmd):
 p=subprocess.run(list(map(str,cmd)),text=True,capture_output=True);print(p.stdout,end='');print(p.stderr,end='');logs.append(p.stdout+p.stderr)
 if p.returncode:raise RuntimeError('Command failed')
run([jdk/'javac','--release','17','-cp',cp,'-d',out/'classes',here/'BuildFixes.java',here/'Regression.java',*sources])
runtime=str(out/'classes')+os.pathsep+cp
run([jdk/'java','-Xverify:all','-cp',runtime,'BuildFixes',out/'original',out])
for kind in ['original','fixed']:
 run([jdk/'java','-Xverify:all','-cp',str(out/('fixture-'+kind))+os.pathsep+runtime,'Regression',kind])
(out/'test-results.txt').write_text(''.join(logs))
manifest['files']={str(p.relative_to(out/'converted')):sha(p) for p in (out/'converted').rglob('*.badiff')}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
