import java.lang.reflect.*;
import java.util.*;
import java.util.concurrent.*;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.core.Holder;
import kotlin.Unit;
import kotlin.jvm.functions.Function0;
import com.loliball.appliedcreate.p2p.StressP2PTunnelPart;
import com.teamtea.eclipticseasons.common.core.snow.WeatherStatusKeeper;
import com.teamtea.eclipticseasons.common.core.biome.WeatherManager;

public class Regression {
 static int assertions;
 static void check(boolean b){assertions++;if(!b)throw new AssertionError("Assertion "+assertions);}
 static Method schedule;
 static void enqueue(StressP2PTunnelPart p,MinecraftServer s,int tick,Function0<Unit> c)throws Exception{schedule.invoke(p,s,tick,c);}
 static void weatherRecord(boolean original)throws Exception{
  var l=new ServerLevel();var w=new WeatherStatusKeeper();var h=new Holder<Object>();var missing=new Holder<Object>();w.biomeUse.add(h);w.biomeUse.add(missing);
  var v=new WeatherManager.BiomeWeather();v.snowDepth=4;v.lastRainTime=123;WeatherManager.weather.put(h,v);w.cacheTag=new Object();
  // Both actual method versions must still insert and update snow/rain records.
  for(int i=0;i<10000&&!w.snowDepthRecord.containsKey(h);i++)w.update(l);
  check(w.snowDepthRecord.size()==1);var pair=w.snowDepthRecord.get(h);check(pair.leftInt()==4&&pair.rightLong()==123);check(w.change&&w.cacheTag==null);check(w.changed==1);
  w.change=false;w.cacheTag=new Object();for(int i=0;i<1000;i++)w.update(l);check(!w.change);check(w.changed==1);check(w.cacheTag!=null);
  v.snowDepth=7;v.lastRainTime=999;for(int i=0;i<10000&&w.changed==1;i++)w.update(l);check(w.changed==2);check(w.snowDepthRecord.get(h)==pair);check(pair.leftInt()==7&&pair.rightLong()==999);
  // The actual original method fails if the shared world RNG rejects access.
  l.contested=true;
  if(original){try{w.update(l);throw new AssertionError("Expected contested RNG failure");}catch(IllegalStateException expected){check(expected.getMessage().contains("contested"));}}
  else{int reads=l.reads.get();for(int i=0;i<10000;i++)w.update(l);check(l.reads.get()==reads);}
  WeatherManager.weather.clear();
 }
 static void p2pOriginal()throws Exception{
  var p=new StressP2PTunnelPart();var s=new MinecraftServer();int[] callbacks={0};
  enqueue(p,s,0,()->{callbacks[0]++;return Unit.INSTANCE;});s.stopped=true;
  for(int i=0;i<10000;i++){s.poll();check(s.queue.size()==1);}
  check(callbacks[0]==0);check(s.enqueued==10001);
  System.out.println("PASS original real scheduler bytecode reproduces 10000 stop-phase self-requeues at frozen tick");
 }
 static void p2pFixed()throws Exception{
  var p=new StressP2PTunnelPart();var s=new MinecraftServer();int[] calls={0};Function0<Unit> cb=()->{calls[0]++;return Unit.INSTANCE;};
  enqueue(p,s,0,cb);check(s.queue.size()==1);s.poll();check(s.queue.size()==1&&calls[0]==0);s.tick=1;s.poll();check(s.queue.isEmpty()&&calls[0]==1);
  // Delayed requests wait for the same threshold as the original implementation.
  enqueue(p,s,5,cb);for(int t=1;t<=5;t++){s.tick=t;s.poll();check(s.queue.size()==1&&calls[0]==1);}s.tick=6;s.poll();check(calls[0]==2&&s.queue.isEmpty());
  // Queued tasks are discarded without callback or requeue after either stop flag.
  for(boolean running:new boolean[]{true,false})for(boolean stopped:new boolean[]{true,false}){
   if(running&&!stopped)continue;var x=new MinecraftServer();x.tick=10;int[] c={0};enqueue(p,x,10,()->{c[0]++;return Unit.INSTANCE;});x.running=running;x.stopped=stopped;
   x.poll();check(x.queue.isEmpty());check(c[0]==0);int old=x.enqueued;enqueue(p,x,10,cb);check(x.enqueued==old&&x.queue.isEmpty());
  }
  // A callback that is due already must also be suppressed when shutdown begins.
  var due=new MinecraftServer();enqueue(p,due,0,cb);due.tick=20;due.stopped=true;due.poll();check(due.queue.isEmpty()&&calls[0]==2);
  var batch=new MinecraftServer();for(int i=0;i<10000;i++)enqueue(p,batch,100,cb);batch.stopped=true;int n=0;while(!batch.queue.isEmpty()){batch.poll();n++;if(n>10000)throw new AssertionError("queue not draining");}check(n==10000);check(batch.enqueued==10000);check(calls[0]==2);
  System.out.println("PASS fixed real scheduler bytecode: normal/deferred callbacks once; pending and new tasks stop; 10000 pending tasks drain without requeue");
 }
 static void weatherConcurrent()throws Exception{
  var l=new ServerLevel();l.contested=true;var pool=Executors.newFixedThreadPool(8);var tasks=new ArrayList<Future<?>>();
  for(int i=0;i<8;i++)tasks.add(pool.submit(()->{var w=new WeatherStatusKeeper();for(int j=0;j<50000;j++)w.update(l);}));
  try{for(var t:tasks)t.get();}finally{pool.shutdownNow();}check(l.reads.get()==0);
  // Statistical smoke check only: the unchanged bound-20 throttle should still run
  // both paths. Each change is unique so setChange counts successful draws.
  var w=new WeatherStatusKeeper();var h=new Holder<Object>();w.biomeUse.add(h);var v=new WeatherManager.BiomeWeather();WeatherManager.weather.put(h,v);
  for(int i=0;i<50000;i++){v.lastRainTime=i;w.update(l);}check(w.changed>1500&&w.changed<3500);check(l.reads.get()==0);
  WeatherManager.weather.clear();System.out.println("PASS fixed real weather method: 400000 calls on 8 threads use no shared world RNG; record updates/cache invalidation retained; bound-20 throttle smoke count="+w.changed);
 }
 public static void main(String[] args)throws Exception{
  schedule=StressP2PTunnelPart.class.getDeclaredMethod("scheduleForNextTick",MinecraftServer.class,int.class,Function0.class);schedule.setAccessible(true);
  boolean original=args[0].equals("original");weatherRecord(original);
  if(original){p2pOriginal();System.out.println("PASS original actual weather method reproduces rejected shared-RNG access");}
  else{p2pFixed();weatherConcurrent();}
  System.out.println("PASS "+args[0]+" actual target method bytecode in minimal hosts; game APIs are substitutes; assertions="+assertions);
 }
}
