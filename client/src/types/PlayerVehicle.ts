export default interface PlayerVehicle {
  id: number;
  state: string;
  x: number;
  y: number;
  angle: number;
  movementFlags: {
    turningLeft: boolean;
    turningRight: boolean;
    movingForward: boolean;
    movingBackward: boolean;
  };
}
