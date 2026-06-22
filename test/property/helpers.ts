export function asOffsetISOString(
  date: Date,
  offsetHours: number
) {
  const ms = date.getTime()

  if (Number.isNaN(ms)) {
    throw new Error("Invalid date passed to helper")
  }

  const shifted =
    new Date(ms + offsetHours * 3600_000)

  const iso =
    shifted.toISOString().slice(0, -1)

  const sign = offsetHours >= 0 ? "+" : "-"
  const abs = Math.abs(offsetHours)
  const hh = String(abs).padStart(2, "0")

  return `${iso}${sign}${hh}:00`
}