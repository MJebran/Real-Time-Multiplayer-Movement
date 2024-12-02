import { moveVehicle } from "../utils/vehicleUtils";
import { test, expect } from "vitest";
import PlayerVehicle from "../types/PlayerVehicle";

// Base vehicle template
const createBaseVehicle = (
  angle: number,
  movementFlags: Partial<PlayerVehicle["movementFlags"]>
): PlayerVehicle => ({
  id: 1,
  state: "alive",
  x: 0,
  y: 0,
  angle,
  movementFlags: {
    turningLeft: false,
    turningRight: false,
    movingForward: false,
    movingBackward: false,
    ...movementFlags,
  },
});

// I learned that this better way of testing because it isolates the functoinality
test("user can turn left", () => {
  const vehicle = createBaseVehicle(0, { turningLeft: true });
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.angle).toBeLessThan(vehicle.angle);
});

test("user can turn right", () => {
  const vehicle = createBaseVehicle(0, { turningRight: true });
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.angle).toBeGreaterThan(vehicle.angle);
});

test("user does not turn if no flags are set", () => {
  const vehicle = createBaseVehicle(0, {});
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.angle).toBe(vehicle.angle);
});

test("user can accelerate directly on the x-axis", () => {
  const vehicle = createBaseVehicle(0, { movingForward: true });
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.x).toBeGreaterThan(vehicle.x);
  expect(updatedVehicle.y).toBe(vehicle.y);
});

test("user can accelerate directly on the y-axis", () => {
  const vehicle = createBaseVehicle(90, { movingForward: true });
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.y).toBeGreaterThan(vehicle.y);
  expect(updatedVehicle.x).toBeCloseTo(vehicle.x, 5);
});

test("user can move on a 45-degree angle", () => {
  const vehicle = createBaseVehicle(45, { movingForward: true });
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.x).toBeGreaterThan(vehicle.x);
  expect(updatedVehicle.y).toBeGreaterThan(vehicle.y);
});

test("user can move on a 225-degree angle", () => {
  const vehicle = createBaseVehicle(225, { movingForward: true });
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.x).toBeLessThan(vehicle.x);
  expect(updatedVehicle.y).toBeLessThan(vehicle.y);
});

test("user can move on a -45-degree angle", () => {
  const vehicle = createBaseVehicle(-45, { movingForward: true });
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.x).toBeGreaterThan(vehicle.x);
  expect(updatedVehicle.y).toBeLessThan(vehicle.y);
});

test("user can move on a -225-degree angle", () => {
  const vehicle = createBaseVehicle(-225, { movingForward: true });
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.x).toBeLessThan(vehicle.x);
  expect(updatedVehicle.y).toBeGreaterThan(vehicle.y);
});

test("normalizes angle to 0-360 range", () => {
  const vehicle = createBaseVehicle(370, {});
  const updatedVehicle = moveVehicle(vehicle);
  expect(updatedVehicle.angle).toBe(10);
});