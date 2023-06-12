import styled, { css } from 'styled-components';

type ProgressBarProps = {
  progress: number,
  color: string,
  hasBorder: boolean,  
  height?: number,
  flip?: boolean,
}

export function ProgressBar(props: ProgressBarProps) {
  const height = props.height ?? 10;

  return <Container height={height} hasBorder={props.hasBorder} flip={props.flip}>
    <Bar width={props.progress * 100} backgroundColor={props.color} />
  </Container>;
}

const Container = styled.div<{height: number, hasBorder: boolean, flip?: boolean}>`
  width: 100%;
  height: ${props => props.height}px;
  border: ${props => props.hasBorder ? "2px solid white" : "none"};

  ${props => props.flip && css`
    display: flex;
    flex-direction: row-reverse;
  `}
`;

const Bar = styled.div<{width: number, backgroundColor: string}>`
  width: ${props => props.width}%;
  height: 100%;
  background-color: ${props => props.backgroundColor};
`;