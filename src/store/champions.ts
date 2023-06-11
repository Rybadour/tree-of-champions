import champions from "../config/champions";
import { Champion, ChosenChampion, Fighter, MyCreateSlice } from "../shared/types";

export interface ChampionNode {
  champion: Champion,
  completed: boolean,
  locked: boolean,
  leftChamp?: number,
  rightChamp?: number,
}

export interface ChampionsSlice {
  championRows: ChampionNode[][],

  championDefeated: (chosen: ChosenChampion) => void,
  reset: () => void,
}

const rows = [
  ['rat', 'bat', 'spider'],
  ['skeleton', 'ghost', 'python', 'beast'],
  ['god', 'god', 'beholder', 'shadow', 'god'],
  ['god', 'god', 'god', 'god'],
  ['god', 'god', 'god'],
  ['god', 'god'],
  ['god'],
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
      if (newChampionNode.leftChamp !== undefined) {
        newRows[chosen.row + 1][newChampionNode.leftChamp].locked = false;
      }
      if (newChampionNode.rightChamp !== undefined) {
        newRows[chosen.row + 1][newChampionNode.rightChamp].locked = false;
      }

      set({championRows: newRows});
    },

    reset: () => {
      set({championRows: getInitialRows()});
    },
  };
};

function getInitialRows(): ChampionNode[][] {
  return rows.map((row, r) => {
    const nextRow = r + 1;
    const rowLength = row.length;

    return row.map((id, i) => {
      const nextChamps: Pick<ChampionNode, "leftChamp" | "rightChamp"> = {};
      if (rows.length > nextRow) {
        if (rows[nextRow].length > rowLength) {
          nextChamps.leftChamp = i;
          nextChamps.rightChamp = i + 1;
        } else {
          if (i == 0) {
            nextChamps.rightChamp = 0;
          } else if (i == rowLength - 1) {
            nextChamps.leftChamp = rows[nextRow].length - 1;
          } else {
            nextChamps.leftChamp = i - 1;
            nextChamps.rightChamp = i;
          }
        }
      }

      return {
        champion: champions[id],
        completed: false,
        locked: (r !== 0),
        ...nextChamps,
      };
    });
  });
}

export default createChampionsSlice;