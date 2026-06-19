import type {
  GetTimesOptions,
  SunTimes,
  SunLight,
  SunPhase,
} from './types.js'

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
} from './core.js'

const RAD = Math.PI / 180

const J2000 = 2451545

/**
 * Civil twilight.
 *
 * Sun altitude = -6°
 */
const TWILIGHT_ANGLE =
  -6 * RAD

/**
 * Returns current sun position.
 */
function getPosition(
  date: Date,
  lat: number,
  lng: number
) {
  const lw =
    -lng * RAD

  const phi =
    lat * RAD

  const d =
    toJulian(date) -
    J2000

  const M =
    solarMeanAnomaly(d)

  const L =
    eclipticLongitude(M)

  const dec =
    declination(L)

  const ra =
    rightAscension(L)

  const H =
    siderealTime(
      d,
      lw
    ) - ra

  const h =
    altitude(
      H,
      phi,
      dec
    )

  const a =
    azimuth(
      H,
      phi,
      dec
    )

  return {
    altitude:
      h / RAD,

    azimuth:
      (
        a / RAD +
        180
      ) % 360,
  }
}

function getDirection(
  date: Date,
  lat: number,
  lng: number
) {
  const pos =
    getPosition(
      date,
      lat,
      lng
    )

  const altitude =
    pos.altitude *
    RAD

  const azimuth =
    pos.azimuth *
    RAD

  return {
    x:
      Math.cos(
        altitude
      ) *
      Math.sin(
        azimuth
      ),

    y:
      Math.sin(
        altitude
      ),

    z:
      Math.cos(
        altitude
      ) *
      Math.cos(
        azimuth
      ),
  }
}

function getLight(
  altitude: number
): SunLight {

  const colorTemperature =
    altitude <= 0
      ? 2000
      : 2000 +
        Math.max(
          0,
          Math.min(
            1,
            altitude / 90
          )
        ) *
        4500


  const rgb =
    kelvinToRGB(
      colorTemperature
    )


  if (
    altitude <= 0
  ) {
    return {
      intensity: 0,

      colorTemperature,

      rgb,
    }
  }


  const intensity =
    Math.pow(
      Math.sin(
        altitude * RAD
      ),
      0.5
    )


  return {
    intensity,

    colorTemperature,

    rgb,
  }
}


function kelvinToRGB(
  kelvin: number
) {
  const temp =
    kelvin / 100;

  let r;
  let g;
  let b;

  if (temp <= 66) {
    r = 255;

    g =
      99.4708025861 *
        Math.log(
          temp
        ) -
      161.1195681661;

    b =
      temp <= 19
        ? 0
        : 138.5177312231 *
            Math.log(
              temp - 10
            ) -
          305.0447927307;
  }
  else {
    r =
      329.698727446 *
      Math.pow(
        temp - 60,
        -0.1332047592
      );

    g =
      288.1221695283 *
      Math.pow(
        temp - 60,
        -0.0755148492
      );

    b = 255;
  }

  return {
    r:
      Math.max(
        0,
        Math.min(
          255,
          r
        )
      ) / 255,

    g:
      Math.max(
        0,
        Math.min(
          255,
          g
        )
      ) / 255,

    b:
      Math.max(
        0,
        Math.min(
          255,
          b
        )
      ) / 255,
  };
}

/**
 * Calculates solar events.
 */
export function getTimes(
  options: GetTimesOptions
): SunTimes {
  const date =
    options.date
      ? new Date(
          options.date
        )
      : new Date()

  date.setHours(
    0,
    0,
    0,
    0
  )

  const lat =
    options.lat * RAD

  const lng =
    options.lng * RAD

  const lw = -lng

  const d =
    toJulian(date) -
    J2000

  const n =
    Math.round(
      d -
        0.0009 -
        lw /
          (2 * Math.PI)
    )

  const ds =
    0.0009 +
    lw /
      (2 * Math.PI) +
    n

  const M =
    solarMeanAnomaly(ds)

  const L =
    eclipticLongitude(M)

  const dec =
    declination(L)

  const Jtransit =
    J2000 +
    ds +
    0.0053 *
      Math.sin(M) -
    0.0069 *
      Math.sin(
        2 * L
      )

  const solarNoon =
    fromJulian(
      Jtransit
    )

  const w =
    hourAngle(
      lat,
      dec
    )

  const Jrise =
    Jtransit -
    w /
      (2 * Math.PI)

  const Jset =
    Jtransit +
    w /
      (2 * Math.PI)

  const sunrise =
    fromJulian(
      Jrise
    )

  const sunset =
    fromJulian(
      Jset
    )

  /**
   * Dawn / dusk.
   */
  const wTwilight =
    hourAngleByAltitude(
      lat,
      dec,
      TWILIGHT_ANGLE
    )

  const dawn =
    fromJulian(
      Jtransit -
        wTwilight /
          (2 *
            Math.PI)
    )

  const dusk =
    fromJulian(
      Jtransit +
        wTwilight /
          (2 *
            Math.PI)
    )

  const dayLength =
    sunset.getTime() -
    sunrise.getTime()

  const now =
    options.date
      ? new Date(
          options.date
        )
      : new Date()

  const position =
    getPosition(
      now,
      options.lat,
      options.lng
    )

    const direction =
  getDirection(
    now,
    options.lat,
    options.lng
  )

  const light =
  getLight(
    position.altitude
  )

  const startOfDay =
  new Date(now)

startOfDay.setHours(
  0,
  0,
  0,
  0
)

const dayProgress =
  (
    now.getTime() -
    startOfDay.getTime()
  ) /
  (
    24 *
    60 *
    60 *
    1000
  )

const sunProgress =
  Math.max(
    0,
    Math.min(
      1,
      dayProgress
    )
  )
    

  let phase: SunPhase

  if (
    now < dawn
  ) {
    phase = 'night'
  }
  else if (
    now < sunrise
  ) {
    phase = 'dawn'
  }
  else if (
    now < solarNoon
  ) {
    phase = 'morning'
  }
  else if (
    now < sunset
  ) {
    phase = 'day'
  }
  else if (
    now < dusk
  ) {
    phase = 'sunset'
  }
  else {
    phase = 'night'
  }

  return {
    dawn,

    sunrise,

    solarNoon,

    sunset,

    dusk,

    dayLength,

    sunProgress,

    phase,

    position,

    direction,

    light,

    goldenHour: {
      morning: {
        start: dawn,
        end: sunrise,
      },

      evening: {
        start: sunset,
        end: dusk,
      },
    },

    isDay:
      now >= sunrise &&
      now <= sunset,

    isNight:
      now < sunrise ||
      now > sunset,
  }
}

/**
 * Creates a reusable
 * location-bound calculator.
 */
export function helios(
  lat: number,
  lng: number
) {
  return {
    getTimes(
      date?: Date
    ) {
      return getTimes({
        lat,
        lng,
        date,
      })
    },

    at(
      date: Date
    ) {
      return getTimes({
        lat,
        lng,
        date,
      })
    },

    now() {
      return getTimes({
        lat,
        lng,
      })
    },

    position(
      date = new Date()
    ) {
      return getPosition(
        date,
        lat,
        lng
      )
    },
  }
}