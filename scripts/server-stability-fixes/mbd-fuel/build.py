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
original=out/'original/com/lowdragmc/mbd2/api/recipe/RecipeLogic.class'
original.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(server/'mods/multiblocked2-1.20.1-1.0.38.a.jar') as z: original.write_bytes(z.read('com/lowdragmc/mbd2/api/recipe/RecipeLogic.class'))
if hashlib.sha256(original.read_bytes()).hexdigest() != '5433b3595109dc6ec3fd153355acf20dc26ac4982458c771b323cabe6e386a6e':
 raise RuntimeError('Target class hash mismatch; regenerate and review the patch for this mod version')
stubs={
'net.minecraft.world.item.crafting.RecipeManager':'public class RecipeManager {}',
'com.lowdragmc.mbd2.api.capability.recipe.IRecipeCapabilityHolder':'public interface IRecipeCapabilityHolder {}',
'com.lowdragmc.mbd2.api.capability.recipe.IO':'public enum IO { IN,OUT }',
'com.lowdragmc.mbd2.api.machine.IMachine':'''public interface IMachine extends com.lowdragmc.mbd2.api.capability.recipe.IRecipeCapabilityHolder {
 com.lowdragmc.mbd2.api.recipe.MBDRecipeType getRecipeType();
 com.lowdragmc.mbd2.api.recipe.MBDRecipe modifyFuelRecipe(com.lowdragmc.mbd2.api.recipe.MBDRecipe r);
}''',
'com.lowdragmc.mbd2.api.recipe.MBDRecipeType':'''public class MBDRecipeType {
 public boolean required=true;public int searches;public final java.util.List<MBDRecipe> candidates=new java.util.ArrayList<>();
 public java.util.List<MBDRecipe> searchFuelRecipe(net.minecraft.world.item.crafting.RecipeManager manager,com.lowdragmc.mbd2.api.capability.recipe.IRecipeCapabilityHolder machine){searches++;return candidates;}
}''',
'com.lowdragmc.mbd2.api.recipe.MBDRecipe':'''public class MBDRecipe {
 public int duration,checks,ioCalls,consumed;public boolean condition=true,input=true;public MBDRecipe replacement;
 public ActionResult checkConditions(RecipeLogic logic){checks++;return new ActionResult(condition);}
 public boolean handleRecipeIO(com.lowdragmc.mbd2.api.capability.recipe.IO io,com.lowdragmc.mbd2.api.capability.recipe.IRecipeCapabilityHolder m){if(io!=com.lowdragmc.mbd2.api.capability.recipe.IO.IN)throw new AssertionError();ioCalls++;if(input)consumed++;return input;}
 public record ActionResult(boolean success){public boolean isSuccess(){return success;}}
}''',
'com.lowdragmc.mbd2.api.recipe.RecipeLogic':'''public class RecipeLogic {
 public com.lowdragmc.mbd2.api.machine.IMachine machine;
 public int fuelTime,fuelMaxTime;public MBDRecipe lastFuelRecipe;
 public boolean needFuel(){return machine.getRecipeType().required;}
 public com.lowdragmc.mbd2.api.machine.IMachine getMachine(){return machine;}
 public net.minecraft.world.item.crafting.RecipeManager getRecipeManager(){return new net.minecraft.world.item.crafting.RecipeManager();}
 public boolean handleFuelRecipe(){throw new AssertionError("Test stub must be replaced by actual method bytecode");}
}''',
}
sources=[]
for name,body in stubs.items():
 p=out/'stubs'/Path(name.replace('.','/')+'.java');p.parent.mkdir(parents=True,exist_ok=True);p.write_text('package '+name.rsplit('.',1)[0]+';\n'+body+'\n');sources.append(p)
cp=os.pathsep.join(map(str,deps));logs=[]
def run(cmd):
 p=subprocess.run(list(map(str,cmd)),text=True,capture_output=True);print(p.stdout,end='');print(p.stderr,end='');logs.append(p.stdout+p.stderr)
 if p.returncode:raise RuntimeError('Command failed')
run([jdk/'javac','--release','17','-cp',cp,'-d',out/'classes',here/'BuildFuelFix.java',here/'FuelRegression.java',*sources])
runtime=str(out/'classes')+os.pathsep+cp
run([jdk/'java','-Xverify:all','-cp',runtime,'BuildFuelFix',original,out])
for kind in ['original','fixed']:
 run([jdk/'java','-Xverify:all','-cp',str(out/('fixture-'+kind))+os.pathsep+runtime,'FuelRegression',kind])
(out/'test-results.txt').write_text(''.join(logs))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
manifest={'target':'Multiblocked2 1.20.1-1.0.38.a','jar_sha256':sha(server/'mods/multiblocked2-1.20.1-1.0.38.a.jar'),'original_class_sha256':sha(original),'files':{str(p.relative_to(out)):sha(p) for p in out.rglob('*.badiff')}}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
