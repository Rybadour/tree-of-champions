import { first } from 'lodash';
import maze1 from '../../configs/Maze1/simplified/Level_0/data.json';
import { MapNode, Stat } from '../shared/types';
import champions from './champions';
import { enumFromKey } from '../shared/utils';

interface INodeMapDesign {
  entities: {
    Room: {
      iid: string,
      x: number,
      y: number,
      customFields: {
        Monster: string | null,
        PermaBonusStat: string | null,
        PermaBonusAmount: number | null,
        AdjacentRooms: {
          entityIid: string,
        }[]
      }
    }[],
    StartIndicator: {
      iid: string,
      x: number,
      y: number,
      customFields: {
        StartingRoom: {
          entityIid: string,
        }
      }
    }[]
  }
}


export function getMapNodes() {
  const nodes: Record<string, MapNode> = {};

  const startId = getStart(maze1);
  maze1.entities.Room.forEach(node => {
    nodes[node.iid] = {
      id: node.iid,
      x: node.x,
      y: node.y,
      adjacentRooms: node.customFields.AdjacentRooms.map(adj => 
        adj.entityIid
      ),
      isStart: node.iid === startId,
      isLocked: false,
      isVisible: false,
      isComplete: false,
      champion: champions[node.customFields.Monster ?? 'NOOP'],
    };
    if (node.customFields.PermaBonusStat) {
      const stat = enumFromKey(Stat, node.customFields.PermaBonusStat);
      if (!stat) {
        throw new Error(`Invalid stat: ${node.customFields.PermaBonusStat}`);
      }
      nodes[node.iid].permaBonus = {
        stat: stat,
        amount: node.customFields.PermaBonusAmount ?? 0,
      };
    }
  })

  return nodes;
}

export function getStart(nodeMap: INodeMapDesign): string | undefined {
  return first(nodeMap.entities.StartIndicator)?.customFields.StartingRoom.entityIid;
}