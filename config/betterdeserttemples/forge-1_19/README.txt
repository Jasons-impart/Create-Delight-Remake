######################################
#          armorstands.json          #
######################################
  This file contains ItemRandomizers describing the probability distribution of armor on armor stands.
Armor stands spawn in armory rooms and wardrobe rooms.
For information on ItemRandomizers, see the bottom of this README.
######################################
#          itemframes.json          #
######################################
  This file contains ItemRandomizers describing the probability distribution of items in item frames.
Item frames only spawn in food storage rooms and armoury rooms.
For information on ItemRandomizers, see the bottom of this README.
######################################
#         ItemRandomizers          #
######################################
Describes a set of items and the probability of each item being chosen.
 - entries: An object where each entry's key is a item, and each value is that item's probability of being chosen.
      The total sum of all probabilities SHOULD NOT exceed 1.0!
 - defaultItem: The item used for any leftover probability ranges.
      For example, if the total sum of all the probabilities of the entries is 0.6, then
      there is a 0.4 chance of the defaultItem being selected.
Here's an example ItemRandomizer:
"entries": {
  "minecraft:stone_axe": 0.25,
  "minecraft:shield": 0.2,
  "minecraft:air": 0.1
},
"defaultItem": "minecraft:iron_axe"
For each item, this randomizer has a 25% chance of returning a stone axe, 20% chance of choosing a shield,
10% chance of choosing air (nothing), and a 100 - (25 + 20 + 10) = 45% chance of choosing an iron axe (since it's the default item).
