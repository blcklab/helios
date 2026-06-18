export interface GetTimesOptions {
  lat: number;
  lng: number;
  date?: Date;
}

export interface SunTimes {
  /**
   * Sunrise time.
   */
  sunrise: Date;

  /**
   * Sunset time.
   */
  sunset: Date;

  /**
   * Solar noon.
   *
   * The moment when the Sun reaches
   * its highest point in the sky.
   */
  solarNoon: Date;

  /**
   * Total daylight duration
   * in milliseconds.
   */
  dayLength: number;

  /**
   * Daylight progression.
   *
   * Values:
   * < 0  = before sunrise
   * 0    = sunrise
   * 0.5  = solar noon
   * 1    = sunset
   * > 1  = after sunset
   */
  sunProgress: number;

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
   * True when the current moment
   * falls between sunrise and sunset.
   */
  isDay: boolean;

  /**
   * True when the current moment
   * falls outside daylight hours.
   */
  isNight: boolean;
}
