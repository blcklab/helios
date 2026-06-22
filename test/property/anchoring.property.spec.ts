import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { helios } from "../../src"
import {
  latitudeArb,
  longitudeArb,
  dateArb
} from "./generators.js"

describe("property: anchoring invariance", () => {
  it("same epoch must produce same result", () => {
    fc.assert(
      fc.property(
        latitudeArb,
        longitudeArb,
        dateArb,
        (lat, lng, date) => {
          const sun = helios(lat, lng)

          const a = sun.at(date)
          const b = sun.at(new Date(date.getTime()))

          expect(
            a.sunrise?.getTime()
          ).toBe(
            b.sunrise?.getTime()
          )

          expect(
            a.sunset?.getTime()
          ).toBe(
            b.sunset?.getTime()
          )
        }
      ),
      {
        numRuns: 5000
      }
    )
  })
})