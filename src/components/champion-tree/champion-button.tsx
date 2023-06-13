import { FloatingArrow, arrow, offset, useFloating, useHover, useInteractions } from "@floating-ui/react";
import { useCallback, useRef, useState } from "react";
import { Champion, Stat } from "../../shared/types";
import useStore from "../../store";
import { pick } from "lodash";
import shallow from "zustand/shallow";
import { ChampionNode } from "../../store/champions";
import { ConnectionArrow, ConnectionStatus } from "./connection-arrow";
import { autoFormatNumber, enumFromKey } from "../../shared/utils";
import statsConfig from "../../config/stats";
import Icon from "../../shared/components/icon";
import styled from "styled-components";

export interface ChampionButtonProps {
  champion: ChampionNode, 
  row: number,
  column: number,
}

export function ChampionButton(props: ChampionButtonProps) {
  const champ = props.champion;
  const championRows = useStore(s => s.champions.championRows);
  const player = useStore(s => s.player, shallow);
  const startFight = useStore(s => s.fighting.startFight);

  const onStartFight = useCallback((champ: Champion, row: number, column: number) => {
    player.updateFightQueue(row, column);
    startFight(player.fighter, champ, row, column);
  }, [player, startFight]);

  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const {refs, floatingStyles, context} = useFloating({
    placement: "bottom",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      arrow({ element: arrowRef }),
      offset(7 + 4), // arrow size plus gap
    ]
  });
  const hover = useHover(context);
  const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

  const nextRow = championRows[props.row + 1];
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
        if (player.fightQueue[props.row] === props.column && player.fightQueue[props.row + 1] === con[0]) {
          status = ConnectionStatus.Queued;
        } else {
          status = ConnectionStatus.Unavailable;
        }
      }

      return <ConnectionArrow status={status} direction={con[1]} />
    })}
  </>;
  return <ButtonContainer ref={refs.setReference} {...getReferenceProps()}>
    {champ.completed ?
      <ChampionCompleted>
        <span>{champ.champion.name}</span>
        {connections}
      </ChampionCompleted> :
      <ChampionButtonStyled
        onClick={() => onStartFight(champ.champion, props.row, props.column)}
        disabled={champ.locked}
      >
        <strong>{champ.champion.name}</strong>
        <EarnedStats>
        {Object.entries(champ.champion.earnedStats)
          .map(([s, val]) => [enumFromKey(Stat, s)!, val] as [Stat, number])
          .map(([s, val]) => 
            <EarnedStat key={s} data-tip={`On Defeat ${val > 0 ? 'Gain' : 'Lose'} ${statsConfig[s].label}`} data-place="bottom">
              <span>{val > 0 ? '+' : ''}{autoFormatNumber(val)}</span>
              <Icon icon={statsConfig[s].icon} size="xs" pixelated />
            </EarnedStat>
          )}
        </EarnedStats>
        {connections}
      </ChampionButtonStyled>
    }
    {isOpen &&
      <Tooltip ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
        <strong>{champ.champion.name}</strong>
        
        <FullStats>
        {Object.entries(champ.champion.stats)
          .map(([s, val]) => [enumFromKey(Stat, s)!, val] as [Stat, number])
          .map(([s, val]) => 
            <FullStat key={s}>
              <Icon icon={statsConfig[s].icon} size="xs" pixelated />
              <span>{autoFormatNumber(val)}</span>
            </FullStat>
          )}
        </FullStats>

        <FloatingArrow ref={arrowRef} context={context} fill="#444" />
      </Tooltip>
    }
  </ButtonContainer>;
}

export const nodeWidth = 140;
export const nodeHeight = 80;

const ButtonContainer = styled.div`
  position: relative;
`;

const ChampionButtonStyled = styled.button`
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

const EarnedStats = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
`;

const EarnedStat = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
`;

const Tooltip = styled.div`
  width: 160px;
  background-color: #444;
  border-radius: 3px;
  padding: 10px;
  font-family: Arial;
  color: #EEE;
  z-index: 10;
`;

const FullStats = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FullStat = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;