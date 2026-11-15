// JEED 2.2.5 的 providers 必须存在，即使只配置效果或流体来源也要写出 []。
// effect / effect_providers / fluid_providers 都是裸 ID；流体来源不是 FluidStack。
// prelude 会在 serializer 缺席时跳过 schema，专用服不需要安装 JEED。
new Schema("jeed:effect_provider")
    .simpleKey("effect", "nonEmptyString")
    .simpleKey("providers", "inputItemArray", [], true)
    .dynamicKey(components => components.get("nonEmptyString")().asArray()
        .key("effect_providers").optional([]))
    .dynamicKey(components => components.get("nonEmptyString")().asArray()
        .key("fluid_providers").optional([]))
