import { describe, expect, it } from "vitest";
import { helios, getTimes } from "../src";

const LAT = 14.4297;
const LNG = 120.9367;

describe("API", () => {
  it("creates a calculator", () => {
    const sun = helios(LAT, LNG);

    expect(sun).toBeDefined();
    expect(typeof sun.getTimes).toBe("function");
    expect(typeof sun.position).toBe("function");
    expect(typeof sun.now).toBe("function");
    expect(typeof sun.at).toBe("function");
  });

  it("helper getTimes matches instance getTimes", () => {
    const date = new Date("2026-06-20");

    const a = helios(LAT, LNG).getTimes(date);
    const b = getTimes({
      lat: LAT,
      lng: LNG,
      date,
    });

    expect(a.sunrise.getTime()).toBe(
      b.sunrise.getTime()
    );

    expect(a.sunset.getTime()).toBe(
      b.sunset.getTime()
    );
  });

  it("returns deterministic results", () => {
    const date =
      new Date("2026-06-20T12:00:00+08:00");

    const a = helios(LAT, LNG).getTimes(date);
    const b = helios(LAT, LNG).getTimes(date);

    expect(a.sunrise.getTime())
      .toBe(b.sunrise.getTime());

    expect(a.sunset.getTime())
      .toBe(b.sunset.getTime());

    expect(a.solarNoon.getTime())
      .toBe(b.solarNoon.getTime());
  });
});