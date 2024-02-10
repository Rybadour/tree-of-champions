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
  spriteSheet: string,
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
  spriteSheet: string,
  spriteSize: number,
  attackAnimationRow: number,
  baseStats: Stats,
  statusEffects: Partial<Record<Status, StatusEffect>>,
  health: number,
  attackCooldown: number,
}

export interface MapNode {
  id: string,
  x: number;
  y: number;
  adjacentRooms: string[],
  isStart: boolean,
  isComplete: boolean,
  isLocked: boolean,
  isVisible: boolean,
  occupiedByPlayer: boolean,
  champion?: Champion,
  permaBonus?: {
    stat: Stat,
    amount: number,
  }
}


export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T