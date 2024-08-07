######################################
#        wishing_wells.json          #
######################################

This file contains a BlockStateRandomizer (see below) describing the probability of a given block being chosen.
These probabilities are used for Wishing Wells, which have 
loot deposits at the bottom of them.

######################################
#       BlockStateRandomizer         #
######################################

Describes a set of blockstates and the probability of each blockstate being chosen.
 - entries: An object where each entry's key is a blockstate, and each value is that blockstate's probability of being chosen.
      The total sum of all probabilities SHOULD NOT exceed 1.0!
 - defaultBlock: The blockstate used for any leftover probability ranges.
      For example, if the total sum of all the probabilities of the entries is 0.6, then
      there is a 0.4 chance of the defaultBlock being selected.

Here's an example randomizer:
"entries": {
  "minecraft:cobblestone": 0.25,
  "minecraft:air": 0.2,
  "minecraft:stone_bricks": 0.1
},
"defaultBlock": "minecraft:oak_planks"

For each block, this randomizer has a 25% chance of returning cobblestone, 20% chance of choosing air,
10% chance of choosing stone bricks, and a 100 - (25 + 20 + 10) = 45% chance of choosing oak planks (since it's the default block).
