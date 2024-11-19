import React from 'react';
import { GameServerProvider } from '../src/context/GameServerContext';
import Vehicle from '../src/Components/Vehicle';
import PlayerControls from '../src/Components/playerControls';
import { useGameServer } from '../src/context/GameServerContext';

const Game = () => {
  const { vehicles } = useGameServer();
  return (
    <>
      {vehicles.map((vehicle) => (
        <Vehicle key={vehicle.id} vehicle={vehicle} />
      ))}
    </>
  );
};

const App: React.FC = () => {
  return (
    <GameServerProvider>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#282c34",
          position: "relative",
        }}
      >
        <Game />
        <PlayerControls
          vehicleId={1}
          controls={{ up: "w", down: "s", left: "a", right: "d" }}
        />
        <PlayerControls
          vehicleId={2}
          controls={{
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
          }}
        />
      </div>
    </GameServerProvider>
  );
};

export default App;