import React, { createContext, useContext, useEffect, useState } from "react";
import PlayerVehicle from "../types/PlayerVehicle";

interface GameClientContextType {
  vehicles: PlayerVehicle[];
  sendVehicleUpdate: (id: number, action: string) => void;
  registerVehicle: (vehicle: PlayerVehicle) => void;
}

const GameClientContext = createContext<GameClientContextType | null>(null);

export const GameClientProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [vehicles, setVehicles] = useState<PlayerVehicle[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5249/ws");
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "gameState") {
        setVehicles(message.vehicles || []);
      }
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, []);

  const sendVehicleUpdate = (id: number, action: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type: "updateVehicle", id, action });
      socket.send(message);
    }
  };

  const registerVehicle = (vehicle: PlayerVehicle) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type: "registerVehicle", vehicle });
      socket.send(message);
    }
  };

  return (
    <GameClientContext.Provider
      value={{ vehicles, sendVehicleUpdate, registerVehicle }}
    >
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