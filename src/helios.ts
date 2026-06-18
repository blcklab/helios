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
const GOLDEN_ANGLE = -6 * RAD;

export function getTimes(options: GetTimesOptions): SunTimes {
  const date = options.date ?? new Date();

  const lat = options.lat * RAD;
  const lng = options.lng * RAD;
  const lw = -lng;

  const d = toJulian(date) - J2000;

  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);
  const dec = declination(L);

  // 🌞 solar noon
  const Jtransit =
    J2000 +
    d +
    lw / (2 * Math.PI) +
    0.0053 * Math.sin(M) -
    0.0069 * Math.sin(2 * L);

  // 🌅 sunrise / sunset
  const w = hourAngle(lat, dec);

  const sunrise = fromJulian(Jtransit - w / (2 * Math.PI));
  const sunset = fromJulian(Jtransit + w / (2 * Math.PI));

  // 🌟 golden hour (physics-based)
  const wGolden = hourAngleByAltitude(lat, dec, GOLDEN_ANGLE);

  const goldenMorningStart = fromJulian(
    Jtransit - wGolden / (2 * Math.PI)
  );

  const goldenEveningEnd = fromJulian(
    Jtransit + wGolden / (2 * Math.PI)
  );

  const now = date;

  return {
    sunrise,
    sunset,

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

export function helios(lat: number, lng: number) {
  return {
    getTimes(date?: Date) {
      return getTimes({ lat, lng, date });
    },

    at(date: Date) {
      return getTimes({ lat, lng, date });
    },

    now() {
      return getTimes({ lat, lng });
    },
  };
}