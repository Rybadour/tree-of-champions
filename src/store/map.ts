import { Champion, MyCreateSlice, Stat } from "../shared/types";

export interface MapNode {
  uuid: string,
  adjacentNodes: string[],
  completed: boolean,
  locked: boolean,
  visible: boolean,
  occupiedByPlayer: boolean,
  champion?: Champion,
  permaBonus?: {
    stat: Stat,
    amount: number,
  }
}

export interface MapSlice {
  nodes: MapNode[],

  nodeComplete: (node: MapNode) => void,
  reset: () => void,
}

const createMapSlice: MyCreateSlice<MapSlice, []> = (set, get) => {
  return {
    nodes: getInitialNodes(),

    nodeComplete: (node) => {
      const newNodes = [...get().nodes];
      const newNode = newNodes.find(n => n.uuid === node.uuid);
      if (!newNode) return;

      newNode.completed = true;
      newNode.adjacentNodes.forEach(uuid => {
        const node = newNodes.find(node => node.uuid === uuid);
        if (node) {
          node.locked = false;
          node.visible = true;
        }
      });

      set({nodes: newNodes});
    },

    reset: () => {
      const newNodes = getInitialNodes();

      const oldNodes = get().nodes;
      for (let i = 0; i < oldNodes.length; ++i) {
        newNodes[i] = {...newNodes[i], visible: oldNodes[i].visible};
      }

      set({ nodes: newNodes });
    }
  }
}

function getInitialNodes(): MapNode[] {
  return [
    {uuid: '0', adjacentNodes: ['1', '2'], completed: false, locked: false, visible: true, occupiedByPlayer: true},
    {uuid: '1', adjacentNodes: ['3'], completed: false, locked: true, visible: false, occupiedByPlayer: false},
    {uuid: '2', adjacentNodes: ['3'], completed: false, locked: true, visible: false, occupiedByPlayer: false},
    {uuid: '3', adjacentNodes: [], completed: false, locked: true, visible: false, occupiedByPlayer: false}
  ];
}

export default createMapSlice;