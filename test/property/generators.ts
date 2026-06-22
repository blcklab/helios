import fc from "fast-check"

export const latitudeArb = fc.double({
  min: -89.9,
  max: 89.9,
  noNaN: true,
  noInfinity: true,
})

export const longitudeArb = fc.double({
  min: -180,
  max: 180,
  noNaN: true,
  noInfinity: true,
})

// Generate safe epoch milliseconds instead of fc.date()
export const dateArb = fc
  .integer({
    min: Date.UTC(2020, 0, 1),      // 2020-01-01T00:00:00Z
    max: Date.UTC(2035, 11, 31),    // 2035-12-31T00:00:00Z
  })
  .map(ms => new Date(ms))

export const timezoneOffsetArb = fc.integer({
  min: -12,
  max: 14,
})