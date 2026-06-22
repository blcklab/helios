import type { TimeMode } from "../types.js"

export function anchor(date: Date, mode: TimeMode): Date {
  const d = new Date(date)

  if (mode === "raw") {
    return d
  }

  if (mode === "utc") {
    d.setUTCHours(0, 0, 0, 0)
    return d
  }

  d.setHours(0, 0, 0, 0)
  return d
}