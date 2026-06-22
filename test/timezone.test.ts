import { describe, expect, it } from "vitest";
import { helios } from "../src";

describe("Timezone regressions", () => {
  it("returns same position for the same instant", () => {
    const sun = helios(14.5995, 120.9842);

    const a = sun.at(
      new Date("2026-06-22T06:00:00+08:00")
    );

    const b = sun.at(
      new Date("2026-06-21T22:00:00Z")
    );

    expect(a.position.altitude).toBeCloseTo(
      b.position.altitude,
      8
    );

    expect(a.position.azimuth).toBeCloseTo(
      b.position.azimuth,
      8
    );
  });

  it("calculates sunrise before sunset", () => {
    const sun = helios(14.5995, 120.9842);

    const result = sun.at(
      new Date("2026-06-22T12:00:00+08:00")
    );

    expect(result.sunrise).not.toBeNull();
    expect(result.sunset).not.toBeNull();

    if (result.sunrise && result.sunset) {
      expect(
        result.sunrise.getTime()
      ).toBeLessThan(
        result.sunset.getTime()
      );
    }
  });


  it("returns same sunrise for same local day", () => {
    const tokyo = helios(
      35.6762,
      139.6503
    );

    const early = tokyo.at(
      new Date(
        "2026-06-23T01:00:00+09:00"
      )
    );

    const noon = tokyo.at(
      new Date(
        "2026-06-23T12:00:00+09:00"
      )
    );

    expect(
      early.sunrise?.toISOString()
    ).toBe(
      noon.sunrise?.toISOString()
    );
  });

  it("does not change sunrise for identical UTC timestamps", () => {
    const tokyo = helios(
      35.6762,
      139.6503
    );

    const input =
      new Date(
        "2026-06-23T12:00:00Z"
      );

    const result1 =
      tokyo.at(input);

    const result2 =
      tokyo.at(
        new Date(
          Date.parse(
            "2026-06-23T12:00:00Z"
          )
        )
      );

    expect(
      result1.sunrise?.getTime()
    ).toBe(
      result2.sunrise?.getTime()
    );
  });



  it("returns valid positions for different world locations", () => {
    const cities = [
      helios(14.5995, 120.9842),
      helios(34.0522, -118.2437),
      helios(64.1466, -21.9426),
    ];

    for (const sun of cities) {
      const result = sun.now();

      expect(
        result.position.altitude
      ).toBeGreaterThanOrEqual(-90);

      expect(
        result.position.altitude
      ).toBeLessThanOrEqual(90);

      expect(
        result.position.azimuth
      ).toBeGreaterThanOrEqual(0);

      expect(
        result.position.azimuth
      ).toBeLessThan(360);
    }
  });
});
