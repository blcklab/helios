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
  dawn: Date;

  /**
   * Sunrise.
   */
  sunrise: Date;

  /**
   * Solar noon.
   *
   * Sun reaches highest point.
   */
  solarNoon: Date;

  /**
   * Sunset.
   */
  sunset: Date;

  /**
   * Civil dusk.
   *
   * Sun reaches -6° altitude.
   */
  dusk: Date;

  /**
   * Daylight duration.
   *
   * Milliseconds.
   */
  dayLength: number;

  /**
   * Day progression.
   *
   * 0   = sunrise
   * 0.5 = solar noon
   * 1   = sunset
   */
  sunProgress: number;

  /**
   * Current solar phase.
   */
  phase: SunPhase;

  /**
   * Current sun position.
   */
  position: SunPosition;


  direction: SunDirection;

  light: SunLight;

  /**
   * Golden hour periods.
   */
  goldenHour: {
    morning: {
      start: Date;
      end: Date;
    };

    evening: {
      start: Date;
      end: Date;
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