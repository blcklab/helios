export interface GetTimesOptions {
  lat: number;
  lng: number;
  date?: Date;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface SunLight {
  /**
   * 0 → 1
   */
  intensity: number;

  /**
   * Kelvin.
   *
   * 2000 = orange sunset
   * 6500 = white daylight
   */
  colorTemperature: number;

  rgb: RGBColor;
}

export interface SunDirection {
  /**
   * Coordinate system:
   *
   * X = East
   * Y = Up
   * Z = North
   */
  x: number;
  y: number;
  z: number;
}

export interface SunPosition {
  /**
   * Height above horizon.
   *
   * 0° = horizon
   * 90° = directly overhead
   */
  altitude: number;

  /**
   * Compass direction.
   *
   * 0°   = North
   * 90°  = East
   * 180° = South
   * 270° = West
   */
  azimuth: number;
}

export type TimeMode = "local" | "utc" | "raw"


export type SunPhase =
  | 'night'
  | 'dawn'
  | 'morning'
  | 'day'
  | 'sunset';

export interface SunTimes {
  /**
   * Civil dawn.
   *
   * Sun reaches -6° altitude.
   */
  dawn: Date | null;

  /**
   * Sunrise.
   */
  sunrise: Date | null;

  /**
   * Solar noon.
   *
   * Sun reaches highest point.
   */
  solarNoon: Date;

  /**
   * Sunset.
   */
  sunset: Date | null;

  /**
   * Civil dusk.
   *
   * Sun reaches -6° altitude.
   */
  dusk: Date | null;

  /**
   * Daylight duration.
   *
   * Milliseconds.
   *
   * May be 0 when sunrise/sunset
   * do not occur on the given date.
   */
  dayLength: number;

  /**
   * Current solar phase.
   */
  phase: SunPhase;

  /**
   * Current sun position.
   */
  position: SunPosition;

  /**
   * Sun direction vector.
   */
  direction: SunDirection;

  /**
   * Estimated sunlight properties.
   */
  light: SunLight;

  /**
   * Civil twilight periods.
   *
   * Morning:
   * -6° → sunrise
   *
   * Evening:
   * sunset → -6°
   *
   * May be null in polar regions.
   */
  civilTwilight: {
    morning: {
      start: Date | null;
      end: Date | null;
    };

    evening: {
      start: Date | null;
      end: Date | null;
    };
  };

  /**
   * Sun above horizon.
   */
  isDay: boolean;

  /**
   * Sun below horizon.
   */
  isNight: boolean;
}