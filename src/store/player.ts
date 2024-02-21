import { ChampionFighter, Fighter, MyCreateSlice, Stat, Stats } from "../shared/types";
import { mergeSumPartial } from "../shared/utils";
import { MapSlice } from "./map";
import { getChampionFighter, updateFighter } from "../gamelogic/fighting";

export interface PlayerSlice {
  isFighting: boolean,
  fighter: Fighter,
  nodeQueue: string[],
  autoQueueEnabled: boolean,
  msUntilNextAction: number,
  championFighter?: ChampionFighter,

  update: (elapsed: number) => void,
  wonFight: (newFighter: Fighter, stats: Stats) => void,
  lostFight: () => void,
  setAutoQueue: (enabled: boolean) => void,
  addToQueue: (nodeId: string) => void,
  removeFromQueue: (nodeId: string) => void,
}

const startingStats: Stats = {
  [Stat.Health]: 20,
  [Stat.Damage]: 10,
  [Stat.AttackSpeed]: 0.25,
  [Stat.CritChance]: 0.75,
};

const MOVEMENT_DELAY = 0.5;

const createPlayerSlice: MyCreateSlice<PlayerSlice, [() => MapSlice]> = (set, get, map) => {
  function updateFighting(elapsed: number) {
    const player = get().fighter;
    let championFighter = get().championFighter;
    if (!championFighter) return;

    updateFighter(elapsed, player, championFighter.fighter);
    if (championFighter.fighter.health <= 0) {
      map().completePlayerNode();
      const earnedStats = championFighter.champion.earnedStats;
      set({
        isFighting: false,
        fighter: {
          ...player,
          baseStats: mergeSumPartial(get().fighter.baseStats, earnedStats),
          health: player.health + (earnedStats.Health ?? 0),
          attackCooldown: 0,
          statusEffects: {},
        }
      });
      return;
    }

    updateFighter(elapsed, championFighter.fighter, player);
    if (player.health <= 0) {
      get().lostFight();


      return;
    }

    set({ fighter: { ...player }, championFighter: { ...championFighter } });
  }
  return {
    isFighting: false,
    fighter: {
      name: "Player",
      spriteSheet: 'Player_Saoirse32x32-Sheet.png',
      spriteSize: 32,
      attackAnimationRow: 0,
      baseStats: startingStats,
      health: startingStats.Health!,
      attackCooldown: 0,
      statusEffects: {},
    },
    nodeQueue: [],
    autoQueueEnabled: true,
    msUntilNextAction: MOVEMENT_DELAY,
    championFighter: undefined,

    update: (elapsed) => {
      if (get().isFighting) {
        updateFighting(elapsed);
        return;
      }

      const queue = [...get().nodeQueue];
      if (queue.length === 0 || get().isFighting) return;

      const timeLeft = get().msUntilNextAction;
      if (timeLeft > 0) {
        set({ msUntilNextAction: timeLeft - elapsed});
        return;
      }

      const nextNode = queue.shift();
      map().movePlayer(nextNode!);

      const newState: Partial<PlayerSlice> = { msUntilNextAction: MOVEMENT_DELAY, nodeQueue: queue};
      const champion = map().getNodeChampion(nextNode!);
      if (champion) {
        newState.isFighting = true;
        newState.championFighter = getChampionFighter(champion);
      } else {
        map().completePlayerNode();
      }
      set(newState);
    },
    
    wonFight: (newFighter, stats) => {
    },

    lostFight: () => {
      map().reset();

      const fighter = get().fighter;
      set({
        isFighting: false,
        championFighter: undefined,
        fighter: {
          ...fighter,
          health: fighter.baseStats.Health ?? 0,
          attackCooldown: 0,
          statusEffects: {},
        }
      });
    },

    addToQueue: (nodeId: string) => {
      set({nodeQueue: [...get().nodeQueue, nodeId]});
    },

    removeFromQueue: (nodeId: string) => {
      const queue = get().nodeQueue;
      const index = queue.findIndex(n => n === nodeId);
      if (index !== -1) {
        set({ nodeQueue: queue.slice(0, index) });
      }
    },

    setAutoQueue: (enabled: boolean) => {
      set({autoQueueEnabled: enabled});
    }
  };
};


export default createPlayerSlice;