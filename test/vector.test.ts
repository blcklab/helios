import { describe, expect, it } from "vitest";
import { helios } from "../src";

const LAT = 14.4297;
const LNG = 120.9367;

describe("Direction vector", () => {
  const dir =
    helios(LAT, LNG)
      .getTimes(
        new Date("2026-06-20T12:00:00+08:00")
      )
      .direction;

  it("returns finite values", () => {
    expect(Number.isFinite(dir.x)).toBe(true);
    expect(Number.isFinite(dir.y)).toBe(true);
    expect(Number.isFinite(dir.z)).toBe(true);
  });

  it("returns normalized vector", () => {
    const length = Math.hypot(
      dir.x,
      dir.y,
      dir.z
    );

    expect(length)
      .toBeCloseTo(1, 10);
  });
});