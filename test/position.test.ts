import { describe, expect, it } from "vitest";
import { helios } from "../src";

const LAT = 14.4297;
const LNG = 120.9367;

describe("Position", () => {
  const date =
    new Date("2026-06-20T12:00:00+08:00");

  it("returns finite altitude and azimuth", () => {
    const pos =
      helios(LAT, LNG).position(date);

    expect(
      Number.isFinite(pos.altitude)
    ).toBe(true);

    expect(
      Number.isFinite(pos.azimuth)
    ).toBe(true);
  });

  it("returns altitude within range", () => {
    const pos =
      helios(LAT, LNG).position(date);

    expect(pos.altitude)
      .toBeGreaterThanOrEqual(-90);

    expect(pos.altitude)
      .toBeLessThanOrEqual(90);
  });

  it("returns azimuth within range", () => {
    const pos =
      helios(LAT, LNG).position(date);

    expect(pos.azimuth)
      .toBeGreaterThanOrEqual(0);

    expect(pos.azimuth)
      .toBeLessThan(360);
  });
});