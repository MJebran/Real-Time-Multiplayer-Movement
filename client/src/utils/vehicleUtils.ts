import PlayerVehicle from "../types/PlayerVehicle";

export const moveVehicle = (
  vehicle: PlayerVehicle,
  speed: number = 5,
  turningSpeed: number = 5
): PlayerVehicle => {
  if (
    !vehicle ||
    typeof vehicle.x !== "number" ||
    typeof vehicle.y !== "number"
  ) {
    throw new Error("Invalid vehicle object");
  }

  const radians = (vehicle.angle * Math.PI) / 180;

  let newX = vehicle.x;
  let newY = vehicle.y;
  let newAngle = vehicle.angle;

  // Prevent conflicting movement flags
  if (
    vehicle.movementFlags.movingForward &&
    vehicle.movementFlags.movingBackward
  ) {
    return vehicle;
  }

  // Calculate forward and backward movement and it keeps going
  if (vehicle.movementFlags.movingForward) {
    newX += Math.cos(radians) * speed;
    newY += Math.sin(radians) * speed;
  }
  if (vehicle.movementFlags.movingBackward) {
    newX -= Math.cos(radians) * speed;
    newY -= Math.sin(radians) * speed;
  }

  // Calculate turning and it keeps going
  if (vehicle.movementFlags.turningLeft) {
    newAngle -= turningSpeed;
  }
  if (vehicle.movementFlags.turningRight) {
    newAngle += turningSpeed;
  }
  newAngle = (newAngle + 360) % 360;
  return { ...vehicle, x: newX, y: newY, angle: newAngle };
};
