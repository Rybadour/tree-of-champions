import { getMapNodes } from "../config/node-map";
import { Champion, MapNode, MyCreateSlice } from "../shared/types";

export interface MapSlice {
  nodes: Record<string, MapNode>,
  playerNode: string,

  movePlayer: (newNode: string) => void,
  getNodeChampion: (nodeId: string) => Champion | undefined,
  completePlayerNode: () => void,
  reset: () => void,
}

const initialNodes = getInitialNodes();
const createMapSlice: MyCreateSlice<MapSlice, []> = (set, get) => {
  return {
    nodes: initialNodes,
    playerNode: Object.keys(initialNodes).find(id => initialNodes[id].isStart) ?? '',

    movePlayer: (newNode) => {
      const newNodes = {...get().nodes};

      newNodes[newNode].adjacentRooms.forEach(id => {
        const node = newNodes[id];
        if (node) {
          node.isLocked = false;
          node.isVisible = true;
        }
      });

      set({ playerNode: newNode, nodes: newNodes });
    },
    
    getNodeChampion: (nodeId) => {
      return get().nodes[nodeId].champion;
    },

    completePlayerNode: () => {
      const newNodes = {...get().nodes};
      const newNode = newNodes[get().playerNode];
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
      isVisible: node.isStart || node.adjacentRooms.some(adj => newNodes[adj].isStart), // TODO: Remember last revealed rooms
      isComplete: node.isStart,
      isLocked: node.isStart || node.adjacentRooms.some(adj => newNodes[adj].isStart),
    };
  }
  return newNodes;
}

export default createMapSlice;