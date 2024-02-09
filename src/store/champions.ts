import { map, mapKeys } from "lodash";
import champions from "../config/champions";
import { Champion, ChosenChampion, Fighter, MyCreateSlice, Stat } from "../shared/types";

export interface ChampionNode {
  uuid: string,
  adjacentNodes: string[],
  completed: boolean,
  locked: boolean,
  hidden: boolean,
  champion?: Champion,
  leftChamp?: number,
  rightChamp?: number,
}

export interface ChampionsSlice {
  championGrid: ChampionNode[][],

  championDefeated: (chosen: ChosenChampion) => void,
  reset: () => void,
}

const createChampionsSlice: MyCreateSlice<ChampionsSlice, []> = (set, get) => {
  return {
    championGrid: getInitialGrid(),

    championDefeated: (chosen) => {
      const newRows = [...get().championGrid];
      const newChampionNode = newRows?.[chosen.row]?.[chosen.index] ?? null;
      if (!newChampionNode) return;

      newChampionNode.completed = true;
      newRows[chosen.row].forEach((node, i) => {
        if (i === chosen.index) return;

        node.locked = true;
      })
      if (newChampionNode.leftChamp !== undefined) {
        const leftChamp = newRows[chosen.row + 1][newChampionNode.leftChamp];
        leftChamp.locked = false;
        leftChamp.hidden = false;
      }
      if (newChampionNode.rightChamp !== undefined) {
        const rightChamp = newRows[chosen.row + 1][newChampionNode.rightChamp];
        rightChamp.locked = false;
        rightChamp.hidden = false;
      }

      set({championGrid: newRows});
    },

    reset: () => {
      const newRows = get().championGrid.map((row, r) => 
        row.map((champ) => ({
          ...champ,
          completed: false,
          locked: (r != 0),
        }))
      );
      set({ championGrid: newRows });
    },
  };
};

function getInitialGrid(): ChampionNode[][] {
  return [];
}

export default createChampionsSlice;