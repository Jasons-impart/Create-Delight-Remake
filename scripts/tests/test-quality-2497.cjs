// Stateless #2497 regression tests; no Minecraft instance is started or modified.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const tags = fs.readFileSync(path.join(root, 'kubejs/server_scripts/Quality Food/tags.js'), 'utf8');
for (const id of ['#forge:popsicle_mold_filled', '#forge:popsicle_mold_solid', 'createdelight:raw_pie_crust', 'bakeries:egg_tart_shell', 'bakeries:raw_egg_tart']) {
  assert(tags.includes(`'${id}'`), `missing quality whitelist entry: ${id}`);
}
class Tag {
  constructor(value = {}) { this.value = value; }
  getCompound(key) { return new Tag(this.value[key] || {}); }
  getInt(key) { const value = this.value[key]; return Number.isInteger(value) ? value : 0; }
  put(key, tag) { this.value[key] = tag.value; }
  copy() { return new Tag(structuredClone(this.value)); }
}
class Stack {
  constructor(id, count, nbt = null) { Object.assign(this, {id, count, nbt}); }
  getOrCreateTag() { return this.nbt ||= new Tag(); }
  shrink(amount) { this.count -= amount; if (!this.count) this.nbt = null; }
}
const handlers = new Map();
vm.runInNewContext(fs.readFileSync(path.join(root, 'kubejs/server_scripts/Custom/food/popsicle.js'), 'utf8'), {
  ServerEvents: { tags() {}, recipes() {} },
  ItemEvents: { rightClicked(id, handler) { handlers.set(id, handler); }, foodEaten() {} },
  Item: { of(id, count) { return new Stack(id, count); } },
});
assert.equal(handlers.size, 12, 'all 12 solid-mold mappings must be covered');
let cases = 0;
for (const [mold, handler] of handlers) for (const quality of [null, 0, 1, 2, 3, 4, -1, 'iron']) {
  for (const crouching of [false, true]) for (const fullInventory of [false, true]) {
    const inputTag = quality === null ? null : new Tag({quality_food: {quality}});
    const input = new Stack(mold, 3, inputTag);
    const outputs = [];
    const player = {
      isPlayer() { return true; }, getItemInHand() { return input; },
      isCrouching() { return crouching; }, swing() {},
      getInventory() { return {add(stack) { if (!fullInventory) outputs.push(stack); return !fullInventory; }}; },
      drop(stack) { outputs.push(stack); },
    };
    let cancelled = false;
    handler({player, hand: 'main_hand', cancel() { cancelled = true; }});
    assert(cancelled);
    assert.equal(outputs.length, 2);
    const [popsicle, emptyMold] = outputs;
    assert.equal(emptyMold.id, 'ratatouille:popsicle_mold');
    assert.equal(popsicle.count, crouching ? 3 : 1);
    assert.equal(emptyMold.count, popsicle.count);
    assert.equal(input.count, crouching ? 0 : 2);
    assert.equal(emptyMold.nbt, null, 'empty reusable mold must not retain quality');
    const expected = Number.isInteger(quality) && quality >= 1 && quality <= 3 ? quality : 0;
    assert.equal(popsicle.nbt?.getCompound('quality_food').getInt('quality') || 0, expected);
    if (expected) {
      assert.notEqual(popsicle.nbt.value.quality_food, inputTag.value.quality_food, 'must deep-copy quality');
      popsicle.nbt.value.quality_food.quality = 99;
      assert.equal(inputTag.value.quality_food.quality, quality);
    }
    cases++;
  }
}
console.log(`PASS: whitelist entries + ${cases} right-click cases (12 molds, NONE/IRON/GOLD/DIAMOND, invalid/string NBT, single/batch, inventory/drop, deep copy)`);
