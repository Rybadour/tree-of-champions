import styled from "styled-components";

import useStore from "../../store";
import { ChampionButton, nodeWidth } from "./champion-button";

export function ChampionTree() {
  const championRows = useStore(s => s.champions.championRows);

  return <Page>
    <h2>Champions</h2>

    <Tree>
    {championRows.map((row, r) =>
      <ChampionRow key={r}>
        {row.map((champ, i) =>
          <ChampionButton 
            key={`${r}:${i}`}
            champion={champ}
            row={r}
            column={i}
          />
        )}
      </ChampionRow>
    )}
    </Tree>
  </Page>;
}

const Page = styled.div`
  width: 800px;
`;

const Tree = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${nodeWidth/4}px;
`;

const ChampionRow = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
`;
