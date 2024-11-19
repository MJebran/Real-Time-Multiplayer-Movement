import PlayerVehicle from "../types/PlayerVehicle";

export const moveVehicle = (vehicle: PlayerVehicle): PlayerVehicle => {
  const speed = 5;
  const turningSpeed = 5;
  const radians = (vehicle.angle * Math.PI) / 180;

  let newX = vehicle.x;
  let newY = vehicle.y;
  let newAngle = vehicle.angle;

  if (vehicle.movementFlags.movingForward) {
    newX += Math.cos(radians) * speed;
    newY += Math.sin(radians) * speed;
  }
  if (vehicle.movementFlags.movingBackward) {
    newX -= Math.cos(radians) * speed;
    newY -= Math.sin(radians) * speed;
  }
  if (vehicle.movementFlags.turningLeft) {
    newAngle -= turningSpeed;
  }
  if (vehicle.movementFlags.turningRight) {
    newAngle += turningSpeed;
  }

  return { ...vehicle, x: newX, y: newY, angle: newAngle };
};


