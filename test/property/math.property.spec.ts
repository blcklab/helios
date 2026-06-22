import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { helios } from "../../src"
import {
  latitudeArb,
  longitudeArb,
  dateArb
} from "./generators.js"

describe("property: math invariants", () => {
  it("must obey physical constraints", () => {
    fc.assert(
      fc.property(
        latitudeArb,
        longitudeArb,
        dateArb,
        (lat, lng, date) => {
          const result =
            helios(lat, lng).at(date)

          expect(
            result.position.altitude
          ).toBeGreaterThanOrEqual(-90)

          expect(
            result.position.altitude
          ).toBeLessThanOrEqual(90)

          expect(
            result.position.azimuth
          ).toBeGreaterThanOrEqual(0)

          expect(
            result.position.azimuth
          ).toBeLessThan(360)

          expect(
            result.light.intensity
          ).toBeGreaterThanOrEqual(0)

          expect(
            result.light.intensity
          ).toBeLessThanOrEqual(1)
        }
      ),
      {
        numRuns: 10000
      }
    )
  })
})