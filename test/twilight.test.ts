import { describe, expect, it } from "vitest";
import { helios } from "../src";

const LAT = 14.4297;
const LNG = 120.9367;

describe("Twilight", () => {
  it("returns valid civil twilight intervals", () => {
    const result =
      helios(LAT, LNG)
        .getTimes(
          new Date("2026-06-20")
        );

    expect(
      result.civilTwilight
        .morning.start
        .getTime()
    ).toBeLessThan(
      result.civilTwilight
        .morning.end
        .getTime()
    );

    expect(
      result.civilTwilight
        .evening.start
        .getTime()
    ).toBeLessThan(
      result.civilTwilight
        .evening.end
        .getTime()
    );
  });
});