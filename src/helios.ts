import type { GetTimesOptions, SunTimes } from "./types.js";

import {
  toJulian,
  fromJulian,
  solarMeanAnomaly,
  eclipticLongitude,
  declination,
  hourAngle,
  hourAngleByAltitude,
} from "./core.js";

const RAD = Math.PI / 180;
const J2000 = 2451545;

// Golden hour threshold: Sun altitude of -6°.
const GOLDEN_ANGLE = -6 * RAD;

/**
 * Calculates solar events for a given location and date.
 *
 * @param options Observer coordinates and calculation date
 * @returns Sunrise, sunset, solar position, golden hour, and day/night state
 */
export function getTimes(options: GetTimesOptions): SunTimes {
  /**
   * Solar calculations should be based on the
   * calendar day, not the current hour.
   *
   * This prevents sunrise/sunset from drifting
   * depending on when the function is called.
   */
  const date = options.date ? new Date(options.date) : new Date();

  date.setHours(0, 0, 0, 0);

  const lat = options.lat * RAD;

  const lng = options.lng * RAD;

  /**
   * Longitude expressed as west-positive,
   * matching the astronomical formulas.
   */
  const lw = -lng;

  /**
   * Days elapsed since J2000 epoch.
   */
  const d = toJulian(date) - J2000;

  /**
   * Solar cycle number.
   *
   * Represents the nearest solar day and is
   * required for accurate transit calculations.
   */
  const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));

  /**
   * Approximate solar transit.
   */
  const ds = 0.0009 + lw / (2 * Math.PI) + n;

  const M = solarMeanAnomaly(ds);

  const L = eclipticLongitude(M);

  const dec = declination(L);

  /**
   * Solar transit calculation.
   *
   * Represents solar noon (the Sun's highest
   * point in the sky) corrected for orbital
   * eccentricity.
   */
  const Jtransit = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);

  /**
   * Solar noon.
   */
  const solarNoon = fromJulian(Jtransit);

  /**
   * Sunrise and sunset are calculated from the
   * solar hour angle around the transit time.
   */
  const w = hourAngle(lat, dec);

  const Jrise = Jtransit - w / (2 * Math.PI);

  const Jset = Jtransit + w / (2 * Math.PI);

  const sunrise = fromJulian(Jrise);

  const sunset = fromJulian(Jset);

  /**
   * Total daylight duration.
   *
   * Returned in milliseconds.
   */
  const dayLength = sunset.getTime() - sunrise.getTime();

  /**
   * Golden hour is based on solar altitude,
   * not a fixed time offset.
   */
  const wGolden = hourAngleByAltitude(lat, dec, GOLDEN_ANGLE);

  const goldenMorningStart = fromJulian(Jtransit - wGolden / (2 * Math.PI));

  const goldenEveningEnd = fromJulian(Jtransit + wGolden / (2 * Math.PI));

  /**
   * Current moment used to determine whether
   * it is presently day or night.
   */
  const now = options.date ?? new Date();

  /**
   * Daylight progression.
   *
   * sunrise = 0
   * solar noon = 0.5
   * sunset = 1
   *
   * Useful for animations:
   * sky, sun, clouds, shadows, etc.
   */
  const sunProgress =
    (now.getTime() - sunrise.getTime()) /
    (sunset.getTime() - sunrise.getTime());

  return {
    sunrise,

    sunset,

    solarNoon,

    dayLength,

    sunProgress,

    goldenHour: {
      morning: {
        start: goldenMorningStart,

        end: sunrise,
      },

      evening: {
        start: sunset,

        end: goldenEveningEnd,
      },
    },

    isDay: now >= sunrise && now <= sunset,

    isNight: now < sunrise || now > sunset,
  };
}

/**
 * Creates a reusable location-bound calculator.
 *
 * Avoids repeatedly passing coordinates when querying
 * multiple dates.
 */
export function helios(lat: number, lng: number) {
  return {
    getTimes(date?: Date) {
      return getTimes({
        lat,
        lng,
        date,
      });
    },

    at(date: Date) {
      return getTimes({
        lat,
        lng,
        date,
      });
    },

    now() {
      return getTimes({
        lat,
        lng,
      });
    },
  };
}
