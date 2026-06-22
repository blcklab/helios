import type { TimeMode } from "../types.js"

export function anchor(date: Date, mode: TimeMode): Date {
  const d = new Date(date)

  if (mode === "local") {
    d.setHours(0, 0, 0, 0)
    return d
  }

  if (mode === "utc") {
    d.setUTCHours(0, 0, 0, 0)
    return d
  }

  return d
}