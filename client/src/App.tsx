import React from "react";
import { GameServerProvider, useGameServer } from "../src/context/GameServerContext";
import Vehicle from "../src/Components/Vehicle";
import PlayerControls from "../src/Components/playerControls";

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
          position: "relative",
          background: "#282c34",
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
