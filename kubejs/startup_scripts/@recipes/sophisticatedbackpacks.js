StartupEvents.recipeSchemaRegistry(event => {
    let serializers = global.CDStartupJavaClasses.sophisticatedBackpacks$$RegistryInfo.RECIPE_SERIALIZER.vanillaRegistry.keySet().map(v => v.toString())

    if (serializers.indexOf("sophisticatedbackpacks:backpack_upgrade") === -1) {
        return
    }

    event.register("sophisticatedbackpacks:backpack_upgrade", global.CDStartupJavaClasses.sophisticatedBackpacks$$ShapedRecipeSchema.SCHEMA)
})
