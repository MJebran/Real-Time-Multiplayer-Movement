import React from "react";
import PlayerVehicle from "../types/PlayerVehicle";
import { SvjRocketOneComponent } from "./svjRocketOneComponent";

const Vehicle: React.FC<{ vehicle: PlayerVehicle }> = ({ vehicle }) => {
  return (
    <div
      style={{
        position: "fixed",
        transform: `rotate(${vehicle.angle}deg)`,
        width: "50px",
        height: "50px",
        top: `${vehicle.y}px`,
        left: `${vehicle.x}px`,
      }}
    >
      <SvjRocketOneComponent />
    </div>
  );
};

export default Vehicle;
