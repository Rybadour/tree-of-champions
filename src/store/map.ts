import { getMapNodes } from "../config/node-map";
import { MapNode, MyCreateSlice } from "../shared/types";

export interface MapSlice {
  nodes: Record<string, MapNode>,

  nodeComplete: (node: MapNode) => void,
  reset: () => void,
}

const createMapSlice: MyCreateSlice<MapSlice, []> = (set, get) => {
  return {
    nodes: getInitialNodes(),

    nodeComplete: (node) => {
      const newNodes = {...get().nodes};
      const newNode = newNodes[node.id];
      if (!newNode) return;

      newNode.isComplete = true;
      newNode.adjacentRooms.forEach(id => {
        const node = newNodes[id];
        if (node) {
          node.isLocked = false;
          node.isVisible = true;
        }
      });

      set({nodes: newNodes});
    },

    reset: () => {
      const newNodes = getInitialNodes();

      const oldNodes = get().nodes;
      for (const id in oldNodes) {
        const oldNode = oldNodes[id];
        if (oldNode.isStart) {
          newNodes[oldNode.id] = oldNode;
        } else {
          newNodes[oldNode.id] = {
            ...oldNode,
            isComplete: false,
            isLocked: true,
            isVisible: false,
          };
        }
      }

      set({ nodes: newNodes });
    }
  }
}

function getInitialNodes(): Record<string, MapNode> {
  const newNodes = getMapNodes();
  for (const n in newNodes) {
    const node = newNodes[n];
    newNodes[n] = {
      ...newNodes[n],
      occupiedByPlayer: (node.isStart ? true : false),
      isLocked: node.isStart || node.adjacentRooms.some(adj => newNodes[adj].isStart),
    };
  }
  return newNodes;
}

export default createMapSlice;