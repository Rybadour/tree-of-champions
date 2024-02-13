import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";
import createPlayerSlice, { PlayerSlice } from "./player";
import createMapSlice, { MapSlice } from "./map";

export type FullStore = {
  player: PlayerSlice,
  map: MapSlice,
}

const useStore = create<FullStore>((set, get) => {
  const player = createLens(set, get, 'player');
  const map = createLens(set, get, 'map');

  return {
    player: createPlayerSlice(...player, map[1]),
    map: createMapSlice(...map),
  }
});

export default useStore;