# OneEnoughDamage 未归属伤害点汇总

以下伤害点无法追溯到某个 LivingEntity。每个条目标注了其最终来源类型（物品、弹射物、方块、效果等），运行时通常通过 Projectile Base Damage 或其他全局机制生效。

This file lists scanned configurable hardcoded damage attributes by namespace and source.
`/r` means replace original damage directly, `/m` means multiply original damage.

## Alex Cave Addon

### MagneticOrbEntity (Type: Projectile)

- `oneenoughdamage:net/undying/alex_cave_addon/entity/projectile/magnetic_orb_entity/lambda_break_blocks_1/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269104, net.undying.alex_cave_addon.entity.projectile.MagneticOrbEntity#lambda$breakBlocks$1#1 -->
- `oneenoughdamage:net/undying/alex_cave_addon/entity/projectile/magnetic_orb_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269299, net.undying.alex_cave_addon.entity.projectile.MagneticOrbEntity#m_5790_#1 -->

## Alexscaves

### AcidBlock (Type: Block)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/block/acid_block/m_7892/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexmodguy.alexscaves.server.block.AcidBlock#m_7892_#1 -->

### BubbledEffect (Type: Effect)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/potion/bubbled_effect/m_6742/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269063, com.github.alexmodguy.alexscaves.server.potion.BubbledEffect#m_6742_#1 -->

### CandicornMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/candicorn_melee_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.CandicornMeleeGoal#m_8037_#1 -->

### CandyCaneHookEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/candy_cane_hook_entity/m_8119/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269390, com.github.alexmodguy.alexscaves.server.entity.item.CandyCaneHookEntity#m_8119_#1 -->

### CaniacMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/caniac_melee_goal/m_8037/1/r` <!-- mode: replace (/r), default: 3.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.CaniacMeleeGoal#m_8037_#1 -->

### CinderBrickEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/cinder_brick_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269390, com.github.alexmodguy.alexscaves.server.entity.item.CinderBrickEntity#m_5790_#1 -->

### CorrodentAttackGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/corrodent_attack_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.CorrodentAttackGoal#checkAndDealDamage#1 -->
- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/corrodent_attack_goal/check_and_deal_damage/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.CorrodentAttackGoal#checkAndDealDamage#2 -->

### DarkArrowEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/dark_arrow_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexmodguy.alexscaves.server.entity.item.DarkArrowEntity#m_5790_#1 -->

### DepthChargeEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/depth_charge_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269390, com.github.alexmodguy.alexscaves.server.entity.item.DepthChargeEntity#m_5790_#1 -->

### DesolateDaggerEntity (Type: Entity)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/desolate_dagger_entity/m_8119/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: acdamagetypes:cause_desolate_dagger_damage, com.github.alexmodguy.alexscaves.server.entity.item.DesolateDaggerEntity#m_8119_#1 -->

### DinosaurSpiritEntity (Type: Entity)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/dinosaur_spirit_entity/tick_tremorsaurus/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: acdamagetypes:cause_spirit_dinosaur_damage, com.github.alexmodguy.alexscaves.server.entity.item.DinosaurSpiritEntity#tickTremorsaurus#1 -->

### ExtinctionSpearEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/extinction_spear_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: acdamagetypes:cause_spirit_dinosaur_damage, com.github.alexmodguy.alexscaves.server.entity.item.ExtinctionSpearEntity#m_5790_#1 -->

### FissurePrimalMagmaBlock (Type: Block)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/block/fissure_primal_magma_block/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269047, com.github.alexmodguy.alexscaves.server.block.FissurePrimalMagmaBlock#m_141947_#1 -->
- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/block/fissure_primal_magma_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269047, com.github.alexmodguy.alexscaves.server.block.FissurePrimalMagmaBlock#m_7892_#1 -->

### ForsakenAttackGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/forsaken_attack_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.ForsakenAttackGoal#checkAndDealDamage#1 -->
- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/forsaken_attack_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: acdamagetypes:cause_forsaken_sonic_boom_damage, com.github.alexmodguy.alexscaves.server.entity.ai.ForsakenAttackGoal#m_8037_#1 -->
- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/forsaken_attack_goal/m_8037/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: acdamagetypes:cause_forsaken_sonic_boom_damage, com.github.alexmodguy.alexscaves.server.entity.ai.ForsakenAttackGoal#m_8037_#2 -->

### FrostmintExplosion (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/util/frostmint_explosion/explode/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: frostmintexplosion:get_damage_source, com.github.alexmodguy.alexscaves.server.entity.util.FrostmintExplosion#explode#1 -->

### FrostmintSpearEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/frostmint_spear_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269525, com.github.alexmodguy.alexscaves.server.entity.item.FrostmintSpearEntity#m_5790_#1 -->

### GrottoceratopsMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/grottoceratops_melee_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.GrottoceratopsMeleeGoal#checkAndDealDamage#1 -->

### GuanoEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/guano_entity/m_5790/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, com.github.alexmodguy.alexscaves.server.entity.item.GuanoEntity#m_5790_#1 -->

### GummyBearMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/gummy_bear_melee_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.GummyBearMeleeGoal#checkAndDealDamage#1 -->

### GumWormSegmentEntity (Type: Entity)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/living/gum_worm_segment_entity/m_6469/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexmodguy.alexscaves.server.entity.living.GumWormSegmentEntity#m_6469_#1 -->

### HullbreakerMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/hullbreaker_melee_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.HullbreakerMeleeGoal#checkAndDealDamage#1 -->
- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/hullbreaker_melee_goal/check_and_deal_damage/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.HullbreakerMeleeGoal#checkAndDealDamage#2 -->

### IrradiatedEffect (Type: Effect)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/potion/irradiated_effect/m_6742/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: acdamagetypes:cause_radiation_damage, com.github.alexmodguy.alexscaves.server.potion.IrradiatedEffect#m_6742_#1 -->

### LimestoneSpearEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/limestone_spear_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269525, com.github.alexmodguy.alexscaves.server.entity.item.LimestoneSpearEntity#m_5790_#1 -->

### MagneticWeaponEntity (Type: Entity)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/magnetic_weapon_entity/hurt_entity/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.item.MagneticWeaponEntity#hurtEntity#1 -->

### MineExplosion (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/util/mine_explosion/explode/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: mineexplosion:get_damage_source, com.github.alexmodguy.alexscaves.server.entity.util.MineExplosion#explode#1 -->

### MultipartEntityMessage (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/message/multipart_entity_message/lambda_handle_0/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269264, com.github.alexmodguy.alexscaves.server.message.MultipartEntityMessage#lambda$handle$0#1 -->

### NuclearExplosionEntity (Type: Entity)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/nuclear_explosion_entity/m_8119/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: acdamagetypes:cause_nuke_damage, com.github.alexmodguy.alexscaves.server.entity.item.NuclearExplosionEntity#m_8119_#1 -->

### OrtholanceItem (Type: Item)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/item/ortholance_item/m_5551/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexmodguy.alexscaves.server.item.OrtholanceItem#m_5551_#1 -->

### PrimalMagmaBlock (Type: Block)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/block/primal_magma_block/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269047, com.github.alexmodguy.alexscaves.server.block.PrimalMagmaBlock#m_141947_#1 -->
- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/block/primal_magma_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269047, com.github.alexmodguy.alexscaves.server.block.PrimalMagmaBlock#m_7892_#1 -->

### PrimitiveClubItem (Type: Item)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/item/primitive_club_item/m_7579/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.item.PrimitiveClubItem#m_7579_#1 -->

### RaygunItem (Type: Item)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/item/raygun_item/m_5929/1/r` <!-- mode: replace (/r), default: 1.5, DamageType: unknown, com.github.alexmodguy.alexscaves.server.item.RaygunItem#m_5929_#1 -->

### RelicheirusMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/relicheirus_melee_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.RelicheirusMeleeGoal#checkAndDealDamage#1 -->

### ResistorShieldItem (Type: Item)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/item/resistor_shield_item/m_5929/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: unknown, com.github.alexmodguy.alexscaves.server.item.ResistorShieldItem#m_5929_#1 -->

### SpinningPeppermintEntity (Type: Entity)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/spinning_peppermint_entity/hurt_entities/1/r` <!-- mode: replace (/r), default: 3.0, DamageType: unknown, com.github.alexmodguy.alexscaves.server.entity.item.SpinningPeppermintEntity#hurtEntities#1 -->

### SugarStaffHexEntity (Type: Entity)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/sugar_staff_hex_entity/hurt_entities/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: unknown, com.github.alexmodguy.alexscaves.server.entity.item.SugarStaffHexEntity#hurtEntities#1 -->

### TephraExplosion (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/util/tephra_explosion/explode/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: tephraexplosion:get_damage_source, com.github.alexmodguy.alexscaves.server.entity.util.TephraExplosion#explode#1 -->

### ThrownIceCreamScoopEntity (Type: Projectile)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/thrown_ice_cream_scoop_entity/m_5790/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, com.github.alexmodguy.alexscaves.server.entity.item.ThrownIceCreamScoopEntity#m_5790_#1 -->

### ThrownWasteDrumEntity (Type: Entity)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/item/thrown_waste_drum_entity/m_8119/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: acdamagetypes:cause_acid_damage, com.github.alexmodguy.alexscaves.server.entity.item.ThrownWasteDrumEntity#m_8119_#1 -->

### TotemExplosion (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/util/totem_explosion/explode/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: totemexplosion:get_damage_source, com.github.alexmodguy.alexscaves.server.entity.util.TotemExplosion#explode#1 -->

### TremorsaurusMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/tremorsaurus_melee_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.TremorsaurusMeleeGoal#checkAndDealDamage#1 -->

### UnderzealotMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/underzealot_melee_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.UnderzealotMeleeGoal#checkAndDealDamage#1 -->
- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/underzealot_melee_goal/check_and_deal_damage/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.UnderzealotMeleeGoal#checkAndDealDamage#2 -->

### VallumraptorMeleeGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/vallumraptor_melee_goal/check_and_deal_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.VallumraptorMeleeGoal#checkAndDealDamage#1 -->

### VesperAttackGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/vesper_attack_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.VesperAttackGoal#m_8037_#1 -->

### VolcanicCoreBlock (Type: Block)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/block/volcanic_core_block/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269047, com.github.alexmodguy.alexscaves.server.block.VolcanicCoreBlock#m_141947_#1 -->

### WatcherAttackGoal (Type: Other)

- `oneenoughdamage:com/github/alexmodguy/alexscaves/server/entity/ai/watcher_attack_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexmodguy.alexscaves.server.entity.ai.WatcherAttackGoal#m_8037_#1 -->

## Alexsmobs

### BlueJayAIMelee (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/blue_jay_a_i_melee/m_8037/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269264, com.github.alexthe666.alexsmobs.entity.ai.BlueJayAIMelee#m_8037_#1 -->

### BunfungusAIMelee (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/bunfungus_a_i_melee/m_8037/1/r` <!-- mode: replace (/r), default: 10.0, DamageType: m_269333, com.github.alexthe666.alexsmobs.entity.ai.BunfungusAIMelee#m_8037_#1 -->

### CaimanAIMelee (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/caiman_a_i_melee/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexthe666.alexsmobs.entity.ai.CaimanAIMelee#m_8037_#1 -->

### CrowAIMelee (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/crow_a_i_melee/m_8037/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: m_269264, com.github.alexthe666.alexsmobs.entity.ai.CrowAIMelee#m_8037_#1 -->
- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/crow_a_i_melee/m_8037/2/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269264, com.github.alexthe666.alexsmobs.entity.ai.CrowAIMelee#m_8037_#2 -->

### Debilitating Sting (Type: Effect)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/effect/effect_debilitating_sting/m_6742/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269425, com.github.alexthe666.alexsmobs.effect.EffectDebilitatingSting#m_6742_#1 -->
- `oneenoughdamage:com/github/alexthe666/alexsmobs/effect/effect_debilitating_sting/m_6742/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.github.alexthe666.alexsmobs.effect.EffectDebilitatingSting#m_6742_#2 -->

### Ender Flu (Type: Effect)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/effect/effect_ender_flu/m_6742/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.github.alexthe666.alexsmobs.effect.EffectEnderFlu#m_6742_#1 -->

### EntityMobProjectile (Type: Entity)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/entity_mob_projectile/on_entity_hit/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269299, com.github.alexthe666.alexsmobs.entity.EntityMobProjectile#onEntityHit#1 -->

### EntitySharkToothArrow (Type: Projectile)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/entity_shark_tooth_arrow/m_7761/1/r` <!-- mode: replace (/r), default: 7.0, DamageType: m_269418, com.github.alexthe666.alexsmobs.entity.EntitySharkToothArrow#m_7761_#1 -->

### EntityTendonSegment (Type: Entity)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/entity_tendon_segment/m_8119/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269299, com.github.alexthe666.alexsmobs.entity.EntityTendonSegment#m_8119_#1 -->

### Exsanguination (Type: Effect)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/effect/effect_exsanguination/m_6742/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.github.alexthe666.alexsmobs.effect.EffectExsanguination#m_6742_#1 -->

### FroststalkerAIMelee (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/froststalker_a_i_melee/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexthe666.alexsmobs.entity.ai.FroststalkerAIMelee#m_8037_#1 -->

### GrizzlyBearAIAprilFools (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/grizzly_bear_a_i_april_fools/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: amdamagetypes:cause_freddy_bear_damage, com.github.alexthe666.alexsmobs.entity.ai.GrizzlyBearAIAprilFools#m_8037_#1 -->
- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/grizzly_bear_a_i_april_fools/m_8037/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: amdamagetypes:cause_freddy_bear_damage, com.github.alexthe666.alexsmobs.entity.ai.GrizzlyBearAIAprilFools#m_8037_#2 -->

### MessageHurtMultipart (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/message/message_hurt_multipart_handler/lambda_handle_0/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexthe666.alexsmobs.message.MessageHurtMultipart$Handler#lambda$handle$0#1 -->

### RockyChestplateUtil (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/util/rocky_chestplate_util/tick_rocky_rolling/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexthe666.alexsmobs.entity.util.RockyChestplateUtil#tickRockyRolling#1 -->

### ServerEvents (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/event/server_events/on_living_damage_event/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269374, com.github.alexthe666.alexsmobs.event.ServerEvents#onLivingDamageEvent#1 -->

### SnowLeopardAIMelee (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/entity/ai/snow_leopard_a_i_melee/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexthe666.alexsmobs.entity.ai.SnowLeopardAIMelee#m_8037_#1 -->

### TileEntitySculkBoomer (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/tileentity/tile_entity_sculk_boomer/common_tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.github.alexthe666.alexsmobs.tileentity.TileEntitySculkBoomer#commonTick#1 -->

### TileEntityVoidWormBeak (Type: Other)

- `oneenoughdamage:com/github/alexthe666/alexsmobs/tileentity/tile_entity_void_worm_beak/tick/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269264, com.github.alexthe666.alexsmobs.tileentity.TileEntityVoidWormBeak#tick#1 -->

## Amendments

### CommonCauldronCode (Type: Other)

- `oneenoughdamage:net/mehvahdjukaar/amendments/common/block/common_cauldron_code/entity_inside/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: unknown, net.mehvahdjukaar.amendments.common.block.CommonCauldronCode#entityInside#1 -->

### Dragon Fireball (龙弹火球) (Type: Projectile)

- `oneenoughdamage:net/mehvahdjukaar/amendments/common/entity/medium_dragon_fireball/m_5790/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269104, net.mehvahdjukaar.amendments.common.entity.MediumDragonFireball#m_5790_#1 -->

### Fireball (火球) (Type: Projectile)

- `oneenoughdamage:net/mehvahdjukaar/amendments/common/entity/medium_fireball/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: mediumfireball:fireball_damage, net.mehvahdjukaar.amendments.common.entity.MediumFireball#m_5790_#1 -->
- `oneenoughdamage:net/mehvahdjukaar/amendments/common/entity/medium_fireball/m_5790/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: mediumfireball:fireball_damage, net.mehvahdjukaar.amendments.common.entity.MediumFireball#m_5790_#2 -->

### FireballExplosion (Type: Other)

- `oneenoughdamage:net/mehvahdjukaar/amendments/common/entity/fireball_explosion/hurt_hit_entity/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.mehvahdjukaar.amendments.common.entity.FireballExplosion#hurtHitEntity#1 -->

## Antarcticgardens

### RadiationPoisoningEffect (Type: Effect)

- `oneenoughdamage:org/antarcticgardens/cna/content/nuclear/radiation_poisoning_effect/m_6742/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, org.antarcticgardens.cna.content.nuclear.RadiationPoisoningEffect#m_6742_#1 -->

## Apotheosis

### BerserkersFuryEnchant (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/apotheosis/ench/enchantments/corrupted/berserkers_fury_enchant/living_hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269079, dev.shadowsoffire.apotheosis.ench.enchantments.corrupted.BerserkersFuryEnchant#livingHurt#1 -->

### BloodyArrowBonus (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/apotheosis/adventure/socket/gem/bonus/special/bloody_arrow_bonus/on_arrow_fired/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269079, dev.shadowsoffire.apotheosis.adventure.socket.gem.bonus.special.BloodyArrowBonus#onArrowFired#1 -->

### ExploitationEnchant (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/apotheosis/ench/enchantments/twisted/exploitation_enchant/molest_sheep_items/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269264, dev.shadowsoffire.apotheosis.ench.enchantments.twisted.ExploitationEnchant#molestSheepItems#1 -->

### PsychicAffix (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/apotheosis/adventure/affix/effect/psychic_affix/on_shield_block/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269298, dev.shadowsoffire.apotheosis.adventure.affix.effect.PsychicAffix#onShieldBlock#1 -->

### ReflectiveEnchant (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/apotheosis/ench/enchantments/reflective_enchant/reflect/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, dev.shadowsoffire.apotheosis.ench.enchantments.ReflectiveEnchant#reflect#1 -->

### ThunderstruckAffix (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/apotheosis/adventure/affix/effect/thunderstruck_affix/do_post_attack/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, dev.shadowsoffire.apotheosis.adventure.affix.effect.ThunderstruckAffix#doPostAttack#1 -->

## Appeng

### ChargedStaffItem (Type: Item)

- `oneenoughdamage:appeng/items/tools/powered/charged_staff_item/m_7579/1/r` <!-- mode: replace (/r), default: 6.0, DamageType: m_269425, appeng.items.tools.powered.ChargedStaffItem#m_7579_#1 -->

### MatterCannonItem (Type: Item)

- `oneenoughdamage:appeng/items/tools/powered/matter_cannon_item/shoot_paint_balls/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269075, appeng.items.tools.powered.MatterCannonItem#shootPaintBalls#1 -->
- `oneenoughdamage:appeng/items/tools/powered/matter_cannon_item/standard_ammo/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, appeng.items.tools.powered.MatterCannonItem#standardAmmo#1 -->
- `oneenoughdamage:appeng/items/tools/powered/matter_cannon_item/standard_ammo/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, appeng.items.tools.powered.MatterCannonItem#standardAmmo#2 -->

### TinyTNTPrimedEntity (Type: Entity)

- `oneenoughdamage:appeng/entity/tiny_t_n_t_primed_entity/m_32103/1/r` <!-- mode: replace (/r), default: 6.0, DamageType: m_269093, appeng.entity.TinyTNTPrimedEntity#m_32103_#1 -->

## Attributeslib

### AttributeEvents (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/attributeslib/impl/attribute_events/melee_damage_attributes/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, dev.shadowsoffire.attributeslib.impl.AttributeEvents#meleeDamageAttributes#1 -->
- `oneenoughdamage:dev/shadowsoffire/attributeslib/impl/attribute_events/melee_damage_attributes/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, dev.shadowsoffire.attributeslib.impl.AttributeEvents#meleeDamageAttributes#2 -->
- `oneenoughdamage:dev/shadowsoffire/attributeslib/impl/attribute_events/melee_damage_attributes/3/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, dev.shadowsoffire.attributeslib.impl.AttributeEvents#meleeDamageAttributes#3 -->

### BleedingEffect (Type: Effect)

- `oneenoughdamage:dev/shadowsoffire/attributeslib/mobfx/bleeding_effect/m_6742/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269298, dev.shadowsoffire.attributeslib.mobfx.BleedingEffect#m_6742_#1 -->

### DetonationEffect (Type: Effect)

- `oneenoughdamage:dev/shadowsoffire/attributeslib/mobfx/detonation_effect/m_6386/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269079, dev.shadowsoffire.attributeslib.mobfx.DetonationEffect#m_6386_#1 -->

### PlayerMixin (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/attributeslib/mixin/player_mixin/apoth_handle_killed_by_aux_dmg/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, dev.shadowsoffire.attributeslib.mixin.PlayerMixin#apoth_handleKilledByAuxDmg#1 -->

## Bakeries

### GarlicFlavoredBaguetteItem (Type: Item)

- `oneenoughdamage:com/renyigesai/bakeries/item/garlic_flavored_baguette_item/m_5922/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269264, com.renyigesai.bakeries.item.GarlicFlavoredBaguetteItem#m_5922_#1 -->

## Blackknightarmor

### Aporeis (耀阳) (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/entity/aporeis_spear_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269390, com.wds.blackknightmod.entity.AporeisSpearEntity#m_5790_#1 -->

### Black Knight Sword (黑骑士剑) (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/entity/sword_fire_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.wds.blackknightmod.entity.SwordFireEntity#m_5790_#1 -->

### Black Magic Sword (黑魔法剑) (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/common/entity/black_magic_wave_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.wds.blackknightmod.common.entity.BlackMagicWaveEntity#m_5790_#1 -->
- `oneenoughdamage:com/wds/blackknightmod/item/black_magic_sword/m_7579/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269333, com.wds.blackknightmod.item.BlackMagicSword#m_7579_#1 -->

### Candlelight Sword (烛光之剑) (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/common/entity/candle_fire_missile_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.wds.blackknightmod.common.entity.CandleFireMissileEntity#m_5790_#1 -->

### Daybreak Spear (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/entity/daybreak_spear_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269390, com.wds.blackknightmod.entity.DaybreakSpearEntity#m_5790_#1 -->

### Dragon Fire Sword (红莲龙炎剑) (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/item/dragon_fire_sword/m_7203/1/r` <!-- mode: replace (/r), default: 20.0, DamageType: m_269075, com.wds.blackknightmod.item.DragonFireSword#m_7203_#1 -->

### Dragon Slayer Sword (斩龙) (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/item/dragon_slayer_sword/m_7203/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269075, com.wds.blackknightmod.item.DragonSlayerSword#m_7203_#1 -->

### Ultimate Black Knight Sword (终极黑骑士剑) (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/entity/sword_fire_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.wds.blackknightmod.entity.SwordFireEntity#m_5790_#1 -->

### Wither Ash Block (凋零灰块) (Type: Block)

- `oneenoughdamage:com/wds/blackknightmod/block/wither_ash_block/damage_once_per_second/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269425, com.wds.blackknightmod.block.WitherAshBlock#damageOncePerSecond#1 -->
- `oneenoughdamage:com/wds/blackknightmod/block/wither_ash_block/damage_once_per_second/2/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269264, com.wds.blackknightmod.block.WitherAshBlock#damageOncePerSecond#2 -->

## Brewinandchewin

### BnCCommonEvents (Type: Other)

- `oneenoughdamage:umpaz/brewinandchewin/common/event/bn_c_common_events/lambda_on_living_tick_3/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269079, umpaz.brewinandchewin.common.event.BnCCommonEvents#lambda$onLivingTick$3#1 -->

## Butchercraft

### ButcherKnifeItem (Type: Item)

- `oneenoughdamage:com/lance5057/butchercraft/items/butcher_knife_item/kill_and_drop/1/r` <!-- mode: replace (/r), default: 99999.0, DamageType: m_269075, com.lance5057.butchercraft.items.ButcherKnifeItem#killAndDrop#1 -->

## Cataclysm

### Abyssal Burn (深渊灼烧) (Type: Effect)

- `oneenoughdamage:com/github/l_ender/cataclysm/effects/effect_abyssal_burn/m_6742/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269079, com.github.L_Ender.cataclysm.effects.EffectAbyssal_Burn#m_6742_#1 -->

### Abyssal Curse (深渊诅咒) (Type: Effect)

- `oneenoughdamage:com/github/l_ender/cataclysm/effects/effect_abyssal_curse/m_6742/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269079, com.github.L_Ender.cataclysm.effects.EffectAbyssal_Curse#m_6742_#1 -->

### Altar of Fire (烈焰祭坛) (Type: Block)

- `oneenoughdamage:com/github/l_ender/cataclysm/blocks/altar_of_fire_block/m_7892/1/r` <!-- mode: replace (/r), default: 3.0, DamageType: m_269387, com.github.L_Ender.cataclysm.blocks.Altar_Of_Fire_Block#m_7892_#1 -->

### Boltstrike\_Entity (Type: Entity)

- `oneenoughdamage:com/github/l_ender/cataclysm/entity/effect/boltstrike_entity/damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.github.L_Ender.cataclysm.entity.effect.Boltstrike_Entity#damage#1 -->
- `oneenoughdamage:com/github/l_ender/cataclysm/entity/effect/boltstrike_entity/damage/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269104, com.github.L_Ender.cataclysm.entity.effect.Boltstrike_Entity#damage#2 -->

### Ceraunus (霆浪锚戟) (Type: Item)

- `oneenoughdamage:com/github/l_ender/cataclysm/entity/projectile/player_ceraunus_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: cmdamagetypes:cause_storm_bringer_damage, com.github.L_Ender.cataclysm.entity.projectile.Player_Ceraunus_Entity#m_5790_#1 -->

### ChargeCapability (Type: Other)

- `oneenoughdamage:com/github/l_ender/cataclysm/capabilities/charge_capability_charge_capability_imp/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269299, com.github.L_Ender.cataclysm.capabilities.ChargeCapability$ChargeCapabilityImp#tick#1 -->

### EMP\_Block\_Entity (Type: Other)

- `oneenoughdamage:com/github/l_ender/cataclysm/blockentities/e_m_p_block_entity/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: cmdamagetypes:get_damage_source, com.github.L_Ender.cataclysm.blockentities.EMP_Block_Entity#tick#1 -->

### IgnisExplosion (Type: Other)

- `oneenoughdamage:com/github/l_ender/cataclysm/util/custom_explosion/ignis_explosion/m_46061/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.L_Ender.cataclysm.util.CustomExplosion.IgnisExplosion#m_46061_#1 -->

### Infernal Forge (炼狱锻锤) (Type: Item)

- `oneenoughdamage:com/github/l_ender/cataclysm/items/infernal_forge/earth_quake/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.L_Ender.cataclysm.items.infernal_forge#EarthQuake#1 -->

### Meat Shredder (绞肉锯) (Type: Item)

- `oneenoughdamage:com/github/l_ender/cataclysm/items/meat_shredder/m_5929/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: cmdamagetypes:cause_shredder_damage, com.github.L_Ender.cataclysm.items.Meat_Shredder#m_5929_#1 -->

### Monstrous Helm (恶兽头盔) (Type: Item)

- `oneenoughdamage:com/github/l_ender/cataclysm/items/monstrous_helm/on_armor_tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.L_Ender.cataclysm.items.Monstrous_Helm#onArmorTick#1 -->

### RenderRushCapability (Type: Other)

- `oneenoughdamage:com/github/l_ender/cataclysm/capabilities/render_rush_capability_render_rush_capability_imp/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.L_Ender.cataclysm.capabilities.RenderRushCapability$RenderRushCapabilityImp#tick#1 -->

### SandstoneIgniteTrap\_Block\_Entity (Type: Other)

- `oneenoughdamage:com/github/l_ender/cataclysm/blockentities/sandstone_ignite_trap_block_entity/tick/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269387, com.github.L_Ender.cataclysm.blockentities.SandstoneIgniteTrap_Block_Entity#tick#1 -->

### The Annihilator (歼灭战锤) (Type: Item)

- `oneenoughdamage:com/github/l_ender/cataclysm/items/the_annihilator/yall/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.L_Ender.cataclysm.items.The_Annihilator#yall#1 -->

### The Immolator (献祭者) (Type: Item)

- `oneenoughdamage:com/github/l_ender/cataclysm/items/the_immolator/yall/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.L_Ender.cataclysm.items.The_Immolator#yall#1 -->

### The Leviathan Tongue (Type: Entity)

- `oneenoughdamage:com/github/l_ender/cataclysm/entity/animation_monster/boss_monsters/the_leviathan/the_leviathan_tongue_entity/hurt_entity/1/r` <!-- mode: replace (/r), default: 6.0, DamageType: m_269333, com.github.L_Ender.cataclysm.entity.AnimationMonster.BossMonsters.The_Leviathan.The_Leviathan_Tongue_Entity#hurtEntity#1 -->

### Tidal Tentacle (潮汐触手) (Type: Entity)

- `oneenoughdamage:com/github/l_ender/cataclysm/entity/projectile/tidal_tentacle_entity/m_8119/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269299, com.github.L_Ender.cataclysm.entity.projectile.Tidal_Tentacle_Entity#m_8119_#1 -->

### Void Howitzer (虚空榴弹) (Type: Projectile)

- `oneenoughdamage:com/github/l_ender/cataclysm/entity/projectile/void_howitzer_entity/m_5790/1/r` <!-- mode: replace (/r), default: 8.0, DamageType: m_269104, com.github.L_Ender.cataclysm.entity.projectile.Void_Howitzer_Entity#m_5790_#1 -->
- `oneenoughdamage:com/github/l_ender/cataclysm/entity/projectile/void_howitzer_entity/m_5790/2/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269425, com.github.L_Ender.cataclysm.entity.projectile.Void_Howitzer_Entity#m_5790_#2 -->

### Wall Watcher (Type: Entity)

- `oneenoughdamage:com/github/l_ender/cataclysm/entity/effect/wall_watcher_entity/m_8119/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269299, com.github.L_Ender.cataclysm.entity.effect.Wall_Watcher_Entity#m_8119_#1 -->

### Wetness (潮湿) (Type: Effect)

- `oneenoughdamage:com/github/l_ender/cataclysm/effects/effect_wetness/m_6742/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269425, com.github.L_Ender.cataclysm.effects.EffectWetness#m_6742_#1 -->

### Wrath of the Desert (沙暴之怒) (Type: Item)

- `oneenoughdamage:com/github/l_ender/cataclysm/entity/projectile/cursed_sandstorm_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: cmdamagetypes:cause_maledictio_sagitta_damage, com.github.L_Ender.cataclysm.entity.projectile.Cursed_Sandstorm_Entity#m_5790_#1 -->
- `oneenoughdamage:com/github/l_ender/cataclysm/entity/projectile/cursed_sandstorm_entity/m_5790/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.github.L_Ender.cataclysm.entity.projectile.Cursed_Sandstorm_Entity#m_5790_#2 -->

## Citadel

### PathingStuckHandler (Type: Other)

- `oneenoughdamage:com/github/alexthe666/citadel/server/entity/pathfinding/raycoms/pathing_stuck_handler/complete_stuck_action/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269318, com.github.alexthe666.citadel.server.entity.pathfinding.raycoms.PathingStuckHandler#completeStuckAction#1 -->

## Cn

### EntityBullet (Type: Projectile)

- `oneenoughdamage:cn/mcmod_mmf/mmlib/entity/entity_bullet/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269390, cn.mcmod_mmf.mmlib.entity.EntityBullet#m_5790_#1 -->

## Collectorsreap

### ForgeEvents (Type: Other)

- `oneenoughdamage:net/brdle/collectorsreap/common/event/forge_events/lambda_on_volatile_7/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.brdle.collectorsreap.common.event.ForgeEvents#lambda$onVolatile$7#1 -->

### FruitBushBlock (Type: Block)

- `oneenoughdamage:net/brdle/collectorsreap/common/block/fruit_bush_block/m_6227/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269555, net.brdle.collectorsreap.common.block.FruitBushBlock#m_6227_#1 -->

### ThrownShimmeringPearl (Type: Projectile)

- `oneenoughdamage:net/brdle/collectorsreap/common/entity/thrown_shimmering_pearl/m_5790/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269390, net.brdle.collectorsreap.common.entity.ThrownShimmeringPearl#m_5790_#1 -->

## Cosmopolitan

### CosmoEvents (Type: Other)

- `oneenoughdamage:com/gumillea/cosmopolitan/core/util/cosmo_events/on_effect_expired/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269387, com.gumillea.cosmopolitan.core.util.CosmoEvents#onEffectExpired#1 -->

### SpecialFoodItem (Type: Item)

- `oneenoughdamage:com/gumillea/cosmopolitan/common/item/special_food_item/m_5922/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269264, com.gumillea.cosmopolitan.common.item.SpecialFoodItem#m_5922_#1 -->

### SyrupBlock (Type: Block)

- `oneenoughdamage:com/gumillea/cosmopolitan/common/block/syrup_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269425, com.gumillea.cosmopolitan.common.block.SyrupBlock#m_7892_#1 -->

## Crabbersdelight

### CoconutBlock (Type: Block)

- `oneenoughdamage:alabaster/crabbersdelight/common/block/coconut_block/m_48792/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: cddamagesources:get_simple_damage_source, alabaster.crabbersdelight.common.block.CoconutBlock#m_48792_#1 -->

## Create

### AllFanProcessingTypes (Type: Other)

- `oneenoughdamage:com/simibubi/create/content/kinetics/fan/processing/all_fan_processing_types_blasting_type/affect_entity/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, com.simibubi.create.content.kinetics.fan.processing.AllFanProcessingTypes$BlastingType#affectEntity#1 -->
- `oneenoughdamage:com/simibubi/create/content/kinetics/fan/processing/all_fan_processing_types_smoking_type/affect_entity/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: unknown, com.simibubi.create.content.kinetics.fan.processing.AllFanProcessingTypes$SmokingType#affectEntity#1 -->
- `oneenoughdamage:com/simibubi/create/content/kinetics/fan/processing/all_fan_processing_types_splashing_type/affect_entity/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269063, com.simibubi.create.content.kinetics.fan.processing.AllFanProcessingTypes$SplashingType#affectEntity#1 -->

### BlockBreakingMovementBehaviour (Type: Other)

- `oneenoughdamage:com/simibubi/create/content/kinetics/base/block_breaking_movement_behaviour/damage_entities/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.simibubi.create.content.kinetics.base.BlockBreakingMovementBehaviour#damageEntities#1 -->

### ContraptionCollider (Type: Other)

- `oneenoughdamage:com/simibubi/create/content/contraptions/contraption_collider/handle_damage_from_train/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.simibubi.create.content.contraptions.ContraptionCollider#handleDamageFromTrain#1 -->

### CrushingWheelControllerBlockEntity (Type: Other)

- `oneenoughdamage:com/simibubi/create/content/kinetics/crusher/crushing_wheel_controller_block_entity/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.simibubi.create.content.kinetics.crusher.CrushingWheelControllerBlockEntity#tick#1 -->

### DrillBlock (Type: Block)

- `oneenoughdamage:com/simibubi/create/content/kinetics/drill/drill_block/lambda_entity_inside_0/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.simibubi.create.content.kinetics.drill.DrillBlock#lambda$entityInside$0#1 -->

### PotatoProjectileEntity (Type: Projectile)

- `oneenoughdamage:com/simibubi/create/content/equipment/potato_cannon/potato_projectile_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: potatoprojectileentity:cause_potato_damage, com.simibubi.create.content.equipment.potatoCannon.PotatoProjectileEntity#m_5790_#1 -->

### SawBlock (Type: Block)

- `oneenoughdamage:com/simibubi/create/content/kinetics/saw/saw_block/lambda_entity_inside_1/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.simibubi.create.content.kinetics.saw.SawBlock#lambda$entityInside$1#1 -->

### WrenchItem (Type: Item)

- `oneenoughdamage:com/simibubi/create/content/equipment/wrench/wrench_item/wrench_insta_kills_minecarts/1/r` <!-- mode: replace (/r), default: 100.0, DamageType: m_269075, com.simibubi.create.content.equipment.wrench.WrenchItem#wrenchInstaKillsMinecarts#1 -->

## Createaddition

### BarbedWireBlock (Type: Block)

- `oneenoughdamage:com/mrh0/createaddition/blocks/barbed_wire/barbed_wire_block/m_7892/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.mrh0.createaddition.blocks.barbed_wire.BarbedWireBlock#m_7892_#1 -->

### TeslaCoilBlockEntity (Type: Other)

- `oneenoughdamage:com/mrh0/createaddition/blocks/tesla_coil/tesla_coil_block_entity/do_dmg/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.mrh0.createaddition.blocks.tesla_coil.TeslaCoilBlockEntity#doDmg#1 -->

## Createdelightcore

### CDFanProcessingTypes (Type: Other)

- `oneenoughdamage:io/github/jasonsimpart/createdelightcore/content/recipe/c_d_fan_processing_types_freezing_type/affect_entity/1/r` <!-- mode: replace (/r), default: 8.0, DamageType: m_269109, io.github.jasonsimpart.createdelightcore.content.recipe.CDFanProcessingTypes$FreezingType#affectEntity#1 -->

### RadiationFluidType (Type: Other)

- `oneenoughdamage:io/github/jasonsimpart/createdelightcore/content/fluid/radiation_fluid_type/move/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, io.github.jasonsimpart.createdelightcore.content.fluid.RadiationFluidType#move#1 -->
- `oneenoughdamage:io/github/jasonsimpart/createdelightcore/content/fluid/radiation_fluid_type/set_item_movement/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, io.github.jasonsimpart.createdelightcore.content.fluid.RadiationFluidType#setItemMovement#1 -->
- `oneenoughdamage:io/github/jasonsimpart/createdelightcore/content/fluid/radiation_fluid_type/supports_boating/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, io.github.jasonsimpart.createdelightcore.content.fluid.RadiationFluidType#supportsBoating#1 -->

## Createdieselgenerators

### BurnerBlock (Type: Block)

- `oneenoughdamage:com/jesz/createdieselgenerators/content/burner/burner_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269387, com.jesz.createdieselgenerators.content.burner.BurnerBlock#m_7892_#1 -->

### ChemicalSprayerProjectileEntity (Type: Projectile)

- `oneenoughdamage:com/jesz/createdieselgenerators/content/tools/chemical_sprayer_projectile_entity/m_5790/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269387, com.jesz.createdieselgenerators.content.tools.ChemicalSprayerProjectileEntity#m_5790_#1 -->
- `oneenoughdamage:com/jesz/createdieselgenerators/content/tools/chemical_sprayer_projectile_entity/m_5790/2/r` <!-- mode: replace (/r), default: 0.5, DamageType: m_269264, com.jesz.createdieselgenerators.content.tools.ChemicalSprayerProjectileEntity#m_5790_#2 -->
- `oneenoughdamage:com/jesz/createdieselgenerators/content/tools/chemical_sprayer_projectile_entity/m_5790/3/r` <!-- mode: replace (/r), default: 0.5, DamageType: m_269264, com.jesz.createdieselgenerators.content.tools.ChemicalSprayerProjectileEntity#m_5790_#3 -->

## Createmetallurgy

### BeltGrinderBlock (Type: Block)

- `oneenoughdamage:fr/lucreeper74/createmetallurgy/content/blocks/belt_grinder/belt_grinder_block/lambda_entity_inside_1/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, fr.lucreeper74.createmetallurgy.content.blocks.belt_grinder.BeltGrinderBlock#lambda$entityInside$1#1 -->

### CrucibleBlockEntity (Type: Other)

- `oneenoughdamage:fr/lucreeper74/createmetallurgy/content/blocks/industrial_crucible/crucible_block_entity/process_fall_on_entity/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, fr.lucreeper74.createmetallurgy.content.blocks.industrial_crucible.CrucibleBlockEntity#processFallOnEntity#1 -->
- `oneenoughdamage:fr/lucreeper74/createmetallurgy/content/blocks/industrial_crucible/crucible_block_entity/process_fall_on_entity/2/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, fr.lucreeper74.createmetallurgy.content.blocks.industrial_crucible.CrucibleBlockEntity#processFallOnEntity#2 -->

### FaucetBlockEntity (Type: Other)

- `oneenoughdamage:fr/lucreeper74/createmetallurgy/content/blocks/faucet/faucet_block_entity/spill_on_entities/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, fr.lucreeper74.createmetallurgy.content.blocks.faucet.FaucetBlockEntity#spillOnEntities#1 -->

### MoltenFluidType (Type: Other)

- `oneenoughdamage:fr/lucreeper74/createmetallurgy/content/fluids/molten_fluid_type/move/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, fr.lucreeper74.createmetallurgy.content.fluids.MoltenFluidType#move#1 -->
- `oneenoughdamage:fr/lucreeper74/createmetallurgy/content/fluids/molten_fluid_type/set_item_movement/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, fr.lucreeper74.createmetallurgy.content.fluids.MoltenFluidType#setItemMovement#1 -->

## Dreadsteel

### Dreadsteel Scythe (Type: Item)

- `oneenoughdamage:net/mindoth/dreadsteel/entity/entity_scythe_projectile_black/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269104, net.mindoth.dreadsteel.entity.EntityScytheProjectileBlack#m_5790_#1 -->
- `oneenoughdamage:net/mindoth/dreadsteel/entity/entity_scythe_projectile_bronze/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269104, net.mindoth.dreadsteel.entity.EntityScytheProjectileBronze#m_5790_#1 -->
- `oneenoughdamage:net/mindoth/dreadsteel/entity/entity_scythe_projectile_default/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269104, net.mindoth.dreadsteel.entity.EntityScytheProjectileDefault#m_5790_#1 -->
- `oneenoughdamage:net/mindoth/dreadsteel/entity/entity_scythe_projectile_white/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269104, net.mindoth.dreadsteel.entity.EntityScytheProjectileWhite#m_5790_#1 -->

## Dungeonsdelight

### AncientEggEntity (Type: Projectile)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/entity/misc/ancient_egg_entity/m_5790/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: moddamagetypes:get_simple_damage_source, net.yirmiri.dungeonsdelight.common.entity.misc.AncientEggEntity#m_5790_#1 -->

### BloodyMaryItem (Type: Item)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/item/bloody_mary_item/m_5922/1/r` <!-- mode: replace (/r), default: 6.0, DamageType: moddamagetypes:get_simple_damage_source, net.yirmiri.dungeonsdelight.common.item.BloodyMaryItem#m_5922_#1 -->

### CleaverEntity (Type: Projectile)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/entity/misc/cleaver_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.yirmiri.dungeonsdelight.common.entity.misc.CleaverEntity#m_5790_#1 -->

### DDUtil (Type: Other)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/util/d_d_util/lambda_skull_heart_blast_0/1/r` <!-- mode: replace (/r), default: 8.0, DamageType: moddamagetypes:get_simple_damage_source, net.yirmiri.dungeonsdelight.common.util.DDUtil#lambda$skullHeartBlast$0#1 -->

### PlayerMixin (Type: Other)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/core/mixin/player_mixin/dungeonsdelight_attack/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.yirmiri.dungeonsdelight.core.mixin.PlayerMixin#dungeonsdelight$attack#1 -->

### RancidReductionEntity (Type: Projectile)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/entity/misc/rancid_reduction_entity/m_5790/1/r` <!-- mode: replace (/r), default: 3.0, DamageType: moddamagetypes:get_simple_damage_source, net.yirmiri.dungeonsdelight.common.entity.misc.RancidReductionEntity#m_5790_#1 -->

### RawCreeperFoodItem (Type: Item)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/item/raw_creeper_food_item/explode_raw_creeper/1/r` <!-- mode: replace (/r), default: 8.0, DamageType: moddamagetypes:get_simple_damage_source, net.yirmiri.dungeonsdelight.common.item.RawCreeperFoodItem#explodeRawCreeper#1 -->

### SerratedEffect (Type: Effect)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/effect/serrated_effect/m_6742/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.yirmiri.dungeonsdelight.common.effect.SerratedEffect#m_6742_#1 -->

### StainedCleaverItem (Type: Item)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/item/stained_cleaver_item/stained_effects/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269075, net.yirmiri.dungeonsdelight.common.item.StainedCleaverItem#stainedEffects#1 -->

### StainedKnifeItem (Type: Item)

- `oneenoughdamage:net/yirmiri/dungeonsdelight/common/item/stained_knife_item/m_7579/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269075, net.yirmiri.dungeonsdelight.common.item.StainedKnifeItem#m_7579_#1 -->

## Endergetic

### BroodEetleSlamGoal (Type: Other)

- `oneenoughdamage:com/teamabnormals/endergetic/common/entity/eetle/ai/brood/brood_eetle_slam_goal/slam/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269333, com.teamabnormals.endergetic.common.entity.eetle.ai.brood.BroodEetleSlamGoal#slam#1 -->

### GliderEetleBiteGoal (Type: Other)

- `oneenoughdamage:com/teamabnormals/endergetic/common/entity/eetle/ai/glider/glider_eetle_bite_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.teamabnormals.endergetic.common.entity.eetle.ai.glider.GliderEetleBiteGoal#m_8037_#1 -->

### GliderEetleDiveGoal (Type: Other)

- `oneenoughdamage:com/teamabnormals/endergetic/common/entity/eetle/ai/glider/glider_eetle_dive_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269515, com.teamabnormals.endergetic.common.entity.eetle.ai.glider.GliderEetleDiveGoal#m_8037_#1 -->

### GliderEetleMunchGoal (Type: Other)

- `oneenoughdamage:com/teamabnormals/endergetic/common/entity/eetle/ai/glider/glider_eetle_munch_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.teamabnormals.endergetic.common.entity.eetle.ai.glider.GliderEetleMunchGoal#m_8037_#1 -->

### PurpoidAttackGoal (Type: Other)

- `oneenoughdamage:com/teamabnormals/endergetic/common/entity/purpoid/ai/purpoid_attack_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.teamabnormals.endergetic.common.entity.purpoid.ai.PurpoidAttackGoal#m_8037_#1 -->

### PurpoidTelefragGoal (Type: Other)

- `oneenoughdamage:com/teamabnormals/endergetic/common/entity/purpoid/ai/purpoid_telefrag_goal/m_8037/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.teamabnormals.endergetic.common.entity.purpoid.ai.PurpoidTelefragGoal#m_8037_#1 -->

## Ends Delight

### EndermanGristleTransport (Type: Other)

- `oneenoughdamage:cn/foggyhillside/ends_delight/enderman_gristle_transport/random_teleport/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: moddamagetypes:get_simple_damage_source, cn.foggyhillside.ends_delight.EndermanGristleTransport#randomTeleport#1 -->
- `oneenoughdamage:cn/foggyhillside/ends_delight/enderman_gristle_transport/random_teleport/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: moddamagetypes:get_simple_damage_source, cn.foggyhillside.ends_delight.EndermanGristleTransport#randomTeleport#2 -->

## Farmersdelight

### AbstractStoveBlock (Type: Block)

- `oneenoughdamage:vectorwing/farmersdelight/common/block/abstract_stove_block/burn_entity_stepping_on_stove/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: moddamagetypes:get_simple_damage_source, vectorwing.farmersdelight.common.block.AbstractStoveBlock#burnEntitySteppingOnStove#1 -->

### RottenTomatoEntity (Type: Projectile)

- `oneenoughdamage:vectorwing/farmersdelight/common/entity/rotten_tomato_entity/m_5790/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, vectorwing.farmersdelight.common.entity.RottenTomatoEntity#m_5790_#1 -->

## Farmersrespite

### WitherRootsBlock (Type: Block)

- `oneenoughdamage:umpaz/farmersrespite/common/block/wither_roots_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: unknown, umpaz.farmersrespite.common.block.WitherRootsBlock#m_7892_#1 -->

## Forge

### ForgeBalmCommonEvents (Type: Other)

- `oneenoughdamage:net/blay09/mods/balm/forge/event/forge_balm_common_events/lambda_register_events_30/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_268989, net.blay09.mods.balm.forge.event.ForgeBalmCommonEvents#lambda$registerEvents$30#1 -->

## Frycooks Delight

### CanolaOilCauldronBlock (Type: Block)

- `oneenoughdamage:com/uraneptus/frycooks_delight/common/blocks/canola_oil_cauldron_block/m_6227/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269079, com.uraneptus.frycooks_delight.common.blocks.CanolaOilCauldronBlock#m_6227_#1 -->
- `oneenoughdamage:com/uraneptus/frycooks_delight/common/blocks/canola_oil_cauldron_block/m_7892/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269079, com.uraneptus.frycooks_delight.common.blocks.CanolaOilCauldronBlock#m_7892_#1 -->

### HotGreaseFluidBlock (Type: Block)

- `oneenoughdamage:com/uraneptus/frycooks_delight/common/blocks/hot_grease_fluid_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269079, com.uraneptus.frycooks_delight.common.blocks.HotGreaseFluidBlock#m_7892_#1 -->

## Gateways

### Reward (Type: Other)

- `oneenoughdamage:dev/shadowsoffire/gateways/gate/reward_entity_loot_reward/generate_loot/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: unknown, dev.shadowsoffire.gateways.gate.Reward$EntityLootReward#generateLoot#1 -->

## Iceandfire

### BlockIceSpikes (Type: Block)

- `oneenoughdamage:com/github/alexthe666/iceandfire/block/block_ice_spikes/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269325, com.github.alexthe666.iceandfire.block.BlockIceSpikes#m_141947_#1 -->

### DragonSteelOverrides (Type: Other)

- `oneenoughdamage:com/github/alexthe666/iceandfire/item/dragon_steel_overrides/hurt_enemy/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.github.alexthe666.iceandfire.item.DragonSteelOverrides#hurtEnemy#1 -->
- `oneenoughdamage:com/github/alexthe666/iceandfire/item/dragon_steel_overrides/hurt_enemy/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269264, com.github.alexthe666.iceandfire.item.DragonSteelOverrides#hurtEnemy#2 -->
- `oneenoughdamage:com/github/alexthe666/iceandfire/item/dragon_steel_overrides/hurt_enemy/3/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269264, com.github.alexthe666.iceandfire.item.DragonSteelOverrides#hurtEnemy#3 -->

### EntityCockatriceEgg (Type: Projectile)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/entity_cockatrice_egg/m_6532/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, com.github.alexthe666.iceandfire.entity.EntityCockatriceEgg#m_6532_#1 -->

### EntityDeathWormEgg (Type: Projectile)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/entity_death_worm_egg/m_6532/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, com.github.alexthe666.iceandfire.entity.EntityDeathWormEgg#m_6532_#1 -->

### EntityDragonCharge (Type: Projectile)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/entity_dragon_charge/m_6532/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: entitydragoncharge:cause_damage, com.github.alexthe666.iceandfire.entity.EntityDragonCharge#m_6532_#1 -->

### EntityGhostSword (Type: Projectile)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/entity_ghost_sword/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexthe666.iceandfire.entity.EntityGhostSword#m_5790_#1 -->

### EntityHippogryphEgg (Type: Projectile)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/entity_hippogryph_egg/m_6532/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, com.github.alexthe666.iceandfire.entity.EntityHippogryphEgg#m_6532_#1 -->

### EntityMutlipartPart (Type: Entity)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/entity_mutlipart_part/m_6469/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexthe666.iceandfire.entity.EntityMutlipartPart#m_6469_#1 -->

### EntityPixieCharge (Type: Projectile)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/entity_pixie_charge/m_6532/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269104, com.github.alexthe666.iceandfire.entity.EntityPixieCharge#m_6532_#1 -->

### EntityTideTrident (Type: Projectile)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/entity_tide_trident/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexthe666.iceandfire.entity.EntityTideTrident#m_5790_#1 -->

### IafDragonDestructionManager (Type: Other)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/iaf_dragon_destruction_manager/lambda_destroy_area_breath_2/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexthe666.iceandfire.entity.IafDragonDestructionManager#lambda$destroyAreaBreath$2#1 -->
- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/iaf_dragon_destruction_manager/lambda_destroy_area_charge_5/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.github.alexthe666.iceandfire.entity.IafDragonDestructionManager#lambda$destroyAreaCharge$5#1 -->

### IafDragonLogic (Type: Other)

- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/iaf_dragon_logic/attack_target/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexthe666.iceandfire.entity.IafDragonLogic#attackTarget#1 -->
- `oneenoughdamage:com/github/alexthe666/iceandfire/entity/iaf_dragon_logic/attack_target/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269104, com.github.alexthe666.iceandfire.entity.IafDragonLogic#attackTarget#2 -->

### ItemAlchemySword (Type: Item)

- `oneenoughdamage:com/github/alexthe666/iceandfire/item/item_alchemy_sword/m_7579/1/r` <!-- mode: replace (/r), default: 13.5, DamageType: m_269387, com.github.alexthe666.iceandfire.item.ItemAlchemySword#m_7579_#1 -->
- `oneenoughdamage:com/github/alexthe666/iceandfire/item/item_alchemy_sword/m_7579/2/r` <!-- mode: replace (/r), default: 13.5, DamageType: m_269063, com.github.alexthe666.iceandfire.item.ItemAlchemySword#m_7579_#2 -->
- `oneenoughdamage:com/github/alexthe666/iceandfire/item/item_alchemy_sword/m_7579/3/r` <!-- mode: replace (/r), default: 9.5, DamageType: m_269548, com.github.alexthe666.iceandfire.item.ItemAlchemySword#m_7579_#3 -->

### ItemCockatriceScepter (Type: Item)

- `oneenoughdamage:com/github/alexthe666/iceandfire/item/item_cockatrice_scepter/lambda_attack_targets_3/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269251, com.github.alexthe666.iceandfire.item.ItemCockatriceScepter#lambda$attackTargets$3#1 -->

### ItemDeathwormGauntlet (Type: Item)

- `oneenoughdamage:com/github/alexthe666/iceandfire/item/item_deathworm_gauntlet/lambda_inventory_tick_1/1/r` <!-- mode: replace (/r), default: 3.0, DamageType: m_269075, com.github.alexthe666.iceandfire.item.ItemDeathwormGauntlet#lambda$inventoryTick$1#1 -->

### ItemGorgonHead (Type: Item)

- `oneenoughdamage:com/github/alexthe666/iceandfire/item/item_gorgon_head/m_5551/1/r` <!-- mode: replace (/r), default: 2.14748365E9, DamageType: unknown, com.github.alexthe666.iceandfire.item.ItemGorgonHead#m_5551_#1 -->

### ItemHippogryphSword (Type: Item)

- `oneenoughdamage:com/github/alexthe666/iceandfire/item/item_hippogryph_sword/m_7579/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269075, com.github.alexthe666.iceandfire.item.ItemHippogryphSword#m_7579_#1 -->

### MessageMultipartInteract (Type: Other)

- `oneenoughdamage:com/github/alexthe666/iceandfire/message/message_multipart_interact_handler/lambda_handle_0/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.github.alexthe666.iceandfire.message.MessageMultipartInteract$Handler#lambda$handle$0#1 -->

### PathingStuckHandler (Type: Other)

- `oneenoughdamage:com/github/alexthe666/iceandfire/pathfinding/raycoms/pathing_stuck_handler/complete_stuck_action/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269318, com.github.alexthe666.iceandfire.pathfinding.raycoms.PathingStuckHandler#completeStuckAction#1 -->

## Immersive Aircraft

### BulletEntity (Type: Projectile)

- `oneenoughdamage:immersive_aircraft/entity/bullet/bullet_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269390, immersive_aircraft.entity.bullet.BulletEntity#m_5790_#1 -->

### CollisionMessage (Type: Other)

- `oneenoughdamage:immersive_aircraft/network/c2s/collision_message/receive/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_268989, immersive_aircraft.network.c2s.CollisionMessage#receive#1 -->

## Improvedmobs

### EventCalls (Type: Other)

- `oneenoughdamage:io/github/flemmli97/improvedmobs/events/event_calls/on_attack_event/1/r` <!-- mode: replace (/r), default: 0.001, DamageType: unknown, io.github.flemmli97.improvedmobs.events.EventCalls#onAttackEvent#1 -->

## Kubejs

### EntityKJS (Type: Other)

- `oneenoughdamage:dev/latvian/mods/kubejs/core/entity_k_j_s/kjs_attack/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269264, dev.latvian.mods.kubejs.core.EntityKJS#kjs$attack#1 -->

## Mcreator

### DrillModuleOnEntityTickUpdateProcedure (Type: Other)

- `oneenoughdamage:net/mcreator/createstuffadditions/procedures/drill_module_on_entity_tick_update_procedure/execute/1/r` <!-- mode: replace (/r), default: 6.0, DamageType: unknown, net.mcreator.createstuffadditions.procedures.DrillModuleOnEntityTickUpdateProcedure#execute#1 -->
- `oneenoughdamage:net/mcreator/createstuffadditions/procedures/drill_module_on_entity_tick_update_procedure/execute/2/r` <!-- mode: replace (/r), default: 1.0, DamageType: unknown, net.mcreator.createstuffadditions.procedures.DrillModuleOnEntityTickUpdateProcedure#execute#2 -->

### FlamethrowerPr2ProjectileHitsLivingEntityProcedure (Type: Other)

- `oneenoughdamage:net/mcreator/createstuffadditions/procedures/flamethrower_pr2_projectile_hits_living_entity_procedure/execute/1/r` <!-- mode: replace (/r), default: 8.0, DamageType: unknown, net.mcreator.createstuffadditions.procedures.FlamethrowerPr2ProjectileHitsLivingEntityProcedure#execute#1 -->

### FlamethrowerPrProjectileHitsLivingEntityProcedure (Type: Other)

- `oneenoughdamage:net/mcreator/createstuffadditions/procedures/flamethrower_pr_projectile_hits_living_entity_procedure/execute/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: unknown, net.mcreator.createstuffadditions.procedures.FlamethrowerPrProjectileHitsLivingEntityProcedure#execute#1 -->

### GrapplinWhiskRightclickedProcedure (Type: Other)

- `oneenoughdamage:net/mcreator/createstuffadditions/procedures/grapplin_whisk_rightclicked_procedure/execute/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.mcreator.createstuffadditions.procedures.GrapplinWhiskRightclickedProcedure#execute#1 -->

## Minecraft

### BaseFireBlock (Type: Block)

- `oneenoughdamage:net/minecraft/world/level/block/base_fire_block/m_7892/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269387, net.minecraft.world.level.block.BaseFireBlock#m_7892_#1 -->

### CampfireBlock (Type: Block)

- `oneenoughdamage:net/minecraft/world/level/block/campfire_block/m_7892/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269387, net.minecraft.world.level.block.CampfireBlock#m_7892_#1 -->

### ConduitBlockEntity (Type: Other)

- `oneenoughdamage:net/minecraft/world/level/block/entity/conduit_block_entity/m_155408/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: m_269425, net.minecraft.world.level.block.entity.ConduitBlockEntity#m_155408_#1 -->

### DamageCommand (Type: Other)

- `oneenoughdamage:net/minecraft/server/commands/damage_command/m_269485/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.minecraft.server.commands.DamageCommand#m_269485_#1 -->

### Entity (Type: Entity)

- `oneenoughdamage:net/minecraft/world/entity/entity/m_20093/1/r` <!-- mode: replace (/r), default: 4.0, DamageType: m_269233, net.minecraft.world.entity.Entity#m_20093_#1 -->
- `oneenoughdamage:net/minecraft/world/entity/entity/m_6075/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269549, net.minecraft.world.entity.Entity#m_6075_#1 -->
- `oneenoughdamage:net/minecraft/world/entity/entity/m_8038/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269548, net.minecraft.world.entity.Entity#m_8038_#1 -->

### Explosion (Type: Other)

- `oneenoughdamage:net/minecraft/world/level/explosion/m_46061/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.minecraft.world.level.Explosion#m_46061_#1 -->

### FoodData (Type: Other)

- `oneenoughdamage:net/minecraft/world/food/food_data/m_38710/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269064, net.minecraft.world.food.FoodData#m_38710_#1 -->

### HangingEntity (Type: Entity)

- `oneenoughdamage:net/minecraft/world/entity/decoration/hanging_entity/m_7313/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269075, net.minecraft.world.entity.decoration.HangingEntity#m_7313_#1 -->

### HoglinBase (Type: Other)

- `oneenoughdamage:net/minecraft/world/entity/monster/hoglin/hoglin_base/m_34642/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, net.minecraft.world.entity.monster.hoglin.HoglinBase#m_34642_#1 -->

### Magma Block (Type: Block)

- `oneenoughdamage:net/minecraft/world/level/block/magma_block/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269047, net.minecraft.world.level.block.MagmaBlock#m_141947_#1 -->

### MobEffect (Type: Effect)

- `oneenoughdamage:net/minecraft/world/effect/mob_effect/m_19461/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, net.minecraft.world.effect.MobEffect#m_19461_#1 -->
- `oneenoughdamage:net/minecraft/world/effect/mob_effect/m_19461/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269104, net.minecraft.world.effect.MobEffect#m_19461_#2 -->
- `oneenoughdamage:net/minecraft/world/effect/mob_effect/m_6742/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269425, net.minecraft.world.effect.MobEffect#m_6742_#1 -->
- `oneenoughdamage:net/minecraft/world/effect/mob_effect/m_6742/2/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269251, net.minecraft.world.effect.MobEffect#m_6742_#2 -->
- `oneenoughdamage:net/minecraft/world/effect/mob_effect/m_6742/3/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, net.minecraft.world.effect.MobEffect#m_6742_#3 -->

### SweetBerryBushBlock (Type: Block)

- `oneenoughdamage:net/minecraft/world/level/block/sweet_berry_bush_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269555, net.minecraft.world.level.block.SweetBerryBushBlock#m_7892_#1 -->

### ThornsEnchantment (Type: Other)

- `oneenoughdamage:net/minecraft/world/item/enchantment/thorns_enchantment/m_7675/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269374, net.minecraft.world.item.enchantment.ThornsEnchantment#m_7675_#1 -->

### ThrownEgg (Type: Projectile)

- `oneenoughdamage:net/minecraft/world/entity/projectile/thrown_egg/m_5790/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, net.minecraft.world.entity.projectile.ThrownEgg#m_5790_#1 -->

### ThrownEnderpearl (Type: Projectile)

- `oneenoughdamage:net/minecraft/world/entity/projectile/thrown_enderpearl/m_5790/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, net.minecraft.world.entity.projectile.ThrownEnderpearl#m_5790_#1 -->
- `oneenoughdamage:net/minecraft/world/entity/projectile/thrown_enderpearl/m_6532/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_268989, net.minecraft.world.entity.projectile.ThrownEnderpearl#m_6532_#1 -->

## Minecraftforge

### ForgeHooks (Type: Other)

- `oneenoughdamage:net/minecraftforge/common/forge_hooks/on_living_breathe/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269063, net.minecraftforge.common.ForgeHooks#onLivingBreathe#1 -->

## More Mod Tetra

### AbyssalFinish (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/cataclysm/core/abyssal_finish/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.Cataclysm.Core.AbyssalFinish#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/cataclysm/core/abyssal_finish/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.Cataclysm.Core.AbyssalFinish#hurt#2 -->

### AquaArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/t_o/aqua_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.TO.AquaArcaneEdgeEffect#hurt#1 -->

### ArcaneArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/arcane_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.ArcaneArcaneEdgeEffect#hurt#1 -->

### ArmorThorns (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/thorns/armor_thorns/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Thorns.ArmorThorns#hurt#1 -->

### BloodArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/blood_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.BloodArcaneEdgeEffect#hurt#1 -->

### ColdWaveTick (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/gathering_torches_become_sunlight/frost_nova_ingot_effect/cold_wave_tick/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269109, com.inolia_zaicek.more_mod_tetra.Effect.GatheringTorchesBecomeSunlight.FrostNovaIngotEffect.ColdWaveTick#tick#1 -->

### CollapsingFear (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/gathering_torches_become_sunlight/pursuer_ingot_effect/collapsing_fear/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.GatheringTorchesBecomeSunlight.PursuerIngotEffect.CollapsingFear#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/gathering_torches_become_sunlight/pursuer_ingot_effect/collapsing_fear/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.GatheringTorchesBecomeSunlight.PursuerIngotEffect.CollapsingFear#hurt#2 -->

### CooldownArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/cooldown_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.CooldownArcaneEdgeEffect#hurt#1 -->

### DeathAndTick (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/death_and_tick/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.DeathAndTick#tick#1 -->

### DragonBreathEdge (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/dragon_breath_edge/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.DragonBreathEdge#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/dragon_breath_edge/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.DragonBreathEdge#hurt#2 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/dragon_breath_edge/hurt/3/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.DragonBreathEdge#hurt#3 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/dragon_breath_edge/hurt/4/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.DragonBreathEdge#hurt#4 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/dragon_breath_edge/hurt/5/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.DragonBreathEdge#hurt#5 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/dragon_breath_edge/hurt/6/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.DragonBreathEdge#hurt#6 -->

### DragonBreathThorns (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/thorns/dragon_breath_thorns/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Thorns.DragonBreathThorns#hurt#1 -->

### EldritchArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/eldritch_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.EldritchArcaneEdgeEffect#hurt#1 -->

### EnderArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/ender_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.EnderArcaneEdgeEffect#hurt#1 -->

### EverythingIsInEverything (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/titan/everything_is_in_everything/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Titan.EverythingIsInEverything#tick#1 -->

### EvocationArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/evocation_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.EvocationArcaneEdgeEffect#hurt#1 -->

### ExpandedCognition (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/gathering_torches_become_sunlight/rosmontis_ingot_effect/expanded_cognition/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.GatheringTorchesBecomeSunlight.RosmontisIngotEffect.ExpandedCognition#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/gathering_torches_become_sunlight/rosmontis_ingot_effect/expanded_cognition/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.GatheringTorchesBecomeSunlight.RosmontisIngotEffect.ExpandedCognition#hurt#2 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/gathering_torches_become_sunlight/rosmontis_ingot_effect/expanded_cognition/hurt/3/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.GatheringTorchesBecomeSunlight.RosmontisIngotEffect.ExpandedCognition#hurt#3 -->

### FantasyArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/f_e/fantasy_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.FE.FantasyArcaneEdgeEffect#hurt#1 -->

### FantasyTrace (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/f_e/fantasy_trace/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.FE.FantasyTrace#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/f_e/fantasy_trace/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.FE.FantasyTrace#hurt#2 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/f_e/fantasy_trace/hurt/3/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.FE.FantasyTrace#hurt#3 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/f_e/fantasy_trace/hurt/4/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.FE.FantasyTrace#hurt#4 -->

### FireArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/fire_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.FireArcaneEdgeEffect#hurt#1 -->

### FireCombo (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#2 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/3/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#3 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/4/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#4 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/5/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#5 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/6/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#6 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/7/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#7 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/8/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#8 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/edge/fire_combo/hurt/9/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Edge.FireCombo#hurt#9 -->

### FireThorns (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/thorns/fire_thorns/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Thorns.FireThorns#hurt#1 -->

### FreezeThorns (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/thorns/freeze_thorns/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Thorns.FreezeThorns#hurt#1 -->

### HolyArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/holy_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.HolyArcaneEdgeEffect#hurt#1 -->

### HurtAndDamage (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#2 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/3/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#3 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/4/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#4 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/5/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#5 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/6/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#6 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/7/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#7 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/8/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#8 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/concept/hurt_and_damage/hurt/9/r` <!-- mode: replace (/r), default: 3.4028235E38, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Concept.HurtAndDamage#hurt#9 -->

### IceArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/ice_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.IceArcaneEdgeEffect#hurt#1 -->

### IceDragonPower (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iceandfire/ice_dragon_steel/ice_dragon_power/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269109, com.inolia_zaicek.more_mod_tetra.Effect.Iceandfire.IceDragonSteel.IceDragonPower#hurt#1 -->

### InvulnerabilityBlade (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/invulnerability_blade/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269341, com.inolia_zaicek.more_mod_tetra.Effect.MMT.InvulnerabilityBlade#hurt#1 -->

### KillerAuraEffectTrait (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/l2hostility/trait/killer_aura_effect_trait/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.inolia_zaicek.more_mod_tetra.Effect.L2hostility.Trait.KillerAuraEffectTrait#tick#1 -->

### LavaMob (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/alex_cave/lava_mob/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.AlexCave.LavaMob#hurt#1 -->

### LightningArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/lightning_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.LightningArcaneEdgeEffect#hurt#1 -->

### LightningThorns (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/thorns/lightning_thorns/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Thorns.LightningThorns#hurt#1 -->

### MagicOscillation (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/magic_oscillation/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.MMT.MagicOscillation#hurt#1 -->

### MagicThorns (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/thorns/magic_thorns/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Thorns.MagicThorns#hurt#1 -->

### MarchingTimeAndRuinationTime (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/gathering_torches_become_sunlight/patriot_ingot_effect/marching_time_and_ruination_time/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.inolia_zaicek.more_mod_tetra.Effect.GatheringTorchesBecomeSunlight.PatriotIngotEffect.MarchingTimeAndRuinationTime#tick#1 -->

### MeleeAttackCombo (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/melee_attack_combo/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.MeleeAttackCombo#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/melee_attack_combo/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.MeleeAttackCombo#hurt#2 -->

### NatureArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/nature_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.NatureArcaneEdgeEffect#hurt#1 -->

### Necrotic (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/necrotic/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Necrotic#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/necrotic/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Necrotic#hurt#2 -->

### OdeToPassage (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/m_m_t/titan/ode_to_passage/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.MMT.Titan.OdeToPassage#hurt#1 -->

### ProtectionArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/metal/protection_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.Metal.ProtectionArcaneEdgeEffect#hurt#1 -->

### ReflectEffectTrait (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/l2hostility/trait/reflect_effect_trait/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269425, com.inolia_zaicek.more_mod_tetra.Effect.L2hostility.Trait.ReflectEffectTrait#hurt#1 -->

### SoundArcaneEdgeEffect (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iron_spell/a_f/sound_arcane_edge_effect/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.Effect.IronSpell.AF.SoundArcaneEdgeEffect#hurt#1 -->

### TearsOfThunder (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/cataclysm/tears_of_thunder/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269548, com.inolia_zaicek.more_mod_tetra.Effect.Cataclysm.TearsOfThunder#hurt#1 -->
- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/cataclysm/tears_of_thunder/hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269548, com.inolia_zaicek.more_mod_tetra.Effect.Cataclysm.TearsOfThunder#hurt#2 -->

### UnceasingStormTick (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/cataclysm/storm/unceasing_storm_tick/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269548, com.inolia_zaicek.more_mod_tetra.Effect.Cataclysm.Storm.UnceasingStormTick#tick#1 -->

### WitherRealm (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/effect/iceandfire/wither_realm/tick/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269251, com.inolia_zaicek.more_mod_tetra.Effect.Iceandfire.WitherRealm#tick#1 -->

### WitherThorns (Type: Other)

- `oneenoughdamage:com/inolia_zaicek/more_mod_tetra/armor_effect/m_m_t/thorns/wither_thorns/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.inolia_zaicek.more_mod_tetra.ArmorEffect.MMT.Thorns.WitherThorns#hurt#1 -->

## Mrcrayfish

### CeilingFanBlockEntity (Type: Other)

- `oneenoughdamage:com/mrcrayfish/furniture/refurbished/blockentity/ceiling_fan_block_entity/lambda_perform_damage_1/1/r` <!-- mode: replace (/r), default: 0.5, DamageType: iblockhelper:ceiling_fan_damage_source, com.mrcrayfish.furniture.refurbished.blockentity.CeilingFanBlockEntity#lambda$performDamage$1#1 -->

## Mynethersdelight

### CommonEvent (Type: Other)

- `oneenoughdamage:com/soytutta/mynethersdelight/common/events/common_event/living_die/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: unknown, com.soytutta.mynethersdelight.common.events.CommonEvent#livingDie#1 -->

### Magma Cake Block (Type: Block)

- `oneenoughdamage:com/soytutta/mynethersdelight/common/block/magma_cake_block/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: moddamagetypes:get_simple_damage_source, com.soytutta.mynethersdelight.common.block.MagmaCakeBlock#m_141947_#1 -->

### NetherStoveBlock (Type: Block)

- `oneenoughdamage:com/soytutta/mynethersdelight/common/block/nether_stove_block/m_141947/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: moddamagetypes:get_simple_damage_source, com.soytutta.mynethersdelight.common.block.NetherStoveBlock#m_141947_#1 -->
- `oneenoughdamage:com/soytutta/mynethersdelight/common/block/nether_stove_block/m_141947/2/r` <!-- mode: replace (/r), default: 1.0, DamageType: moddamagetypes:get_simple_damage_source, com.soytutta.mynethersdelight.common.block.NetherStoveBlock#m_141947_#2 -->

### PepperCrateBlock (Type: Block)

- `oneenoughdamage:com/soytutta/mynethersdelight/common/block/pepper_crate_block/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: moddamagetypes:get_simple_damage_source, com.soytutta.mynethersdelight.common.block.PepperCrateBlock#m_141947_#1 -->

### PowderyCaneBlock (Type: Block)

- `oneenoughdamage:com/soytutta/mynethersdelight/common/block/powdery_cane_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269325, com.soytutta.mynethersdelight.common.block.PowderyCaneBlock#m_7892_#1 -->

### PowderyCannonBlock (Type: Block)

- `oneenoughdamage:com/soytutta/mynethersdelight/common/block/powdery_cannon_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269325, com.soytutta.mynethersdelight.common.block.PowderyCannonBlock#m_7892_#1 -->

### PungentEffect (Type: Effect)

- `oneenoughdamage:com/soytutta/mynethersdelight/common/effect/pungent_effect/m_6742/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269425, com.soytutta.mynethersdelight.common.effect.PungentEffect#m_6742_#1 -->

### StriderRockEntity (Type: Projectile)

- `oneenoughdamage:com/soytutta/mynethersdelight/common/entity/strider_rock_entity/m_5790/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269390, com.soytutta.mynethersdelight.common.entity.StriderRockEntity#m_5790_#1 -->

## Neapolitan

### BeanstalkThornsBlock (Type: Block)

- `oneenoughdamage:com/teamabnormals/neapolitan/common/block/beanstalk_thorns_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: unknown, com.teamabnormals.neapolitan.common.block.BeanstalkThornsBlock#m_7892_#1 -->

## Netherexp

### Black Icicle (Type: Projectile)

- `oneenoughdamage:net/jadenxgamer/netherexp/registry/entity/custom/black_icicle/m_5790/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: unknown, net.jadenxgamer.netherexp.registry.entity.custom.BlackIcicle#m_5790_#1 -->

### GeyserBlock (Type: Block)

- `oneenoughdamage:net/jadenxgamer/netherexp/registry/block/custom/geyser_block/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269047, net.jadenxgamer.netherexp.registry.block.custom.GeyserBlock#m_141947_#1 -->

### Grave Cloud (Type: Entity)

- `oneenoughdamage:net/jadenxgamer/netherexp/registry/entity/custom/grave_cloud/damage_living_entities/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269079, net.jadenxgamer.netherexp.registry.entity.custom.GraveCloud#damageLivingEntities#1 -->

### Grenade Effect Cloud (投掷型解药效果云) (Type: Entity)

- `oneenoughdamage:net/jadenxgamer/netherexp/registry/entity/custom/grenade_effect_cloud/apply_water/1/r` <!-- mode: replace (/r), default: 15.0, DamageType: m_269104, net.jadenxgamer.netherexp.registry.entity.custom.GrenadeEffectCloud#applyWater#1 -->

### JackhammerFistItem (Type: Item)

- `oneenoughdamage:net/jadenxgamer/netherexp/registry/item/custom/jackhammer_fist_item/m_5551/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269298, net.jadenxgamer.netherexp.registry.item.custom.JackhammerFistItem#m_5551_#1 -->

### PumpChargeShotgunItem (Type: Item)

- `oneenoughdamage:net/jadenxgamer/netherexp/registry/item/custom/pump_charge_shotgun_item/m_7203/1/r` <!-- mode: replace (/r), default: 10.0, DamageType: m_269298, net.jadenxgamer.netherexp.registry.item.custom.PumpChargeShotgunItem#m_7203_#1 -->

### Soul Magma Block (灵魂岩浆块) (Type: Block)

- `oneenoughdamage:net/jadenxgamer/netherexp/registry/block/custom/soul_magma_block/m_141947/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269047, net.jadenxgamer.netherexp.registry.block.custom.SoulMagmaBlock#m_141947_#1 -->
- `oneenoughdamage:net/jadenxgamer/netherexp/registry/block/custom/soul_magma_block/m_141947/2/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269047, net.jadenxgamer.netherexp.registry.block.custom.SoulMagmaBlock#m_141947_#2 -->

## Northstar

### ChargeAtTargetGoal (Type: Other)

- `oneenoughdamage:com/lightning/northstar/entity/goals/charge_at_target_goal/m_8037/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269354, com.lightning.northstar.entity.goals.ChargeAtTargetGoal#m_8037_#1 -->

### MercuryCactusBlock (Type: Block)

- `oneenoughdamage:com/lightning/northstar/block/simple/mercury_cactus_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269325, com.lightning.northstar.block.simple.MercuryCactusBlock#m_7892_#1 -->

### NorthstarOxygen (Type: Other)

- `oneenoughdamage:com/lightning/northstar/world/oxygen/northstar_oxygen/on_breathe/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: northstar_suffocation_no_suit, com.lightning.northstar.world.oxygen.NorthstarOxygen#onBreathe#1 -->

### NorthstarTemperature (Type: Other)

- `oneenoughdamage:com/lightning/northstar/world/temperature/northstar_temperature/tick_entity/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269109, com.lightning.northstar.world.temperature.NorthstarTemperature#tickEntity#1 -->

### SulfuricAcidFluidBlock (Type: Block)

- `oneenoughdamage:com/lightning/northstar/fluid/sulfuric_acid_fluid_block/m_7892/1/r` <!-- mode: replace (/r), default: 6.0, DamageType: northstar_acid, com.lightning.northstar.fluid.SulfuricAcidFluidBlock#m_7892_#1 -->

### TitaniumTetrachlorideBlock (Type: Block)

- `oneenoughdamage:com/lightning/northstar/fluid/titanium_tetrachloride_block/m_7892/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269047, com.lightning.northstar.fluid.TitaniumTetrachlorideBlock#m_7892_#1 -->

## Plus

### BlazeStoveBlock (Type: Block)

- `oneenoughdamage:plus/dragons/createcentralkitchen/content/contraptions/blaze_stove/blaze_stove_block/m_141947/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: moddamagetypes:get_simple_damage_source, plus.dragons.createcentralkitchen.content.contraptions.blazeStove.BlazeStoveBlock#m_141947_#1 -->

## Quark

### AbstractPickarang (Type: Projectile)

- `oneenoughdamage:org/violetmoon/quark/content/tools/entity/rang/abstract_pickarang/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: pickarangmodule:get_damage_source, org.violetmoon.quark.content.tools.entity.rang.AbstractPickarang#m_5790_#1 -->

### Cactus Batch (仙人掌块) (Type: Block)

- `oneenoughdamage:net/minecraft/world/level/block/cactus_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269325, net.minecraft.world.level.block.CactusBlock#m_7892_#1 -->

### Parrot Egg (Type: Projectile)

- `oneenoughdamage:org/violetmoon/quark/content/tools/entity/parrot_egg/m_5790/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, org.violetmoon.quark.content.tools.entity.ParrotEgg#m_5790_#1 -->

### VexesDieWithTheirMastersModule (Type: Other)

- `oneenoughdamage:org/violetmoon/quark/content/tweaks/module/vexes_die_with_their_masters_module/check_whether_already_dead/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, org.violetmoon.quark.content.tweaks.module.VexesDieWithTheirMastersModule#checkWhetherAlreadyDead#1 -->

## Runiclib

### BlockItemMixin (Type: Other)

- `oneenoughdamage:net/azurune/runiclib/core/mixin/server/block_item_mixin/runiclib_place_block/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.azurune.runiclib.core.mixin.server.BlockItemMixin#runiclib$placeBlock#1 -->

### LivingEntityEffectsMixin (Type: Other)

- `oneenoughdamage:net/azurune/runiclib/core/mixin/server/living_entity_effects_mixin/runiclib_hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.azurune.runiclib.core.mixin.server.LivingEntityEffectsMixin#runiclib$hurt#1 -->

### VenomEffect (Type: Effect)

- `oneenoughdamage:net/azurune/runiclib/common/effect/venom_effect/m_6742/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.azurune.runiclib.common.effect.VenomEffect#m_6742_#1 -->

## Supplementaries

### AbstractMobContainerItem (Type: Item)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/items/abstract_mob_container_item/anger_nearby_entities/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269075, net.mehvahdjukaar.supplementaries.common.items.AbstractMobContainerItem#angerNearbyEntities#1 -->

### BambooSpikesBehavior (Type: Other)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/integration/create/bamboo_spikes_behavior/damage_entities/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.mehvahdjukaar.supplementaries.integration.create.BambooSpikesBehavior#damageEntities#1 -->

### BambooSpikesBlock (Type: Block)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/block/blocks/bamboo_spikes_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.5, DamageType: bamboospikesblock:get_damage_source, net.mehvahdjukaar.supplementaries.common.block.blocks.BambooSpikesBlock#m_7892_#1 -->

### BombEntity (Type: Other)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/entities/bomb_entity_bomb_type/after_exploded/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269425, net.mehvahdjukaar.supplementaries.common.entities.BombEntity$BombType#afterExploded#1 -->

### BombExplosion (Type: Other)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/misc/explosion/bomb_explosion/m_46061/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.mehvahdjukaar.supplementaries.common.misc.explosion.BombExplosion#m_46061_#1 -->

### CannonBallEntity (Type: Projectile)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/entities/cannon_ball_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.mehvahdjukaar.supplementaries.common.entities.CannonBallEntity#m_5790_#1 -->

### FirePitBlock (Type: Block)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/block/blocks/fire_pit_block/m_7892/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269387, net.mehvahdjukaar.supplementaries.common.block.blocks.FirePitBlock#m_7892_#1 -->

### FlammableLiquidBlock (Type: Block)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/fluids/flammable_liquid_block/m_7892/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269387, net.mehvahdjukaar.supplementaries.common.fluids.FlammableLiquidBlock#m_7892_#1 -->

### QuarkCompat (Type: Other)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/integration/quark_compat/tick_piston/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: unknown, net.mehvahdjukaar.supplementaries.integration.QuarkCompat#tickPiston#1 -->

### SlimeBallEntity (Type: Projectile)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/entities/slime_ball_entity/m_5790/1/r` <!-- mode: replace (/r), default: 0.0, DamageType: m_269390, net.mehvahdjukaar.supplementaries.common.entities.SlimeBallEntity#m_5790_#1 -->

### SlingshotProjectileEntity (Type: Projectile)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/entities/slingshot_projectile_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.mehvahdjukaar.supplementaries.common.entities.SlingshotProjectileEntity#m_5790_#1 -->

### ThrowableBrickEntity (Type: Projectile)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/entities/throwable_brick_entity/m_5790/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269390, net.mehvahdjukaar.supplementaries.common.entities.ThrowableBrickEntity#m_5790_#1 -->

### XPBottlingBehavior (Type: Other)

- `oneenoughdamage:net/mehvahdjukaar/supplementaries/common/events/overrides/x_p_bottling_behavior/try_performing_action/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.mehvahdjukaar.supplementaries.common.events.overrides.XPBottlingBehavior#tryPerformingAction#1 -->

## Tacz

### EntityKineticBullet (Type: Projectile)

- `oneenoughdamage:com/tacz/guns/entity/entity_kinetic_bullet/tac_attack_entity/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.tacz.guns.entity.EntityKineticBullet#tacAttackEntity#1 -->
- `oneenoughdamage:com/tacz/guns/entity/entity_kinetic_bullet/tac_attack_entity/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.tacz.guns.entity.EntityKineticBullet#tacAttackEntity#2 -->

### LuaEntityAccessor (Type: Other)

- `oneenoughdamage:com/tacz/guns/api/util/lua_entity_accessor/hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269264, com.tacz.guns.api.util.LuaEntityAccessor#hurt#1 -->

### ModernKineticGunItem (Type: Item)

- `oneenoughdamage:com/tacz/guns/item/modern_kinetic_gun_item/do_per_living_hurt/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269075, com.tacz.guns.item.ModernKineticGunItem#doPerLivingHurt#1 -->
- `oneenoughdamage:com/tacz/guns/item/modern_kinetic_gun_item/do_per_living_hurt/2/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269333, com.tacz.guns.item.ModernKineticGunItem#doPerLivingHurt#2 -->

### ProjectileExplosion (Type: Other)

- `oneenoughdamage:com/tacz/guns/util/block/projectile_explosion/m_46061/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.tacz.guns.util.block.ProjectileExplosion#m_46061_#1 -->

## Tenshilib

### AOEWeaponHandler (Type: Other)

- `oneenoughdamage:io/github/flemmli97/tenshilib/common/utils/a_o_e_weapon_handler/attack/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269075, io.github.flemmli97.tenshilib.common.utils.AOEWeaponHandler#attack#1 -->

## Tetra

### BleedingPotionEffect (Type: Effect)

- `oneenoughdamage:se/mickelus/tetra/effect/potion/bleeding_potion_effect/m_6742/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269079, se.mickelus.tetra.effect.potion.BleedingPotionEffect#m_6742_#1 -->

### DamageEntityItemEffectOutcome (Type: Other)

- `oneenoughdamage:se/mickelus/tetra/effect/data/outcome/damage_entity_item_effect_outcome/perform/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269079, se.mickelus.tetra.effect.data.outcome.DamageEntityItemEffectOutcome#perform#1 -->

### FocusEffect (Type: Other)

- `oneenoughdamage:se/mickelus/tetra/effect/focus_effect/on_player_tick/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: m_269063, se.mickelus.tetra.effect.FocusEffect#onPlayerTick#1 -->

### ItemEffectHandler (Type: Other)

- `oneenoughdamage:se/mickelus/tetra/effect/item_effect_handler/lambda_on_living_attack_4/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269374, se.mickelus.tetra.effect.ItemEffectHandler#lambda$onLivingAttack$4#1 -->

### ItemModularHandheld (Type: Item)

- `oneenoughdamage:se/mickelus/tetra/items/modular/item_modular_handheld/hit_entity/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269075, se.mickelus.tetra.items.modular.ItemModularHandheld#hitEntity#1 -->

### SweepingEffect (Type: Other)

- `oneenoughdamage:se/mickelus/tetra/effect/sweeping_effect/cause_truesweep_damage/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, se.mickelus.tetra.effect.SweepingEffect#causeTruesweepDamage#1 -->
- `oneenoughdamage:se/mickelus/tetra/effect/sweeping_effect/lambda_sweep_attack_4/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, se.mickelus.tetra.effect.SweepingEffect#lambda$sweepAttack$4#1 -->

### ThrownModularItemEntity (Type: Projectile)

- `oneenoughdamage:se/mickelus/tetra/items/modular/thrown_modular_item_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, se.mickelus.tetra.items.modular.ThrownModularItemEntity#m_5790_#1 -->

## The Bumblezone

### Crystalline Flower (晶化花) (Type: Block)

- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/blocks/crystalline_flower/m_7892/1/r` <!-- mode: replace (/r), default: 1.5, DamageType: m_269079, com.telepathicgrunt.the_bumblezone.blocks.CrystallineFlower#m_7892_#1 -->

### EssenceBlock (Type: Block)

- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/blocks/essence_block/m_7892/1/r` <!-- mode: replace (/r), default: 0.5, DamageType: m_269425, com.telepathicgrunt.the_bumblezone.blocks.EssenceBlock#m_7892_#1 -->

### HiveLifelineEnchantment (Type: Other)

- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/enchantments/hive_lifeline_enchantment/entity_hurt_event/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, com.telepathicgrunt.the_bumblezone.enchantments.HiveLifelineEnchantment#entityHurtEvent#1 -->

### Infinity Barrier (无限屏障) (Type: Block)

- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/blocks/infinity_barrier/m_6240/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269079, com.telepathicgrunt.the_bumblezone.blocks.InfinityBarrier#m_6240_#1 -->

### Pile of Pollen (花粉堆) (Type: Block)

- `oneenoughdamage:net/minecraft/world/entity/item/falling_block_entity/m_149646/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, net.minecraft.world.entity.item.FallingBlockEntity#m_149646_#1 -->

### Purple Spike Entity (紫色尖刺实体) (Type: Entity)

- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/entities/nonliving/purple_spike_entity/m_8119/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269298, com.telepathicgrunt.the_bumblezone.entities.nonliving.PurpleSpikeEntity#m_8119_#1 -->
- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/entities/nonliving/purple_spike_entity/m_8119/2/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269298, com.telepathicgrunt.the_bumblezone.entities.nonliving.PurpleSpikeEntity#m_8119_#2 -->

### SentryWatcherEntity (Type: Entity)

- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/entities/nonliving/sentry_watcher_entity/do_push/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269298, com.telepathicgrunt.the_bumblezone.entities.nonliving.SentryWatcherEntity#doPush#1 -->
- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/entities/nonliving/sentry_watcher_entity/server_ai_step/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269298, com.telepathicgrunt.the_bumblezone.entities.nonliving.SentryWatcherEntity#serverAiStep#1 -->

### Super Candle Wick (大蜡烛芯) (Type: Block)

- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/blocks/super_candle_wick/m_7892/1/r` <!-- mode: replace (/r), default: 0.5, DamageType: m_269387, com.telepathicgrunt.the_bumblezone.blocks.SuperCandleWick#m_7892_#1 -->

### ThrownStingerSpearEntity (Type: Projectile)

- `oneenoughdamage:com/telepathicgrunt/the_bumblezone/entities/nonliving/thrown_stinger_spear_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269525, com.telepathicgrunt.the_bumblezone.entities.nonliving.ThrownStingerSpearEntity#m_5790_#1 -->

## Trailandtales Delight

### Bamboo Tube Rice (竹筒饭) (Type: Block)

- `oneenoughdamage:show/tatd/mod/block/bamboo_tube_rice_block/m_213898/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: unknown, show.tatd.mod.block.BambooTubeRiceBlock#m_213898_#1 -->

## Vinery

### StackableLogBlock (Type: Block)

- `oneenoughdamage:net/satisfy/vinery/core/block/stackable_log_block/m_141947/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269387, net.satisfy.vinery.core.block.StackableLogBlock#m_141947_#1 -->

## Vvaddon

### Rush (Type: Other)

- `oneenoughdamage:com/vv/vvaddon/feature/rush/lambda_damage_entities_1/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269075, com.vv.vvaddon.Feature.Rush#lambda$damageEntities$1#1 -->

## Wds

### BerserkEffect (Type: Effect)

- `oneenoughdamage:com/wds/blackknightmod/common/effects/berserk_effect/on_living_hurt/1/r` <!-- mode: replace (/r), default: 1.5, DamageType: m_269264, com.wds.blackknightmod.common.effects.BerserkEffect#onLivingHurt#1 -->

### DragonsteelOverlordSword (Type: Item)

- `oneenoughdamage:com/wds/blackknightmod/item/dragonsteel_overlord_sword/m_7579/1/r` <!-- mode: replace (/r), default: 10.0, DamageType: m_269425, com.wds.blackknightmod.item.DragonsteelOverlordSword#m_7579_#1 -->

### IceArrowEntity (Type: Projectile)

- `oneenoughdamage:com/wds/blackknightmod/entity/ice_arrow_entity/m_5790/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269390, com.wds.blackknightmod.entity.IceArrowEntity#m_5790_#1 -->

### LavaFissureBlock (Type: Block)

- `oneenoughdamage:com/wds/blackknightmod/block/lava_fissure_block/m_7892/1/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269047, com.wds.blackknightmod.block.LavaFissureBlock#m_7892_#1 -->
- `oneenoughdamage:com/wds/blackknightmod/block/lava_fissure_block/m_7892/2/r` <!-- mode: replace (/r), default: 5.0, DamageType: m_269387, com.wds.blackknightmod.block.LavaFissureBlock#m_7892_#2 -->

### SolarFlareArmorEffects (Type: Other)

- `oneenoughdamage:com/wds/blackknightmod/common/armor/solar_flare_armor_effects/create_non_destructive_explosion/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: m_269075, com.wds.blackknightmod.common.armor.SolarFlareArmorEffects#createNonDestructiveExplosion#1 -->

### WindBombEntity (Type: Projectile)

- `oneenoughdamage:com/wds/blackknightmod/common/entity/wind_bomb_entity/explode/1/r` <!-- mode: replace (/r), default: 20.0, DamageType: windbombentity:damage_source_from_owner, com.wds.blackknightmod.common.entity.WindBombEntity#explode#1 -->
- `oneenoughdamage:com/wds/blackknightmod/common/entity/wind_bomb_entity/lambda_pull_and_damage_absorbed_entities_2/1/r` <!-- mode: replace (/r), default: 2.0, DamageType: windbombentity:damage_source_from_owner, com.wds.blackknightmod.common.entity.WindBombEntity#lambda$pullAndDamageAbsorbedEntities$2#1 -->

## Youkaishomecoming

### FairyIce (Type: Projectile)

- `oneenoughdamage:dev/xkmc/youkaishomecoming/content/entity/misc/fairy_ice/area_damage/1/r` <!-- mode: replace (/r), default: 9.0, DamageType: m_269104, dev.xkmc.youkaishomecoming.content.entity.misc.FairyIce#areaDamage#1 -->

### Frozen Frog (冻青蛙) (Type: Projectile)

- `oneenoughdamage:dev/xkmc/youkaishomecoming/content/entity/misc/frozen_frog/m_5790/1/r` <!-- mode: replace (/r), default: 1.0, DamageType: m_269390, dev.xkmc.youkaishomecoming.content.entity.misc.FrozenFrog#m_5790_#1 -->

### IYHDanmaku (Type: Other)

- `oneenoughdamage:dev/xkmc/youkaishomecoming/content/entity/danmaku/i_y_h_danmaku/hurt_target/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, dev.xkmc.youkaishomecoming.content.entity.danmaku.IYHDanmaku#hurtTarget#1 -->

### KoishiAttackCapability (Type: Other)

- `oneenoughdamage:dev/xkmc/youkaishomecoming/content/capability/koishi_attack_capability/tick/1/m` <!-- mode: multiply (/m), default: 1.0, DamageType: unknown, dev.xkmc.youkaishomecoming.content.capability.KoishiAttackCapability#tick#1 -->
