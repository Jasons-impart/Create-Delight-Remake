const sophisticatedBackpacks$$ShapedRecipeSchema = Java.loadClass("dev.latvian.mods.kubejs.recipe.schema.minecraft.ShapedRecipeSchema")
const sophisticatedBackpacks$$RegistryInfo = Java.loadClass("dev.latvian.mods.kubejs.registry.RegistryInfo")

StartupEvents.recipeSchemaRegistry(event => {
    let serializers = sophisticatedBackpacks$$RegistryInfo.RECIPE_SERIALIZER.vanillaRegistry.keySet().map(v => v.toString())

    if (serializers.indexOf("sophisticatedbackpacks:backpack_upgrade") === -1) {
        return
    }

    event.register("sophisticatedbackpacks:backpack_upgrade", sophisticatedBackpacks$$ShapedRecipeSchema.SCHEMA)
})
