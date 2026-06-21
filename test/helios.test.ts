import { describe, expect, it } from "vitest"
import { helios, getTimes } from "../src"

const LAT = 14.4297
const LNG = 120.9367

describe("Helios", () => {

    it("creates a calculator", () => {
        const sun = helios(LAT, LNG)

        expect(sun).toBeDefined()
        expect(typeof sun.getTimes).toBe("function")
        expect(typeof sun.position).toBe("function")
        expect(typeof sun.now).toBe("function")
        expect(typeof sun.at).toBe("function")
    })

    it("returns sunrise before sunset", () => {
        const date = new Date("2026-06-20T09:00:00+08:00")

        const result = helios(LAT, LNG).getTimes(date)

        expect(result.sunrise.getTime())
            .toBeLessThan(result.sunset.getTime())
    })

    it("returns solar noon between sunrise and sunset", () => {
        const date = new Date("2026-06-20T09:00:00+08:00")

        const result = helios(LAT, LNG).getTimes(date)

        expect(result.solarNoon.getTime())
            .toBeGreaterThan(result.sunrise.getTime())

        expect(result.solarNoon.getTime())
            .toBeLessThan(result.sunset.getTime())
    })

    it("returns a positive day length", () => {
        const result = helios(LAT, LNG)
            .getTimes(new Date("2026-06-20"))

        expect(result.dayLength)
            .toBeGreaterThan(0)
    })

    it("returns intensity between 0 and 1", () => {
        const result = helios(LAT, LNG)
            .getTimes(new Date("2026-06-20T12:00:00+08:00"))

        expect(result.light.intensity)
            .toBeGreaterThanOrEqual(0)

        expect(result.light.intensity)
            .toBeLessThanOrEqual(1)
    })

    it("returns RGB values between 0 and 1", () => {
        const rgb = helios(LAT, LNG)
            .getTimes(new Date("2026-06-20T12:00:00+08:00"))
            .light.rgb

        expect(rgb.r).toBeGreaterThanOrEqual(0)
        expect(rgb.r).toBeLessThanOrEqual(1)

        expect(rgb.g).toBeGreaterThanOrEqual(0)
        expect(rgb.g).toBeLessThanOrEqual(1)

        expect(rgb.b).toBeGreaterThanOrEqual(0)
        expect(rgb.b).toBeLessThanOrEqual(1)
    })

    it("returns a valid phase", () => {
        const result = helios(LAT, LNG)
            .getTimes(new Date())

        expect([
            "night",
            "dawn",
            "morning",
            "day",
            "sunset"
        ]).toContain(result.phase)
    })

    it("returns valid direction vector", () => {
        const dir = helios(LAT, LNG)
            .getTimes(new Date("2026-06-20T12:00:00+08:00"))
            .direction

        expect(Number.isFinite(dir.x)).toBe(true)
        expect(Number.isFinite(dir.y)).toBe(true)
        expect(Number.isFinite(dir.z)).toBe(true)
    })

    it("returns valid position", () => {
        const pos = helios(LAT, LNG)
            .position(new Date("2026-06-20T12:00:00+08:00"))

        expect(Number.isFinite(pos.altitude)).toBe(true)
        expect(Number.isFinite(pos.azimuth)).toBe(true)
    })

    it("getTimes() and helper return same sunrise", () => {
        const date = new Date("2026-06-20")

        const a = helios(LAT, LNG).getTimes(date)
        const b = getTimes({
            lat: LAT,
            lng: LNG,
            date
        })

        expect(a.sunrise.getTime())
            .toBe(b.sunrise.getTime())

        expect(a.sunset.getTime())
            .toBe(b.sunset.getTime())
    })

    it("isDay and isNight are never both true", () => {
        const result = helios(LAT, LNG)
            .getTimes(new Date())

        expect(
            result.isDay && result.isNight
        ).toBe(false)
    })

    it("golden hour exists", () => {
        const result = helios(LAT, LNG)
            .getTimes(new Date())

        expect(result.goldenHour.morning.start)
            .toBeInstanceOf(Date)

        expect(result.goldenHour.evening.end)
            .toBeInstanceOf(Date)
    })

})