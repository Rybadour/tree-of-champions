import styled from "styled-components";
import { pick } from "lodash";
import shallow from "zustand/shallow";

import useStore from "../store";
import { autoFormatNumber, enumFromKey } from "../shared/utils";
import { Stat } from "../shared/types";
import statsConfig from "../config/stats";
import Icon from "../shared/components/icon";
import { PlayerSlice } from "../store/player";
import { ChampionNode } from "../store/champions";

enum ConnectionStatus {
  Unavailable,
  Unlocked,
  Completed,
  Queued,
}

export function ChampionTree() {
  const champions = useStore(s => pick(s.champions, [
    'championRows',
  ]), shallow);
  const player = useStore(s => s.player);
  const startFight = useStore(s => s.fighting.startFight);

  return <Page>
    <h2>Champions</h2>

    <Tree>
    {champions.championRows.map((row, r) =>
      <ChampionRow key={r}>
        {row.map((champ, i) => {
          const nextRow = champions.championRows[r + 1];
          const connections = <>
            {[[champ.leftChamp, "left"] as const, [champ.rightChamp, "right"] as const].map((con) => {
              if (con[0] === undefined) return;

              let status = ConnectionStatus.Unavailable;
              if (champ.completed) {
                if (nextRow[con[0]].completed) {
                  status = ConnectionStatus.Completed;
                } else if (nextRow[con[0]].locked) {
                  status = ConnectionStatus.Unavailable;
                } else {
                  status = ConnectionStatus.Unlocked;
                }
              } else {
                if (player.fightQueue[r] === i && player.fightQueue[r + 1] === con[0]) {
                  status = ConnectionStatus.Queued;
                } else {
                  status = ConnectionStatus.Unavailable;
                }
              }

              return <ConnectionArrow status={status} direction={con[1]} />
            })}
          </>;
          return (champ.completed ?
            <ChampionCompleted>
              <span>{champ.champion.name}</span>
              {connections}
            </ChampionCompleted> :
            <ChampionButton
              key={`${r}:${i}`}
              onClick={() => startFight(player.fighter, champ.champion, r, i)}
              disabled={champ.locked}
            >
              <strong>{champ.champion.name}</strong>
              <Stats>
              {Object.entries(champ.champion.earnedStats)
              .map(([s, val]) => [enumFromKey(Stat, s)!, val] as [Stat, number])
              .map(([s, val]) => 
                <StatStyled key={s} data-tip={`On Defeat ${val > 0 ? 'Gain' : 'Lose'} ${statsConfig[s].label}`} data-place="bottom">
                  <span>{val > 0 ? '+' : ''}{autoFormatNumber(val)}</span>
                  <Icon icon={statsConfig[s].icon} size="xs" pixelated />
                </StatStyled>
              )}
              </Stats>
              {connections}
            </ChampionButton>
          );
        })}
      </ChampionRow>
    )}
    </Tree>
  </Page>;
}

const Page = styled.div`
  width: 800px;
`;

const nodeWidth = 140;
const nodeHeight = 80;
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

const ChampionButton = styled.button`
  position: relative;
  width: ${nodeWidth}px;
  height: ${nodeHeight}px;
  border-radius: 5px;
  border: none;
  font-weight: bold;
  padding: 3px 6px;
  background-color: #CCC;

  &:hover {
    outline: 3px solid #3d73ba;
  }

  &:disabled {
    background-color: #888;
    outline: none;
    cursor: default;

    i {
      filter: opacity(0.3);
    }
  }
`;

const ChampionCompleted = styled.div`
  position: relative;
  width: ${nodeWidth}px;
  height: ${nodeHeight}px;
  border-radius: 5px;
  background-color: #419157;
  color: white;
  text-decoration: line-through;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
`;

const StatStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
`;

function ConnectionArrow(props: {status: ConnectionStatus, direction: string}) {
  return <ConnectionArrowStyled status={props.status}>
    <svg overflow="visible">
      {props.direction === "left" && <line x1="-30" y1="0" x2="-60" y2="25"></line>}
      {props.direction === "right" && <line x1="30" y1="0" x2="60" y2="25"></line>}
    </svg>
  </ConnectionArrowStyled>;
}

const ConnectionArrowStyled = styled.div<{status: ConnectionStatus}>`
  position: absolute;
  top: 100%;
  margin-top: 4px;
  left: 50%;

  ${p => p.status === ConnectionStatus.Unlocked && `stroke: white;`}
  ${p => p.status === ConnectionStatus.Completed && `stroke: white;`}
  ${p => p.status === ConnectionStatus.Queued && `stroke: blue;`}
  stroke-width: 3px;
`;