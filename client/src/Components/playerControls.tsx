import React, { useEffect } from "react";
import { useGameServer } from "../context/GameServerContext";

const PlayerControls: React.FC<{
  vehicleId: number;
  controls: { up: string; down: string; left: string; right: string };
}> = ({ vehicleId, controls }) => {
  const { updateVehicle, registerVehicle } = useGameServer();

  useEffect(() => {
    registerVehicle({
      id: vehicleId,
      state: "idle",
      x: Math.random() * 500,
      y: Math.random() * 500,
      angle: 0,
      movementFlags: {
        turningLeft: false,
        turningRight: false,
        movingForward: false,
        movingBackward: false,
      },
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case controls.up:
          updateVehicle(vehicleId, "movingForward");
          break;
        case controls.down:
          updateVehicle(vehicleId, "movingBackward");
          break;
        case controls.left:
          updateVehicle(vehicleId, "turningLeft");
          break;
        case controls.right:
          updateVehicle(vehicleId, "turningRight");
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case controls.up:
          updateVehicle(vehicleId, "movingForward");
          break;
        case controls.down:
          updateVehicle(vehicleId, "movingBackward");
          break;
        case controls.left:
          updateVehicle(vehicleId, "turningLeft");
          break;
        case controls.right:
          updateVehicle(vehicleId, "turningRight");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [vehicleId, controls, registerVehicle, updateVehicle]);

  return null;
};

export default PlayerControls;