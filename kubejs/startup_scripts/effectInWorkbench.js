
//来自kubejs交流群 忆然群友的代码

if (Platform.isClientEnvironment())
    ClientEvents.init(event => {
        let TetraWorkbenchStats = global.CDStartupJavaClasses.getTetraWorkbenchStats()
        let $StatFormat = TetraWorkbenchStats["$StatFormat"];
        let $StatGetterEffectEfficiency = TetraWorkbenchStats["$StatGetterEffectEfficiency"];
        let $TooltipGetterMultiValue = TetraWorkbenchStats["$TooltipGetterMultiValue"];
        let $WorkbenchStatsGui = TetraWorkbenchStats["$WorkbenchStatsGui"];
        let $StatsHelper = TetraWorkbenchStats["$StatsHelper"];
        let $LabelGetterBasic = TetraWorkbenchStats["$LabelGetterBasic"];
        let $StatGetterEffectLevel = TetraWorkbenchStats["$StatGetterEffectLevel"];
        let $TooltipGetterInteger = TetraWorkbenchStats["$TooltipGetterInteger"];
        let $HoloStatsGui = TetraWorkbenchStats["$HoloStatsGui"];
        let $GuiStatBar = TetraWorkbenchStats["$GuiStatBar"];
        let $ItemEffect = global.CDStartupJavaClasses["$ItemEffect"];

        let simpleRegWorkbenchBar = (Name, barMax) => {
            let ItemEffect = $ItemEffect.get(Name)
            let statGetter = new $StatGetterEffectLevel(ItemEffect, 1)
            let statGetter$1 = new $StatGetterEffectEfficiency(ItemEffect, 1.0)
            Name = Name.split(':')
            let statBar = new $GuiStatBar(0, 0, $StatsHelper.barLength,
                `${Name[0]}.effect.${Name[1]}.name`, 0, barMax, false, statGetter,
                $LabelGetterBasic.integerLabel, new $TooltipGetterMultiValue
                (`${Name[0]}.effect.${Name[1]}.tooltip`,
                    $StatsHelper.withStats(statGetter, statGetter$1),
                    $StatsHelper.withFormat($StatFormat.noDecimal, $StatFormat.noDecimal))
            )
            $WorkbenchStatsGui.addBar(statBar)
            $HoloStatsGui.addBar(statBar)
        }


        simpleRegWorkbenchBar('createdelight:forstall', 5)
        simpleRegWorkbenchBar('createdelight:overwhelm', 100)
        simpleRegWorkbenchBar('createdelight:irradiation', 5)
        simpleRegWorkbenchBar('createdelight:frozen', 30)
        simpleRegWorkbenchBar('createdelight:ice_dragon_restraint', 30)
        simpleRegWorkbenchBar('createdelight:fire_dragon_restraint', 30)
        simpleRegWorkbenchBar('createdelight:lightning_dragon_restraint', 30)
        simpleRegWorkbenchBar('createdelight:life_drain', 100)
        simpleRegWorkbenchBar('createdelight:fiber_proliferation', 100)
        simpleRegWorkbenchBar('createdelight:charge', 20)
        // simpleRegWorkbenchBar('yi:power',10000)
        // simpleRegWorkbenchBar('yi:vibration',50)
        // simpleRegWorkbenchBar('yi:mana_addition',10)
        // simpleRegWorkbenchBar('yi:energy_addition',10)
        // simpleRegWorkbenchBar('yi:mana_drain', 100)
        // simpleRegWorkbenchBar('yi:energy_drain', 100)

    })
