import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { helios } from "../../src"
import {
  latitudeArb,
  longitudeArb,
  dateArb,
  timezoneOffsetArb
} from "./generators.js"
import { asOffsetISOString } from "./helpers.js"

describe("property: timezone invariance", () => {
  it("same instant with different offsets must match", () => {
    fc.assert(
      fc.property(
        latitudeArb,
        longitudeArb,
        dateArb,
        timezoneOffsetArb,
        timezoneOffsetArb,
        (lat, lng, date, offset1, offset2) => {
          const sun = helios(lat, lng)

          const d1 =
            new Date(asOffsetISOString(date, offset1))

          const d2 =
            new Date(asOffsetISOString(date, offset2))

          const r1 = sun.at(d1)
          const r2 = sun.at(d2)

          expect(
            r1.sunrise?.getTime()
          ).toBe(
            r2.sunrise?.getTime()
          )

          expect(
            r1.sunset?.getTime()
          ).toBe(
            r2.sunset?.getTime()
          )
        }
      ),
      {
        numRuns: 10000
      }
    )
  })
})