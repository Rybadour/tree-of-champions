import { StoreApi } from "zustand";

export enum Stat {
  Health = "health",
  Damage = "damage",
  AttackSpeed = "attackSpeed",
  Armor = "armor",
}

export type Stats = Record<Stat, number>;

export function getEmptyStats(): Stats {
  return {
    [Stat.Health]: 0,
    [Stat.Damage]: 0,
    [Stat.AttackSpeed]: 0,
    [Stat.Armor]: 0,
  };
}

export interface Champion {
  id: string,
  name: string,
  stats: Partial<Stats>,
  earnedStats: Partial<Stats>,
}

export interface Fighter {
  name: string,
  baseStats: Partial<Stats>,
  health: number,
  attackCooldown: number,
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T