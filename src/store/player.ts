import { Fighter, MyCreateSlice, Stat, Stats } from "../shared/types";
import { mergeSumPartial } from "../shared/utils";

export interface PlayerSlice {
  fighter: Fighter,

  wonFight: (newFighter: Fighter, stats: Stats) => void,
  lostFight: () => void,
}

const startingStats: Stats = {
  [Stat.Health]: 100,
  [Stat.Damage]: 10,
  [Stat.AttackSpeed]: 0.25,
  [Stat.CritChance]: 0.75,
};

const createPlayerSlice: MyCreateSlice<PlayerSlice, []> = (set, get) => {
  return {
    fighter: {
      name: "Player",
      spriteSheet: 'Bear_16x16.png',
      baseStats: startingStats,
      health: startingStats.health!,
      attackCooldown: 0,
      statusEffects: {},
    },

    wonFight: (newFighter, stats) => {
      set({fighter: {
        ...newFighter,
        baseStats: mergeSumPartial(get().fighter.baseStats, stats),
        health: newFighter.health + (stats.health ?? 0),
        attackCooldown: 0,
        statusEffects: {},
      }});
    },

    lostFight: () => {
      const fighter = get().fighter;
      set({fighter: {
        ...fighter,
        health: fighter.baseStats.health ?? 0,
        attackCooldown: 0,
        statusEffects: {},
      }});
    }
  };
};

export default createPlayerSlice;