import { useEffect } from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import statusConfig from "../config/statuses";
import { ProgressCircle } from "../shared/components/circle-progress-bar";
import Icon from "../shared/components/icon";
import { ProgressBar } from "../shared/components/progress-bar";
import { Fighter } from "../shared/types";
import { formatNumber } from "../shared/utils";
import useStore from "../store";

export default function Fight() {
  const player = useStore(s => s.player);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [player]);

  if (!player.championFighter) {
    return <BeforeFight>
      <strong>Select a Champion to Fight</strong>
    </BeforeFight>;
  }

  return <ActiveFight>
    <FighterStats fighter={player.fighter} />
    <VSContainer>
      <VSLabel>VS</VSLabel>
    </VSContainer>
    <FighterStats fighter={player.championFighter?.fighter} flip={true} />
  </ActiveFight>;
}


function FighterStats(props: {fighter: Fighter, flip?: boolean}) {
  const attackTime = 1 / (props.fighter.baseStats.AttackSpeed ?? 0);
  return <FighterStatsStyled align={props.flip ? "flex-end" : "flex-start"}>
    <h2>{props.fighter.name}</h2>

    {/* *
    <Sprite
      spriteSheet={props.fighter.spriteSheet}
      spriteSize={props.fighter.spriteSize}
      row={props.fighter.attackAnimationRow}
      flip={props.flip}
      animationLength={Math.floor(attackTime * 1000)}
    ></Sprite>
    /* */}

    <ProgressCircle
      progress={props.fighter.attackCooldown / attackTime}
      hasBorder={false}
      color="white"
      radius={20}
    />
    <HealthAndStatus flip={props.flip}>
      <div>{formatNumber(props.fighter.health, 0, 0)}/{formatNumber(props.fighter.baseStats.Health ?? 0, 0, 0)}</div>
      <Statuses>
      {Object.values(props.fighter.statusEffects)
        .filter(e => e)
        .map(e => 
          <Status key={e.status} data-tip={statusConfig[e.status].label}>
            <span>{formatNumber(e.strength, 0, 0)}</span>
            <Icon icon={statusConfig[e.status].icon} size="xs" />
          </Status>
      )}
      </Statuses>
    </HealthAndStatus>
    <ProgressBar
      progress={props.fighter.health / (props.fighter.baseStats.Health ?? 1)}
      hasBorder={true}
      color={"red"}
      height={20}
      flip={props.flip}
    />
  </FighterStatsStyled>;
}

const expectedHeight = 160;
const BeforeFight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${expectedHeight}px;
`;

const ActiveFight = styled.div`
  min-height: ${expectedHeight}px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
`;

const FighterStatsStyled = styled.div<{align: string}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align};
  gap: 4px;
  width: 300px;
`;

const VSContainer = styled.div`
  display: flex;
  align-items: center;
`;

const VSLabel = styled.p`
  font-size: 20px;
  color: #888;
`;

const HealthAndStatus = styled.div<{flip?: boolean}>`
  display: flex;
  flex-direction: ${props => props.flip ? 'row-reverse' : 'row'};
  justify-content: space-between;
  width: 100%;
`;

const Statuses = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Status = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
`;

const animStart = -8;
const numFrames = 4;
const Sprite = styled.div<{
  spriteSheet: string,
  spriteSize: number,
  row: number,
  flip?: boolean,
  animationLength: number
}>`
  position: absolute;
  ${p => p.flip ? 'left: 30px;' : 'right: 30px;'}
  top: 60px;
  background-image: url(${p => p.spriteSheet});
  width: ${p => p.spriteSize}px;
  height: ${p => p.spriteSize}px;
  transform: scaleX(${p => p.flip ? -3 : 3}) scaleY(3);
  image-rendering: pixelated;
  animation: idle ${p => p.animationLength}ms steps(4) infinite;

  @keyframes idle {
    from { background-position: ${p => animStart * p.spriteSize}px ${p => p.spriteSize * -p.row}px }
    to { background-position: ${p => animStart * p.spriteSize - (p.spriteSize * numFrames)}px ${p => p.spriteSize * -p.row}px }
  }
`;