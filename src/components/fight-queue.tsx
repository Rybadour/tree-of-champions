import useStore from "../store"

export function FightQueue() {
  const player = useStore(s => s.player);
  const champions = useStore(s => s.champions);

  return <div>
    <h2>Queue</h2>
    {player.fightQueue.map((col, row) => 
      <p>Meh</p>
    )}
  </div>;
}