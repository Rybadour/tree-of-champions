import { Fighter, MyCreateSlice, Stat, Stats } from "../shared/types";
import { mergeSumPartial } from "../shared/utils";

export interface PlayerSlice {
  fighter: Fighter,
  fightQueue: number[],
  autoQueueEnabled: boolean,

  wonFight: (newFighter: Fighter, stats: Stats) => void,
  lostFight: () => void,
  updateFightQueue: (row: number, column: number) => void,
  setAutoQueue: (enabled: boolean) => void,
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
      spriteSheet: 'Player_Saoirse32x32-Sheet.png',
      spriteSize: 32,
      attackAnimationRow: 0,
      baseStats: startingStats,
      health: startingStats.health!,
      attackCooldown: 0,
      statusEffects: {},
    },
    fightQueue: [],
    autoQueueEnabled: true,

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
    },

    updateFightQueue: (row: number, column: number) => {
      let newQueue = [...get().fightQueue];
      if (newQueue.length > row && newQueue[row] !== column) {
        newQueue = newQueue.slice(0, row);
      }

      newQueue[row] = column;
      set({fightQueue: newQueue});
    },

    setAutoQueue: (enabled: boolean) => {
      set({autoQueueEnabled: enabled});
    }

  };
};

export default createPlayerSlice;