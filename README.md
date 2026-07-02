##  Helios

A lightweight JavaScript library for deterministic solar modeling in real-time graphics and simulation.

Helios calculates precise sun positions, solar events, and derived lighting conditions from geographic coordinates and time. Built as a zero-dependency computation layer for Three.js, Babylon.js, WebGL, and modern edge runtimes.

Pure, stateless, and framework-agnostic.


<p align="left">
  <img src="https://img.shields.io/npm/v/@blcklab/helios?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/@blcklab/helios?style=flat-square" alt="downloads" />
  <img src="https://github.com/blcklab/helios/actions/workflows/test.yml/badge.svg?style=flat-square" alt="tests" />
  <img src="https://img.shields.io/github/license/blcklab/helios?style=flat-square&v=2" alt="license" />
</p>

---

## System Overview

Input:

* geographic coordinates (lat, lng)
* temporal state (Date)

Output:

* solar event timeline
* directional sun vector
* empirical light model

Mapping:

```
(lat, lng, t)
    ↓
solar ephemeris model
    ↓
scene-relevant state vector

```

---

## Installation

```bash
npm install @blcklab/helios

```

Using Yarn:

```bash
yarn add @blcklab/helios

```

Using pnpm:

```bash
pnpm add @blcklab/helios

```

---

## Integration Example (Three.js)

```ts
import { getTimes } from "@blcklab/helios";

const sun = getTimes({
  lat: 14.4297,
  lng: 120.9367,
  date: new Date(),
});

// Directional light orientation
directionalLight.position.set(
  sun.direction.x,
  sun.direction.y,
  sun.direction.z
);

directionalLight.intensity = sun.light.intensity;

```

---

## Integration Example (Babylon.js)

```ts
import { getTimes } from "@blcklab/helios";

const sun = getTimes({
  lat: 14.4297,
  lng: 120.9367
});

light.direction = new BABYLON.Vector3(
  sun.direction.x,
  sun.direction.y,
  sun.direction.z
);

light.intensity = sun.light.intensity;

```

---

## Core API

### `getTimes(options)`

Evaluates the full solar and lighting state for a given spatiotemporal input.

```ts
type GetTimesOptions = {
  lat: number;
  lng: number;
  date?: Date;
};

```

Returns a flat `SunTimes` schema containing ephemeris metrics alongside derived lighting values.

---

### `helios(lat, lng)`

Stateful factory wrapper bound to a fixed spatial coordinate, ideal for repeated evaluations.

```ts
import { helios } from "@blcklab/helios";

const solarCalculator = helios(14.4297, 120.9367);

```

Methods:

* `.now()` → Evaluates the current solar state.
* `.at(date)` → Evaluates the state at a specific time.
* `.getTimes(date?)` → Synonym method returning full state evaluation.
* `.position(date?)` → Directly yields the raw spherical `SunPosition` (`{ altitude, azimuth }`).

---

## Solar State Model Reference

When running `getTimes()`, the returned evaluation follows this strict structure:

```ts
{
  dawn: Date,           // Civil dawn (Sun reaches -6° altitude)
  sunrise: Date,        // Sunrise marker
  solarNoon: Date,      // Sun reaches its highest zenith point
  sunset: Date,         // Sunset marker
  dusk: Date,           // Civil dusk (Sun reaches -6° altitude)

  dayLength: number,    // Daylight duration in milliseconds
  sunProgress: number,  // Day progression index normalized 0 (sunrise) to 1 (sunset)

  phase: 'night' | 'dawn' | 'morning' | 'day' | 'sunset',

  position: {
    altitude: number,   // Height above horizon in degrees (0° = horizon, 90° = overhead)
    azimuth: number     // Compass bearing in degrees clockwise from North (0° = N, 90° = E)
  },

  direction: {
    x: number,          // Right-Handed Cartesian Unit Vectors
    y: number,          // Orientation is Y-Up oriented by default
    z: number           // Represents normalized direction of incident solar vector
  },

  light: {
    intensity: number,        // Derived illumination scalar mapping ∈ [0, 1]
    colorTemperature: number, // Estimated Kelvin rating (2000K = orange sunset, 6500K = white daylight)
    rgb: { r: number, g: number, b: number } // Normalized linear RGB approximation [0, 1]
  },

  civilTwilight: {
    morning: { start: Date, end: Date },
    evening: { start: Date, end: Date }
  },

  isDay: boolean,       // Flag verifying if sun is above horizon
  isNight: boolean      // Flag verifying if sun is below horizon
}

```

---

## Frame Update Pattern

Helios is highly optimized for per-frame animation and simulation cycles. Instantiating the context once outside the loop ensures there are zero runtime object mutations or garbage collection spikes:

```ts
// Instantiate once outside your animation loop
const solarCalculator = helios(lat, lng);

function update() {
  requestAnimationFrame(update);

  // O(1) stateless evaluation using the pre-bound target coordinate
  const sun = solarCalculator.now();

  directionalLight.position.set(
    sun.direction.x,
    sun.direction.y,
    sun.direction.z
  );

  directionalLight.intensity = sun.light.intensity;
}

```

---

## Computational Properties

* **Complexity:** O(1) uniform footprint per evaluation.
* **Side-Effect Free:** Pure mathematical transformations with no hidden runtime states.
* **No Network IO:** Zero external runtime dependencies or API requests.
* **Deterministic:** Replicable, uniform output values matching specific target inputs.

---

## Coordinate Conventions

* Right-handed Cartesian coordinate layout.
* Default **Y-up** spatial orientation (engine-dependent transformations allowed).
* Azimuth measured clockwise from geographic true North.

---

## System Applications

* **Game Engines & Real-time Visuals:** Real-time day/night loops, physically-inspired atmospheric lighting models, and procedural environment configurations.
* **Simulations & Virtual Twins:** GIS visual analytics, virtual reality worlds, and location-synchronized architecture previews.
* **Smart Ecosystem Automation:** Coordinating dynamic hardware lighting rules or sunrise/sunset behaviors alongside native environmental cycles.

---

## Module Support

Helios provides cross-environment support across modern environments and runtimes:

### ESM

```ts
import { getTimes } from "@blcklab/helios";

```

### CommonJS

```js
const { getTimes } = require("@blcklab/helios");

```

---

## Design Constraints

* No rendering or layout responsibilities.
* No environment I/O, storage access, or network calls.
* No internal state mutation flags inside standard math calculators.

---


## License

MIT © Black Lab