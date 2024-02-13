import useStore from "../store"

export function FightQueue() {
  const player = useStore(s => s.player);

  return <div>
    <h2>Queue</h2>
    {player.nodeQueue.map((nodeId) => 
      <p>Meh</p>
    )}
  </div>;
}