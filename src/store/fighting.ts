import { Champion, ChosenChampion, Fighter, MyCreateSlice, Stats, Status, StatusEffect } from "../shared/types";
import { using } from "../shared/utils";
import { ChampionsSlice } from "./champions";
import { PlayerSlice } from "./player";

export interface ChampionFighter extends ChosenChampion {
  fighter: Fighter,
} 

export interface FightingSlice {
  player: Fighter | null,
  championFighter: ChampionFighter | null,

  startFight: (player: Fighter, champion: Champion, row: number, index: number) => void, 
  update: (elapsed: number) => void,
}

const createFightingSlice: MyCreateSlice<FightingSlice, [() => PlayerSlice, () => ChampionsSlice]>
= (set, get, playerStore, championsStore) => {
  return {
    player: null,
    championFighter: null,
    champion: null,

    startFight: (player, champion, row, index) => {
      set({ player, championFighter: {...getChampionFighter(champion), row, index} });
    },
    
    update: (elapsed) => {
      let {player, championFighter} = get();
      if (!player || !championFighter) return;

      updateFighter(elapsed, player, championFighter.fighter);
      if (championFighter.fighter.health <= 0) {
        playerStore().wonFight(player, championFighter.champion.earnedStats);
        championsStore().championDefeated(championFighter);

        //set({player: playerStore().fighter, championFighter: getNextFighter()});
        return;
      }

      updateFighter(elapsed, championFighter.fighter, player);
      if (player.health <= 0) {
        playerStore().lostFight();
        championsStore().reset();

        //set({player: playerStore().fighter, championFighter: getNextFighter()});
        return;
      }

      set({player: {...player}, championFighter: {...championFighter}});
    },
  };
};

function updateFighter(elapsed: number, fighter: Fighter, opponent: Fighter) {
  updateEffect(elapsed, fighter, Status.Poisoned);
  updateEffect(elapsed, fighter, Status.Stunned);
  if (fighter.statusEffects.stunned || fighter.health <= 0) {
    return;
  }

  const attackTime = (1 / (fighter.baseStats.attackSpeed ?? 0));
  if (fighter.attackCooldown < attackTime) {
    fighter.attackCooldown += elapsed;
    return;
  }
  
  fighter.attackCooldown = 0;

  let damage = fighter.baseStats.damage ?? 0;
  if (Math.random() < (fighter.baseStats.critChance ?? 0)) {
    damage *= 2;
  }
  if (opponent.baseStats.armor) {
    damage -= opponent.baseStats.armor;
  }
  opponent.health -= damage;

  if (fighter.baseStats.lifeSteal) {
    fighter.health = Math.min(fighter.health + damage * fighter.baseStats.lifeSteal, fighter.baseStats.health ?? 0);
  }

  using(fighter.baseStats.poison, p => {
    applyStatus(opponent, Status.Poisoned, p);
  });

  using(fighter.baseStats.stunChance, sc => {
    const stunHit = Math.random() < (sc / 100);
    if (stunHit) {
      applyStatus(opponent, Status.Stunned, 3);
    }
  });
}

function updateEffect(elapsed: number, fighter: Fighter, status: Status) {
  const effect = fighter.statusEffects[status];
  if (!effect) return;

  effect.timeLeft -= elapsed;
  if (effect.timeLeft <= 0) {
    fighter.statusEffects[status] = undefined;
  }

  if (status === Status.Poisoned) {
    fighter.health -= (effect.strength * elapsed);
  }
}

const statusTimeMap: Record<Status, number> = {
  [Status.Poisoned]: 5,
  [Status.Stunned]: 3,
}

function applyStatus(fighter: Fighter, status: Status, value: number) {
  const newStatus: StatusEffect = fighter.statusEffects[status] ?? {status, strength: 0, timeLeft: statusTimeMap[status]};
  newStatus.strength += value;
  fighter.statusEffects[status] = newStatus;
}

function getChampionFighter(champion: Champion): Pick<ChampionFighter, "champion" | "fighter"> {
  return {
    champion: champion,
    fighter: {
      name: champion.name,
      spriteSheet: champion.spriteSheet,
      spriteSize: 16,
      attackAnimationRow: 0,
      baseStats: champion.stats,
      health: champion.stats.health ?? 0,
      attackCooldown: 0,
      statusEffects: {},
    },
  };
}

export default createFightingSlice;