export interface GetTimesOptions {
  lat: number;
  lng: number;
  date?: Date;
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;

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

  isDay: boolean;
  isNight: boolean;
}