import { describe, expect, it } from "vitest";
import { helios } from "../src";

const LAT = 14.4297;
const LNG = 120.9367;

describe("Solar calculations", () => {
  const date =
    new Date("2026-06-20T12:00:00+08:00");

  it("sunrise occurs before sunset", () => {
    const result =
      helios(LAT, LNG).getTimes(date);

    expect(
      result.sunrise.getTime()
    ).toBeLessThan(
      result.sunset.getTime()
    );
  });

  it("solar noon occurs between sunrise and sunset", () => {
    const result =
      helios(LAT, LNG).getTimes(date);

    expect(
      result.solarNoon.getTime()
    ).toBeGreaterThan(
      result.sunrise.getTime()
    );

    expect(
      result.solarNoon.getTime()
    ).toBeLessThan(
      result.sunset.getTime()
    );
  });

  it("returns positive day length", () => {
    expect(
      helios(LAT, LNG)
        .getTimes(date)
        .dayLength
    ).toBeGreaterThan(0);
  });

  it("returns valid phase", () => {
    const phase =
      helios(LAT, LNG)
        .getTimes(date)
        .phase;

    expect([
      "night",
      "dawn",
      "morning",
      "day",
      "sunset",
    ]).toContain(phase);
  });

  it("isDay and isNight are opposites", () => {
    const result =
      helios(LAT, LNG).getTimes(date);

    expect(result.isDay)
      .toBe(!result.isNight);
  });
});