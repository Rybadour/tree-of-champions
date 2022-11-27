import { StoreApi } from "zustand";

export enum Stat {
  Health = "health",
  Damage = "damage",
  AttackSpeed = "attackSpeed",
  Armor = "armor",
  DodgeChance = "dodgeChance",
  LifeSteal = "lifeSteal",
  HealOnKill = "healOnKill",
  CritChance = "critChance",
  Poison = "poison",
  StunChance = "stunChance",
}

export type Stats = Partial<Record<Stat, number>>;

export enum Status {
  Poisoned = 'poisoned',
  Stunned = 'stunned',
}

export interface StatusEffect {
  status: Status,
  timeLeft: number,
  strength: number,
}

export function getEmptyStats(): Stats {
  return {
    [Stat.Health]: 0,
    [Stat.Damage]: 0,
    [Stat.AttackSpeed]: 0,
  };
}

export interface Champion {
  id: string,
  name: string,
  stats: Stats,
  earnedStats: Stats,
}

export interface ChosenChampion {
  champion: Champion,
  row: number,
  index: number,
}

export interface Fighter {
  name: string,
  baseStats: Stats,
  statusEffects: Partial<Record<Status, StatusEffect>>,
  health: number,
  attackCooldown: number,
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T