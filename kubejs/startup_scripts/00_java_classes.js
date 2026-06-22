// priority: 1200

global.CDStartupJavaClasses = {
    // Lightman's Currency
    $AuctionTradeData: Java.loadClass("io.github.lightman314.lightmanscurrency.common.traders.auction.tradedata.AuctionTradeData"),
    $ItemTradeData: Java.loadClass("io.github.lightman314.lightmanscurrency.common.traders.item.tradedata.ItemTradeData"),
    $PlayerListing: Java.loadClass("io.github.lightman314.lightmanscurrency.common.traders.rules.types.PlayerListing"),
    $TraderAPI: Java.loadClass("io.github.lightman314.lightmanscurrency.api.traders.TraderAPI"),
    $TraderData: Java.loadClass("io.github.lightman314.lightmanscurrency.api.traders.TraderData"),
    $TraderDataCache: Java.loadClass("io.github.lightman314.lightmanscurrency.common.data.types.TraderDataCache"),
    CoinValue: Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.value.builtin.CoinValue"),
    MoneyAPI: Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.MoneyAPI"),
    CoinAPI: Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.coins.CoinAPI"),

    // Common startup integrations
    $BrassDroneEntity: Java.loadClass("net.mcreator.createstuffadditions.entity.BrassDroneEntity"),
    $CustomPortalBuilder: Java.loadClass("net.kyrptonaught.customportalapi.api.CustomPortalBuilder"),
    $FoodInstance: Java.loadClass("com.tarinoita.solsweetpotato.tracking.FoodInstance"),
    $FoodList: Java.loadClass("com.tarinoita.solsweetpotato.tracking.FoodList"),
    $ItemEffect: Java.loadClass("se.mickelus.tetra.effect.ItemEffect"),
    $ModularItem: Java.loadClass("se.mickelus.tetra.items.modular.ModularItem"),
    $PackageItem: Java.loadClass("com.simibubi.create.content.logistics.box.PackageItem"),
    $QualityConfig: Java.loadClass("de.cadentem.quality_food.config.QualityConfig"),
    $QualityUtils: Java.loadClass("de.cadentem.quality_food.util.QualityUtils"),

    // Minecraft / Forge / CDC
    $Blocks: Java.loadClass("net.minecraft.world.level.block.Blocks"),
    ForgeRegistries: Java.loadClass("net.minecraftforge.registries.ForgeRegistries"),
    CDConfig: Java.loadClass("io.github.jasonsimpart.createdelightcore.CDConfig"),

    // Recipe schema registration
    probejs$$RecipeComponentBuilder: Java.loadClass("dev.latvian.mods.kubejs.recipe.component.RecipeComponentBuilder"),
    probejs$$RecipeSchema: Java.loadClass("dev.latvian.mods.kubejs.recipe.schema.RecipeSchema"),
    probejs$$RegistryInfo: Java.loadClass("dev.latvian.mods.kubejs.registry.RegistryInfo"),
    sophisticatedBackpacks$$RegistryInfo: Java.loadClass("dev.latvian.mods.kubejs.registry.RegistryInfo"),
    sophisticatedBackpacks$$ShapedRecipeSchema: Java.loadClass("dev.latvian.mods.kubejs.recipe.schema.minecraft.ShapedRecipeSchema")
}

global.CDLightmansCurrencyApi = {
    CoinValue: global.CDStartupJavaClasses.CoinValue,
    MoneyAPI: global.CDStartupJavaClasses.MoneyAPI,
    CoinAPI: global.CDStartupJavaClasses.CoinAPI,
    ForgeRegistries: global.CDStartupJavaClasses.ForgeRegistries,
    CDConfig: global.CDStartupJavaClasses.CDConfig,
    AuctionTradeData: global.CDStartupJavaClasses.$AuctionTradeData,
    TraderAPI: global.CDStartupJavaClasses.$TraderAPI,
    TraderData: global.CDStartupJavaClasses.$TraderData,
    ItemTradeData: global.CDStartupJavaClasses.$ItemTradeData,
    PlayerListing: global.CDStartupJavaClasses.$PlayerListing,
    TraderDataCache: global.CDStartupJavaClasses.$TraderDataCache
}

global.CDStartupJavaClasses.getTetraWorkbenchStats = function () {
    if (this.TetraWorkbenchStats == null) {
        this.TetraWorkbenchStats = {
            $StatFormat: Java.loadClass("se.mickelus.tetra.gui.stats.getter.StatFormat"),
            $StatGetterEffectEfficiency: Java.loadClass("se.mickelus.tetra.gui.stats.getter.StatGetterEffectEfficiency"),
            $TooltipGetterMultiValue: Java.loadClass("se.mickelus.tetra.gui.stats.getter.TooltipGetterMultiValue"),
            $WorkbenchStatsGui: Java.loadClass("se.mickelus.tetra.blocks.workbench.gui.WorkbenchStatsGui"),
            $StatsHelper: Java.loadClass("se.mickelus.tetra.gui.stats.StatsHelper"),
            $LabelGetterBasic: Java.loadClass("se.mickelus.tetra.gui.stats.getter.LabelGetterBasic"),
            $StatGetterEffectLevel: Java.loadClass("se.mickelus.tetra.gui.stats.getter.StatGetterEffectLevel"),
            $TooltipGetterInteger: Java.loadClass("se.mickelus.tetra.gui.stats.getter.TooltipGetterInteger"),
            $HoloStatsGui: Java.loadClass("se.mickelus.tetra.items.modular.impl.holo.gui.craft.HoloStatsGui"),
            $GuiStatBar: Java.loadClass("se.mickelus.tetra.gui.stats.bar.GuiStatBar")
        }
    }
    return this.TetraWorkbenchStats
}

global.CDStartupJavaClasses.getExtraHoloPageClasses = function () {
    if (this.ExtraHoloPageClasses == null) {
        this.ExtraHoloPageClasses = {
            $ExtraHoloRegister: Java.loadClass("net.yiran.extraholopage.api.ExtraHoloRegister"),
            $ExtraHoloBuilder: Java.loadClass("net.yiran.extraholopage.api.ExtraHoloBuilder"),
            $IModularItem: Java.loadClass("se.mickelus.tetra.items.modular.IModularItem"),
            $ResourceLocation: Java.loadClass("net.minecraft.resources.ResourceLocation")
        }
    }
    return this.ExtraHoloPageClasses
}
