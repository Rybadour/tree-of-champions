import { Champion, ChampionFighter, Fighter, Status, StatusEffect } from "../shared/types";
import { using } from "../shared/utils";

export function updateFighter(elapsed: number, fighter: Fighter, opponent: Fighter) {
  updateEffect(elapsed, fighter, Status.Poisoned);
  updateEffect(elapsed, fighter, Status.Stunned);
  if (fighter.statusEffects.stunned || fighter.health <= 0) {
    return;
  }

  const attackTime = (1 / (fighter.baseStats.AttackSpeed ?? 0));
  if (fighter.attackCooldown < attackTime) {
    fighter.attackCooldown += elapsed;
    return;
  }
  
  fighter.attackCooldown = 0;

  let damage = fighter.baseStats.Damage ?? 0;
  if (Math.random() < (fighter.baseStats.CritChance ?? 0)) {
    damage *= 2;
  }
  if (opponent.baseStats.Armor) {
    damage -= opponent.baseStats.Armor;
  }
  opponent.health -= damage;

  if (fighter.baseStats.LifeSteal) {
    fighter.health = Math.min(fighter.health + damage * fighter.baseStats.LifeSteal, fighter.baseStats.Health ?? 0);
  }

  using(fighter.baseStats.Poison, p => {
    applyStatus(opponent, Status.Poisoned, p);
  });

  using(fighter.baseStats.StunChance, sc => {
    const stunHit = Math.random() < (sc / 100);
    if (stunHit) {
      applyStatus(opponent, Status.Stunned, 3);
    }
  });
}

export function updateEffect(elapsed: number, fighter: Fighter, status: Status) {
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

export function getChampionFighter(champion: Champion): ChampionFighter {
  return {
    champion: champion,
    fighter: {
      name: champion.name,
      spriteSheet: champion.spriteSheet,
      spriteSize: 16,
      attackAnimationRow: 0,
      baseStats: champion.stats,
      health: champion.stats.Health ?? 0,
      attackCooldown: 0,
      statusEffects: {},
    },
  };
}