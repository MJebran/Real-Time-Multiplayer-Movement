import React, { createContext, useContext, useEffect, useState } from "react";
import PlayerVehicle from "../types/PlayerVehicle";
import { moveVehicle } from "../utils/vehicleUtils";

type MovementAction =
  | "turningLeft"
  | "turningRight"
  | "movingForward"
  | "movingBackward";

interface GameServerContextType {
  vehicles: PlayerVehicle[];
  updateVehicle: (id: number, action: MovementAction) => void;
  registerVehicle: (vehicle: PlayerVehicle) => void;
}

const GameServerContext = createContext<GameServerContextType | null>(null);

export const GameServerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [vehicles, setVehicles] = useState<PlayerVehicle[]>([]);

  // Update movement flags for a specific vehicle
  const updateVehicle = (id: number, action: MovementAction) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.id === id
          ? {
              ...vehicle,
              movementFlags: {
                ...vehicle.movementFlags,
                [action]: !vehicle.movementFlags[action],
              },
            }
          : vehicle
      )
    );
  };

  // Register a new vehicle if it doesn't exist
  const registerVehicle = (vehicle: PlayerVehicle) => {
    setVehicles((prevVehicles) => {
      if (prevVehicles.some((v) => v.id === vehicle.id)) return prevVehicles;
      return [...prevVehicles, vehicle];
    });
  };

  // Infinite game loop to calculate vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => moveVehicle(vehicle))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameServerContext.Provider
      value={{ vehicles, updateVehicle, registerVehicle }}
    >
      {children}
    </GameServerContext.Provider>
  );
};

export const useGameServer = () => {
  const context = useContext(GameServerContext);
  if (!context) {
    throw new Error("useGameServer must be used within a GameServerProvider");
  }
  return context;
};