const RAD = Math.PI / 180;

const J1970 = 2440588;
const J2000 = 2451545;

// -------------------- TIME --------------------

export function toJulian(date: Date): number {
  return date.getTime() / 86400000 - 0.5 + J1970;
}

export function fromJulian(j: number): Date {
  return new Date((j + 0.5 - J1970) * 86400000);
}

// -------------------- SOLAR --------------------

export function solarMeanAnomaly(d: number): number {
  return RAD * (357.5291 + 0.98560028 * d);
}

export function equationOfCenter(M: number): number {
  return RAD * (
    1.9148 * Math.sin(M) +
    0.02 * Math.sin(2 * M) +
    0.0003 * Math.sin(3 * M)
  );
}

export function eclipticLongitude(M: number): number {
  const C = equationOfCenter(M);
  return M + C + RAD * 102.9372 + Math.PI;
}

export function declination(L: number): number {
  return Math.asin(
    Math.sin(L) * Math.sin(RAD * 23.4397)
  );
}

export function hourAngle(lat: number, dec: number): number {
  const h = -0.833 * RAD;

  return Math.acos(
    (Math.sin(h) - Math.sin(lat) * Math.sin(dec)) /
    (Math.cos(lat) * Math.cos(dec))
  );
}

export function hourAngleByAltitude(lat: number, dec: number, alt: number): number {
  return Math.acos(
    (Math.sin(alt) - Math.sin(lat) * Math.sin(dec)) /
    (Math.cos(lat) * Math.cos(dec))
  );
}