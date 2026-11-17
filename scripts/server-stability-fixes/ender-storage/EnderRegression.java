import java.lang.reflect.*;
import java.nio.file.*;
import java.util.*;
import net.minecraft.world.level.*;
import net.minecraft.server.*;
import net.minecraft.server.level.*;
import net.minecraft.nbt.*;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.fml.loading.FMLEnvironment;

/** Tests the actual EnderSavedData class; game/storage API boundaries are minimal substitutes. */
public class EnderRegression {
    static final String NAME="com.buuz135.functionalstorage.world.EnderSavedData";
    static final String HANDLER="com.buuz135.functionalstorage.inventory.EnderInventoryHandler";
    static int checks;
    static void check(boolean ok){checks++;if(!ok)throw new AssertionError("Check "+checks);}
    static class Harness {
        final Class<?> type; final Method get; int clientLoads;
        Harness(byte[] target,Path classes)throws Exception{
            ClassLoader loader=new ClassLoader(EnderRegression.class.getClassLoader()){
                protected Class<?> loadClass(String name,boolean resolve)throws ClassNotFoundException{
                    if(name.startsWith("net.minecraft.client.")){clientLoads++;throw new RuntimeException("Attempted to load class "+name+" for invalid dist DEDICATED_SERVER");}
                    if(name.equals(NAME)||name.startsWith(HANDLER)){
                        var c=findLoadedClass(name);
                        if(c==null)try{byte[] b=name.equals(NAME)?target:Files.readAllBytes(classes.resolve(name.replace('.','/')+".class"));c=defineClass(name,b,0,b.length);}catch(java.io.IOException e){throw new ClassNotFoundException(name,e);}
                        if(resolve)resolveClass(c);return c;
                    }
                    return super.loadClass(name,resolve);
                }
            };
            type=loader.loadClass(NAME);get=type.getMethod("getInstance",LevelAccessor.class);
        }
        Object get(LevelAccessor level)throws Exception{return get.invoke(null,level);}
        Object frequency(Object manager,String id)throws Exception{return type.getMethod("getFrequency",String.class).invoke(manager,id);}
        CompoundTag save(Object manager)throws Exception{return (CompoundTag)type.getMethod("m_7176_",CompoundTag.class).invoke(manager,new CompoundTag());}
    }
    static void count(Object handler,int value)throws Exception{handler.getClass().getField("count").setInt(handler,value);}
    static int count(Object handler)throws Exception{return handler.getClass().getField("count").getInt(handler);}
    public static void main(String[] args)throws Exception{
        var original=new Harness(Files.readAllBytes(Path.of(args[0])),Path.of(args[2]));
        try{original.get(new Level(false));throw new AssertionError("No original failure");}
        catch(InvocationTargetException e){check(e.getCause().getMessage().contains("invalid dist DEDICATED_SERVER"));}
        check(original.clientLoads>0);
        var h=new Harness(Files.readAllBytes(Path.of(args[1])),Path.of(args[2]));
        var server=new MinecraftServer();server.overworld=new ServerLevel(server);var mars=new ServerLevel(server);
        Object real=h.get(mars);check(real==h.get(server.overworld));check(server.overworld.storage.values.size()==1);check(mars.storage.values.isEmpty());
        var realInventory=h.frequency(real,"same-frequency");count(realInventory,123456);
        // Virtual blueprint storage and repeated clear/export operations never alter persistent data.
        for(boolean clientFlag:new boolean[]{false,true})for(int n=0;n<100;n++){
            var virtual=new Level(clientFlag);Object isolated=h.get(virtual);check(isolated!=real);check(isolated!=h.type.getField("CLIENT").get(null));
            var inventory=h.frequency(isolated,"same-frequency");check(count(inventory)==0);count(inventory,8);count(inventory,0);
            check(count(realInventory)==123456);check(h.type.getMethod("getLevel").invoke(isolated)==virtual);
        }
        check(h.get(null)==null);check(h.get(new LevelAccessor(){})==null);
        // Save/load remains the actual mod implementation: same named store, cross-dimension cache,
        // frequency map and payload are preserved. Only the inventory payload API is substituted.
        CompoundTag saved=h.save(real);check(saved.m_128469_("Ender").m_128431_().equals(Set.of("same-frequency")));
        var otherServer=new MinecraftServer();otherServer.overworld=new ServerLevel(otherServer);otherServer.overworld.storage.disk=saved;
        Object loaded=h.get(otherServer.overworld);check(count(h.frequency(loaded,"same-frequency"))==123456);
        check(loaded!=real);check(h.get(mars)==real);
        FMLEnvironment.dist=Dist.CLIENT;
        try{
            check(h.get(new Level(true))==h.type.getField("CLIENT").get(null));
            check(h.get(new Level(false))!=h.type.getField("CLIENT").get(null));
            check(h.get(mars)==real);
        }finally{FMLEnvironment.dist=Dist.DEDICATED_SERVER;}
        check(h.clientLoads==0);
        System.out.println("PASS: original dedicated-server crash reproduced; virtual inventories isolated across 200 exports; persistent cross-dimension lookup, save/load and real client cache preserved; no client-only class loaded; "+checks+" assertions");
    }
}
