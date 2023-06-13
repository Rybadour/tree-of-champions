import styled from "styled-components";

export enum ConnectionStatus {
  Unavailable,
  Unlocked,
  Completed,
  Queued,
}

export function ConnectionArrow(props: {status: ConnectionStatus, direction: string}) {
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
  ${p => p.status === ConnectionStatus.Queued && `stroke: #3d73ba;`}
  stroke-width: 3px;
`;