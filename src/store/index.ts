import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";
import createChampionsSlice, { ChampionsSlice } from "./champions";
import createFightingSlice, { FightingSlice } from "./fighting";
import createPlayerSlice, { PlayerSlice } from "./player";
import createMapSlice, { MapSlice } from "./map";

export type FullStore = {
  player: PlayerSlice,
  champions: ChampionsSlice,
  fighting: FightingSlice,
  map: MapSlice,
}

const useStore = create<FullStore>((set, get) => {
  const player = createLens(set, get, 'player');
  const champions = createLens(set, get, 'champions');
  const fighting = createLens(set, get, 'fighting');
  const map = createLens(set, get, 'map');

  return {
    player: createPlayerSlice(...player),
    champions: createChampionsSlice(...champions),
    fighting: createFightingSlice(...fighting, player[1], champions[1]),
    map: createMapSlice(...map),
  }
});

export default useStore;