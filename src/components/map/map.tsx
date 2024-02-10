import styled, { css } from "styled-components";

import useStore from "../../store";
import { MapNode } from "../../shared/types";

export function Map() {
  const map = useStore(s => s.map);

  return <Page>
    <h2>Maze</h2>

    <StyledMap>
      {Object.keys(map.nodes).map((n) => 
        <NodeConnections nodeMap={map.nodes} node={map.nodes[n]} />
      )}
      {Object.keys(map.nodes).map((n) => {
        const node = map.nodes[n];
        return <StyledMapNode key={n} isComplete={node.isComplete} isTarget={node.occupiedByPlayer} cx={node.x} cy={node.y} r={15} />; 
      })}
    </StyledMap>
  </Page>;
}

interface INodeConnectionsProps {
  nodeMap: Record<string, MapNode>,
  node: MapNode,
}
function NodeConnections({nodeMap, node}: INodeConnectionsProps) {
  return <>
    {node.adjacentRooms.map(otherId => {
      const other = nodeMap[otherId];
      return <>
        <NodeConnection
          key={node.id + '-' + otherId} x1={node.x} y1={node.y} x2={other.x} y2={other.y}
          isComplete={node.isComplete && other.isComplete}
        />
      </>;
    })}
  </>;
}


const Page = styled.div`
  width: 800px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledMap = styled.svg`
  width: 100%;
  height: 100%;
  background-color: #000;
  border: 1px solid #FFF;
  border-radius: 10px;
`;

const StyledMapNode = styled.circle<{isComplete: boolean, isTarget: boolean}>`
  fill: ${props => props.isComplete ? '#5B8FB9;' : '#777'};

  ${p => p.isTarget && css`
    stroke: white;
    stroke-width: 2px;
    stroke-dasharray: 7 3;
  `}

  &:hover {
    filter: brightness(0.9);
    stroke: white;
    stroke-width: 2px;
  }
`;

const NodeConnection = styled.line<{isComplete: boolean}>`
  stroke: ${p => p.isComplete ? 'white': 'grey'};
  stroke-width: 3px;
`;
