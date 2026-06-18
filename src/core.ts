const RAD = Math.PI / 180;

const J1970 = 2440588;
const J2000 = 2451545;

/**
 * @param date UTC date and time
 * @returns Julian Day Number (JD)
 */
export function toJulian(date: Date): number {
  return date.getTime() / 86400000 - 0.5 + J1970;
}

/**
 * @param j Julian Day Number (JD)
 * @returns JavaScript Date instance
 */
export function fromJulian(j: number): Date {
  return new Date((j + 0.5 - J1970) * 86400000);
}


/**
 * @param d Days since J2000 epoch
 * @returns Mean anomaly (radians)
 */
export function solarMeanAnomaly(d: number): number {
  return RAD * (357.5291 + 0.98560028 * d);
}

/**
 * Orbital eccentricity correction.
 *
 * @param M Solar mean anomaly (radians)
 * @returns Correction angle (radians)
 */
export function equationOfCenter(M: number): number {
  return RAD * (
    1.9148 * Math.sin(M) +
    0.02 * Math.sin(2 * M) +
    0.0003 * Math.sin(3 * M)
  );
}

/**
 * @param M Solar mean anomaly (radians)
 * @returns Ecliptic longitude (radians)
 */
export function eclipticLongitude(M: number): number {
  const C = equationOfCenter(M);
  return M + C + RAD * 102.9372 + Math.PI;
}

/**
 * @param L Ecliptic longitude (radians)
 * @returns Solar declination (radians)
 */
export function declination(L: number): number {
  return Math.asin(
    Math.sin(L) * Math.sin(RAD * 23.4397)
  );
}

/**
 * Uses apparent horizon correction (-0.833°)
 * for atmospheric refraction and solar radius.
 *
 * @param lat Observer latitude (radians)
 * @param dec Solar declination (radians)
 * @returns Hour angle (radians)
 */
export function hourAngle(lat: number, dec: number): number {
  const h = -0.833 * RAD;

  return Math.acos(
    (Math.sin(h) - Math.sin(lat) * Math.sin(dec)) /
    (Math.cos(lat) * Math.cos(dec))
  );
}

/**
 * Supports twilight and custom altitude calculations.
 *
 * @param lat Observer latitude (radians)
 * @param dec Solar declination (radians)
 * @param alt Target altitude (radians)
 * @returns Hour angle (radians)
 */
export function hourAngleByAltitude(lat: number, dec: number, alt: number): number {
  return Math.acos(
    (Math.sin(alt) - Math.sin(lat) * Math.sin(dec)) /
    (Math.cos(lat) * Math.cos(dec))
  );
}