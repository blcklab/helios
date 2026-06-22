import { describe, expect, it } from "vitest";
import { helios } from "../src";

const LAT = 14.4297;
const LNG = 120.9367;

describe("Lighting", () => {
  const light =
    helios(LAT, LNG)
      .getTimes(
        new Date("2026-06-20T12:00:00+08:00")
      )
      .light;

  it("returns intensity between 0 and 1", () => {
    expect(light.intensity)
      .toBeGreaterThanOrEqual(0);

    expect(light.intensity)
      .toBeLessThanOrEqual(1);
  });

  it("returns rgb values between 0 and 1", () => {
    for (const value of Object.values(light.rgb)) {
      expect(value)
        .toBeGreaterThanOrEqual(0);

      expect(value)
        .toBeLessThanOrEqual(1);
    }
  });
});