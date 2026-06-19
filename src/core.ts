export const RAD = Math.PI / 180;

export const J1970 = 2440588;

/**
 * Converts Date → Julian Date.
 */
export function toJulian(
  date: Date
) {
  return (
    date.getTime() /
      86400000 -
    0.5 +
    J1970
  );
}

/**
 * Converts Julian Date → Date.
 */
export function fromJulian(
  j: number
) {
  return new Date(
    (
      j +
      0.5 -
      J1970
    ) * 86400000
  );
}

/**
 * Solar mean anomaly.
 */
export function solarMeanAnomaly(
  d: number
) {
  return (
    RAD *
    (
      357.5291 +
      0.98560028 * d
    )
  );
}

/**
 * Equation of center.
 */
export function equationOfCenter(
  M: number
) {
  return (
    RAD *
    (
      1.9148 *
        Math.sin(M) +
      0.02 *
        Math.sin(
          2 * M
        ) +
      0.0003 *
        Math.sin(
          3 * M
        )
    )
  );
}

/**
 * Ecliptic longitude.
 */
export function eclipticLongitude(
  M: number
) {
  const C =
    equationOfCenter(M);

  return (
    M +
    C +
    RAD * 102.9372 +
    Math.PI
  );
}

/**
 * Solar declination.
 */
export function declination(
  L: number
) {
  return Math.asin(
    Math.sin(L) *
      Math.sin(
        RAD * 23.4397
      )
  );
}

/**
 * Right ascension.
 */
export function rightAscension(
  L: number
) {
  const e =
    RAD * 23.4397;

  return Math.atan2(
    Math.sin(L) *
      Math.cos(e),
    Math.cos(L)
  );
}

/**
 * Local sidereal time.
 */
export function siderealTime(
  d: number,
  lw: number
) {
  return (
    RAD *
      (
        280.16 +
        360.9856235 * d
      ) -
    lw
  );
}

/**
 * Solar azimuth.
 */
export function azimuth(
  H: number,
  phi: number,
  dec: number
) {
  return Math.atan2(
    Math.sin(H),
    Math.cos(H) *
      Math.sin(phi) -
      Math.tan(dec) *
        Math.cos(phi)
  );
}

/**
 * Solar altitude.
 */
export function altitude(
  H: number,
  phi: number,
  dec: number
) {
  return Math.asin(
    Math.sin(phi) *
      Math.sin(dec) +
      Math.cos(phi) *
        Math.cos(dec) *
        Math.cos(H)
  );
}

/**
 * Sunrise / sunset hour angle.
 */
export function hourAngle(
  lat: number,
  dec: number
) {
  const h =
    -0.833 * RAD;

  return Math.acos(
    (
      Math.sin(h) -
      Math.sin(lat) *
        Math.sin(dec)
    ) /
      (
        Math.cos(lat) *
        Math.cos(dec)
      )
  );
}

/**
 * Generic altitude hour angle.
 */
export function hourAngleByAltitude(
  lat: number,
  dec: number,
  alt: number
) {
  return Math.acos(
    (
      Math.sin(alt) -
      Math.sin(lat) *
        Math.sin(dec)
    ) /
      (
        Math.cos(lat) *
        Math.cos(dec)
      )
  );
}