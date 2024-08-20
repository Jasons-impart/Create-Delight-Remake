// priority: 100
const probejs$$RecipeSchema = Java.loadClass("dev.latvian.mods.kubejs.recipe.schema.RecipeSchema")
const probejs$$RecipeComponentBuilder = Java.loadClass("dev.latvian.mods.kubejs.recipe.component.RecipeComponentBuilder")
const probejs$$RegistryInfo = Java.loadClass("dev.latvian.mods.kubejs.registry.RegistryInfo")

/**
 * @type {Schema[]}
 */
const probejs$$Schemas = []

/**
 * @param {boolean} isInput 
 */
function ComplexKey(isInput) {
	/**
	 * @type {[string, string, any, boolean][]}
	 */
	this.keys = []
	this.isInput = isInput
}

ComplexKey.prototype = {
	/**
	 * @template {keyof Special.RecipeComponents} T
	 * @param {string} key 
	 * @param {T} type 
	 * @param {(ReturnType<ReturnType<Special.RecipeComponents[T]>["key"]> extends Internal.RecipeKey<infer U> ? U : never)} [optional = undefined] 
	 * @param {boolean} [alwaysWrite = false]
	 * @returns {this}
	 */
	addKey(key, type, optional, alwaysWrite) {
		this.keys.push([key, type, optional, alwaysWrite])
		return this
	},

	/**
	 * @param {Special.RecipeComponentMap} map
	 * @returns {Internal.RecipeComponentBuilder}
	 */
	build(map) {
		let builder = new probejs$$RecipeComponentBuilder(this.keys.length)
		for (let key of this.keys) {
			let component = map.get(key[1])().key(key[0])
			if (key[2] !== undefined) {
				if (key[2] !== null) component = component.optional(key[2])
				else component = component.defaultOptional()
				if (key[3]) component = component.alwaysWrite()
			}
			builder = builder.add(component)
		}
		return builder
	}
}

/**
 * @param {Special.RecipeSerializer} recipeId 
 */
function Schema(recipeId) {

	this.recipeId = recipeId
	/**
	 * @type {([string, string, any, boolean] | [string, boolean, (arg: ComplexKey)=>void] | [(arg: Special.RecipeComponentMap, componentBuilder: typeof Internal.RecipeComponentBuilder)=>Internal.RecipeKey<any>])[]}
	 */
	this.keys = []

	probejs$$Schemas.push(this)
}

Schema.prototype = {
	/**
	 * @template {keyof Special.RecipeComponents} T
	 * @param {string} key 
	 * @param {T} type 
	 * @param {(ReturnType<ReturnType<Special.RecipeComponents[T]>["key"]> extends Internal.RecipeKey<infer U> ? U : never)} [optional = undefined] 
	 * @param {boolean} [alwaysWrite = false]
	 * @returns {this}
	 */
	simpleKey(key, type, optional, alwaysWrite) {
		this.keys.push([key, type, optional, alwaysWrite])
		return this
	},

	/**
	 * @param {string} key 
	 * @param {boolean} input
	 * @param {(key: ComplexKey) => void} builder 
	 * @returns {this}
	 */
	complexKey(key, input, builder) {
		this.keys.push([key, input, builder])
		return this
	},

	/**
	 * @param {(components: Special.RecipeComponentMap, componentBuilder: typeof Internal.RecipeComponentBuilder)=>Internal.RecipeComponent<any>} builder 
	 * @returns {this}
	 */
	dynamicKey(builder) {
		this.keys.push([builder])
		return this
	},

	/**
	 * @param {Internal.RecipeSchemaRegistryEventJS} event 
	 */
	register(event) {
		// In case if the recipe serializer is not loaded, skip the registration
		let serializers = probejs$$RegistryInfo.RECIPE_SERIALIZER.vanillaRegistry.keySet().map(v => v.toString())
		if (serializers.indexOf(this.recipeId) === -1) return
		const keys = []
		const components = event.components
		let component = null;
		for (let key of this.keys) {
			if (key.length === 4) {
				component = components.get(key[1])().key(key[0])
				if (key[2] !== undefined) {
					if (key[2] !== null) component = component.optional(key[2])
					else component = component.defaultOptional()
					if (key[3]) component = component.alwaysWrite()
				}
			} else if (key.length === 3) {
				let complex = new ComplexKey()
				key[2](complex)
				component = complex.build(components)
			} else {
				component = key[0](components, probejs$$RecipeComponentBuilder)
			}
			keys.push(component)
		}
		event.register(this.recipeId, new probejs$$RecipeSchema(keys))
	}
}

StartupEvents.recipeSchemaRegistry(event => {
	probejs$$Schemas.forEach(schema => {
		schema.register(event)
	})
})