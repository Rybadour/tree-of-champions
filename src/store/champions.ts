import champions from "../config/champions";
import { Champion, ChosenChampion, Fighter, MyCreateSlice } from "../shared/types";

export interface ChampionNode {
  champion: Champion,
  completed: boolean,
  locked: boolean,
}

export interface ChampionsSlice {
  championRows: ChampionNode[][],

  championDefeated: (chosen: ChosenChampion) => void,
  reset: () => void,
}

const rows = [
  ['rat', 'bat', 'spider'],
  ['skeleton', 'ghost', 'python', 'beast'],
  ['rat', 'rat', 'rat', 'shadow', 'rat'],
  ['rat', 'rat', 'rat', 'rat'],
  ['rat', 'rat', 'rat'],
  ['rat', 'rat'],
  ['rat'],
];

const createChampionsSlice: MyCreateSlice<ChampionsSlice, []> = (set, get) => {
  return {
    championRows: getInitialRows(),

    championDefeated: (chosen) => {
      const newRows = [...get().championRows];
      const newChampionNode = newRows?.[chosen.row]?.[chosen.index] ?? null;
      if (!newChampionNode) return;

      newChampionNode.completed = true;
      newRows[chosen.row].forEach((node, i) => {
        if (i === chosen.index) return;

        node.locked = true;
      })
      if (newRows.length > chosen.row + 1) {
        if (newRows[chosen.row + 1].length > newRows[chosen.row].length) {
          newRows[chosen.row + 1][chosen.index].locked = false;
          newRows[chosen.row + 1][chosen.index + 1].locked = false;
        } else {
          if (chosen.index == 0) {
            newRows[chosen.row + 1][0].locked = false;
          } else if (chosen.index == newRows[chosen.row].length - 1) {
            newRows[chosen.row + 1][newRows[chosen.row + 1].length - 1].locked = false;
          } else {
            newRows[chosen.row + 1][chosen.index - 1].locked = false;
            newRows[chosen.row + 1][chosen.index].locked = false;
          }
        }
      }

      set({championRows: newRows});
    },

    reset: () => {
      set({championRows: getInitialRows()});
    },
  };
};

function getInitialRows() {
  return rows.map((row, r) => 
    row.map((id, i) => ({
      champion: champions[id],
      completed: false,
      locked: (r !== 0),
    }))
  );
}

export default createChampionsSlice;