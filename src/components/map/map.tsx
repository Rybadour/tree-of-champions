import styled, { css } from "styled-components";

import useStore from "../../store";

export function Map() {
  const map = useStore(s => s.map);

  return <Page>
    <h2>Maze</h2>

    <StyledMap>
    {map.nodes.map((node, n) =>
      <MapNode key={n} isComplete={node.completed} isTarget={false} cx={30} cy={30} r={20}> 
      </MapNode>
    )}
    </StyledMap>
  </Page>;
}

const Page = styled.div`
  width: 800px;
`;

const StyledMap = styled.svg`
  width: 100%;
  height: 100%;
  background-color: #000;
  border: 1px solid #FFF;
  border-radius: 10px;
`;

const MapNode = styled.circle<{isComplete: boolean, isTarget: boolean}>`
  fill: ${props => props.isComplete ? '#5B8FB9;' : '#DDD'};

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
