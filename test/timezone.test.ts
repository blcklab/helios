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

  it("keeps sunrise stable within a local day", () => {
    const tokyo = helios(
      35.6762,
      139.6503
    );

    const times = [
      "2026-06-23T00:00:00",
      "2026-06-23T06:00:00",
      "2026-06-23T12:00:00",
      "2026-06-23T18:00:00",
    ].map((t) =>
      tokyo.at(new Date(t))
    );

    const expected =
      times[0].sunrise?.getTime();

    for (const result of times) {
      expect(
        result.sunrise?.getTime()
      ).toBe(expected);
    }
  });

  it("keeps sunrise stable across time slider movement", () => {
    const tokyo = helios(
      35.6762,
      139.6503
    );

    const base =
      new Date("2026-06-23T00:00:00");

    const t1 = tokyo.at(
      new Date(
        base.getTime() +
          1 * 60 * 60 * 1000
      )
    );

    const t2 = tokyo.at(
      new Date(
        base.getTime() +
          12 * 60 * 60 * 1000
      )
    );

    const t3 = tokyo.at(
      new Date(
        base.getTime() +
          23 * 60 * 60 * 1000
      )
    );

    expect(
      t1.sunrise?.getTime()
    ).toBe(
      t2.sunrise?.getTime()
    );

    expect(
      t2.sunrise?.getTime()
    ).toBe(
      t3.sunrise?.getTime()
    );
  });

  it("returns same sunrise for same local day", () => {
    const tokyo = helios(
      35.6762,
      139.6503
    );

    const early = tokyo.raw(
      new Date(
        "2026-06-23T01:00:00+09:00"
      )
    );

    const noon = tokyo.raw(
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

  it("changes sunrise after crossing local midnight", () => {
    const tokyo = helios(
      35.6762,
      139.6503
    );

    const before =
      tokyo.at(
        new Date(
          "2026-06-23T23:59:59"
        )
      );

    const after =
      tokyo.at(
        new Date(
          "2026-06-24T00:00:01"
        )
      );

    expect(
      before.sunrise?.getTime()
    ).not.toBe(
      after.sunrise?.getTime()
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
