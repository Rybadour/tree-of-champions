import styled, { css } from "styled-components";

import useStore from "../../store";
import { MapNode } from "../../shared/types";

const ZOOM = 2;

export function Map() {
  const map = useStore(s => s.map);

  return <Page>
    <h2>Maze</h2>

    <MapContainer>
      <StyledMap>
        {Object.keys(map.nodes).map((n) => 
          <NodeConnections nodeMap={map.nodes} node={map.nodes[n]} />
        )}
        {Object.keys(map.nodes).map((n) => {
          const node = map.nodes[n];
          if (!node.isVisible) return null;

          return <StyledMapNode
            key={n} isComplete={node.isComplete} isTarget={false}
            cx={node.x * ZOOM} cy={node.y * ZOOM} r={20} />; 
        })}
      </StyledMap>
      <SpritesContainer>
        {Object.keys(map.nodes).map((n) => {
          const node = map.nodes[n];
          if (!node.isVisible) return null;

          if (node.occupiedByPlayer) {
            return <Sprite spriteSheet="warrior.png" x={node.x * ZOOM} y={node.y * ZOOM}
              spriteSize={16} row={0} scale={1.5} />
          }
          return <Sprite spriteSheet={node.champion?.spriteSheet ?? ''} x={node.x * ZOOM} y={node.y * ZOOM}
            spriteSize={16} row={1} scale={1.5} />
        })}
      </SpritesContainer>
      </MapContainer>
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
      if (!other.isVisible || !node.isVisible) return null;
      return <NodeConnection
          key={node.id + '-' + otherId} x1={node.x * ZOOM} y1={node.y * ZOOM} x2={other.x * ZOOM} y2={other.y * ZOOM}
          isComplete={node.isComplete && other.isComplete}
        />;
    })}
  </>;
}


const Page = styled.div`
  width: 800px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledMap = styled.svg`
  width: 100%;
  height: 100%;
  background-color: #000;
  border: 1px solid #fff;
  border-radius: 10px;
`;

const SpritesContainer = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 100%;
  height: 100%;
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

const Sprite = styled.div<{
  spriteSheet: string,
  spriteSize: number,
  row: number,
  x: number,
  y: number,
  scale: number,
}>`
  position: absolute;
  top: ${p => p.y - p.spriteSize/2}px;
  left: ${p => p.x - p.spriteSize/2}px;
  background-image: url(${p => p.spriteSheet});
  width: ${p => p.spriteSize}px;
  height: ${p => p.spriteSize}px;
  transform: scale(${p => p.scale});
  image-rendering: pixelated;
  background-position: 0px ${p => p.spriteSize * -p.row}px;
`;