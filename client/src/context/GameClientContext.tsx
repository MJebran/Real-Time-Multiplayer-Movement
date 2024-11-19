import React, { createContext, useContext, useEffect, useState } from "react";
import  PlayerVehicle  from "../types/PlayerVehicle";

interface GameClientContextType {
  vehicles: PlayerVehicle[];
}

const GameClientContext = createContext<GameClientContextType | null>(null);

export const GameClientProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [vehicles, setVehicles] = useState<PlayerVehicle[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/ws");

    ws.onmessage = (event) => {
      const gameState = JSON.parse(event.data);
      setVehicles(gameState.vehicles);
    };

    return () => ws.close();
  }, []);

  return (
    <GameClientContext.Provider value={{ vehicles }}>
      {children}
    </GameClientContext.Provider>
  );
};

export const useGameClient = () => {
  const context = useContext(GameClientContext);
  if (!context) {
    throw new Error("useGameClient must be used within a GameClientProvider");
  }
  return context;
};
