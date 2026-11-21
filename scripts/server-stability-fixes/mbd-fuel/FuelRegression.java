import java.util.*;
import com.lowdragmc.mbd2.api.machine.IMachine;
import com.lowdragmc.mbd2.api.recipe.*;
import net.minecraft.world.item.crafting.RecipeManager;

public class FuelRegression {
    static int checks;
    static void check(boolean b){checks++;if(!b)throw new AssertionError("Check "+checks);}
    static class Machine implements IMachine {
        final MBDRecipeType type=new MBDRecipeType();int modified;double burningRate=1;
        final Set<MBDRecipe> canceled=Collections.newSetFromMap(new IdentityHashMap<>());
        public MBDRecipeType getRecipeType(){return type;}
        public MBDRecipe modifyFuelRecipe(MBDRecipe r){modified++;return burningRate==0||canceled.contains(r)?null:r.replacement==null?r:r.replacement;}
    }
    static RecipeLogic logic(Machine m,int remaining){var l=new RecipeLogic();l.machine=m;l.fuelTime=remaining;return l;}
    static MBDRecipe recipe(int duration,boolean condition,boolean input){var r=new MBDRecipe();r.duration=duration;r.condition=condition;r.input=input;return r;}
    public static void main(String[] args){
        boolean original=args[0].equals("original");
        // Exact trigger: no remaining fuel, a candidate, stop callback cancels it.
        var stopped=new Machine();stopped.burningRate=0;var candidate=recipe(800,true,true);stopped.type.candidates.add(candidate);var l=logic(stopped,0);
        if(original){
            try{l.handleFuelRecipe();throw new AssertionError("Expected original NPE");}catch(NullPointerException expected){check(stopped.modified==1);check(candidate.checks==0);check(candidate.consumed==0);}
            System.out.println("PASS: real original handleFuelRecipe bytecode reproduces NPE when modification is canceled; no fuel consumed before failure");return;
        }
        check(!l.handleFuelRecipe());check(l.fuelTime==0);check(l.lastFuelRecipe==null);check(candidate.consumed==0);check(candidate.checks==0);
        stopped.burningRate=1;check(l.handleFuelRecipe());check(l.fuelTime==800);check(l.fuelMaxTime==800);check(candidate.consumed==1);check(l.lastFuelRecipe==candidate);
        // Existing fuel and fuel-free machines retain early return, with no lookup/consumption.
        var busy=new Machine();busy.burningRate=0;busy.type.candidates.add(recipe(8,true,true));l=logic(busy,5);check(l.handleFuelRecipe());check(l.fuelTime==5);check(busy.modified==0);check(busy.type.searches==0);
        busy.type.required=false;l=logic(busy,0);check(l.handleFuelRecipe());check(busy.modified==0);check(busy.type.searches==0);
        // A canceled first candidate must not prevent later valid candidates.
        var mixed=new Machine();var first=recipe(800,true,true);var valid=recipe(200,true,true);mixed.canceled.add(first);mixed.type.candidates.addAll(List.of(first,valid));l=logic(mixed,0);
        check(l.handleFuelRecipe());check(first.checks==0);check(first.consumed==0);check(valid.consumed==1);check(l.fuelTime==200);check(l.lastFuelRecipe==valid);
        // Exhaustive combinations: null candidate, false conditions, failed input and durations.
        for(boolean cancel:new boolean[]{false,true})for(boolean condition:new boolean[]{false,true})for(boolean input:new boolean[]{false,true})for(int duration:new int[]{0,1,800}){
            var m=new Machine();var r=recipe(duration,condition,input);m.type.candidates.add(r);if(cancel)m.canceled.add(r);l=logic(m,0);
            boolean consumes=!cancel&&condition&&input;boolean works=consumes&&duration>0;
            check(l.handleFuelRecipe()==works);check(r.consumed==(consumes?1:0));check(r.checks==(cancel?0:1));check(r.ioCalls==(!cancel&&condition?1:0));
            check(l.fuelTime==(consumes?duration:0));check(l.fuelMaxTime==(consumes?duration:0));check(l.lastFuelRecipe==(consumes?r:null));
        }
        var m=new Machine();var raw=recipe(100,true,true);var replacement=recipe(400,true,true);raw.replacement=replacement;m.type.candidates.add(raw);l=logic(m,0);
        check(l.handleFuelRecipe());check(raw.consumed==0);check(replacement.consumed==1);check(l.fuelTime==400);check(l.lastFuelRecipe==replacement);
        var empty=new Machine();l=logic(empty,0);check(!l.handleFuelRecipe());check(l.lastFuelRecipe==null);
        // Repeated canceled ticks preserve inventory; enabling afterward resumes exactly once.
        var repeat=new Machine();var fuel=recipe(800,true,true);repeat.burningRate=0;repeat.type.candidates.add(fuel);l=logic(repeat,0);
        for(int tick=0;tick<10000;tick++){check(!l.handleFuelRecipe());check(fuel.consumed==0);check(l.fuelTime==0);}
        repeat.burningRate=1;check(l.handleFuelRecipe());check(fuel.consumed==1);check(l.fuelTime==800);
        System.out.println("PASS: replayed real handleFuelRecipe bytecode; cancellation consumes nothing, next valid candidate works, existing fuel/no-fuel paths unchanged, condition/IO/replacement/duration cases and 10000 canceled ticks; "+checks+" assertions");
    }
}
