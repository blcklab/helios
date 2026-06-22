import type {
  GetTimesOptions,
  SunTimes,
  SunLight,
  SunPhase,
  SunPosition,
  SunDirection,
  RGBColor,
  TimeMode,
} from "./types.js";

import {
  toJulian,
  fromJulian,
  solarMeanAnomaly,
  eclipticLongitude,
  declination,
  rightAscension,
  siderealTime,
  azimuth,
  altitude,
  hourAngle,
  hourAngleByAltitude,
} from "./core.js";

import { anchor } from "./utils/time.js";

const RAD = Math.PI / 180;

const J2000 = 2451545;

const TAU = 2 * Math.PI;

/**
 * Civil twilight.
 *
 * Sun altitude = -6°
 */
const TWILIGHT_ANGLE = -6 * RAD;

/**
 * Returns current sun position.
 */
function getPosition(date: Date, lat: number, lng: number): SunPosition {
  const lw = -lng * RAD;

  const phi = lat * RAD;

  const d = toJulian(date) - J2000;

  const M = solarMeanAnomaly(d);

  const L = eclipticLongitude(M);

  const dec = declination(L);

  const ra = rightAscension(L);

  const H = siderealTime(d, lw) - ra;

  const h = altitude(H, phi, dec);

  const a = azimuth(H, phi, dec);

  return {
    altitude: h / RAD,

    azimuth: (a / RAD + 180) % 360,
  };
}

function getDirection(position: SunPosition): SunDirection {
  const altitude = position.altitude * RAD;

  const azimuth = position.azimuth * RAD;

  return {
    x: Math.cos(altitude) * Math.sin(azimuth),

    y: Math.sin(altitude),

    z: Math.cos(altitude) * Math.cos(azimuth),
  };
}

function getLight(altitude: number): SunLight {
  const colorTemperature =
    altitude <= 0
      ? 2000
      : 2000 + Math.max(0, Math.min(1, altitude / 90)) * 4500;

  const rgb = kelvinToRGB(colorTemperature);

  if (altitude <= 0) {
    return {
      intensity: 0,

      colorTemperature,

      rgb,
    };
  }

  const intensity = Math.pow(Math.max(0, Math.sin(altitude * RAD)), 0.5);

  return {
    intensity,

    colorTemperature,

    rgb,
  };
}

function kelvinToRGB(kelvin: number): RGBColor {
  const temp = kelvin / 100;

  let r;
  let g;
  let b;

  if (temp <= 66) {
    r = 255;

    g = 99.4708025861 * Math.log(temp) - 161.1195681661;

    b = temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);

    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);

    b = 255;
  }

  return {
    r: Math.max(0, Math.min(255, r)) / 255,

    g: Math.max(0, Math.min(255, g)) / 255,

    b: Math.max(0, Math.min(255, b)) / 255,
  };
}


/**
 * Calculates solar events.
 */
export function getTimes(options: GetTimesOptions & {
  mode?: TimeMode
}): SunTimes {

  const mode = options.mode ?? "local";

  const base = new Date(options.date ?? Date.now())

  const input = anchor(base, mode)

  const lat = options.lat * RAD;

  const lng = options.lng * RAD;

  const lw = -lng;

  const d = toJulian(input) - J2000;

  const n = Math.round(d - 0.0009 - lw / TAU);

  const ds = 0.0009 + lw / TAU + n;

  const M = solarMeanAnomaly(ds);

  const L = eclipticLongitude(M);

  const dec = declination(L);

  const Jtransit = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);

  const solarNoon = fromJulian(Jtransit);

  const w = hourAngle(lat, dec);

  const sunrise = w === null ? null : fromJulian(Jtransit - w / TAU);

  const sunset = w === null ? null : fromJulian(Jtransit + w / TAU);

  /**
   * Dawn / dusk.
   */
  const wTwilight = hourAngleByAltitude(lat, dec, TWILIGHT_ANGLE);

  const dawn =
    wTwilight === null ? null : fromJulian(Jtransit - wTwilight / TAU);

  const dusk =
    wTwilight === null ? null : fromJulian(Jtransit + wTwilight / TAU);

  

  const position = getPosition(input, options.lat, options.lng);

  const direction = getDirection(position);

  const light = getLight(position.altitude);

  
  const hasSunEvents = sunrise !== null && sunset !== null;

  const dayLength =
    hasSunEvents ? sunset.getTime() - sunrise.getTime() : 0;

const isDay = hasSunEvents
  ? input >= sunrise && input <= sunset
  : position.altitude > 0;

  const isNight = !isDay;

  let phase: SunPhase;

  if (!sunrise || !sunset || !dawn || !dusk) {
    phase = position.altitude > 0 ? "day" : "night";
  } else if (input < dawn) {
    phase = "night";
  } else if (input < sunrise) {
    phase = "dawn";
  } else if (input < solarNoon) {
    phase = "morning";
  } else if (input < sunset) {
    phase = "day";
  } else if (input < dusk) {
    phase = "sunset";
  } else {
    phase = "night";
  }

  return {
    dawn,

    sunrise,

    solarNoon,

    sunset,

    dusk,

    dayLength,

    phase,

    position,

    direction,

    light,

    civilTwilight: {
      morning: {
        start: dawn,
        end: sunrise,
      },

      evening: {
        start: sunset,
        end: dusk,
      },
    },

    isDay,

    isNight,
  };
}

export function helios(lat: number, lng: number) {
  const times = (mode?: TimeMode) =>
    (date?: Date) =>
      getTimes({ lat, lng, date, mode });

  const local = times("local");

  return {
    getTimes: times(),

    local,
    utc: times("utc"),
    raw: times("raw"),

    at: local,
    now: () => local(),

    position(date = new Date()) {
      return getPosition(date, lat, lng);
    },
  };
}