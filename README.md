# 🌞 Helios

A lightweight, dependency-free solar calculation library for JavaScript and TypeScript.

Helios provides accurate astronomical calculations for sunrise, sunset, solar position, daylight progress, golden hours, sunlight intensity, color temperature, and more. All without external APIs.

<p align="left">
  <img src="https://img.shields.io/npm/v/@blcklab/helios?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/@blcklab/helios?style=flat-square" alt="downloads" />
  <img src="https://img.shields.io/github/license/blcklab/helios?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/TypeScript-ready-blue?style=flat-square" alt="typescript" />
  <img src="https://img.shields.io/badge/ESM%20%2F%20CJS-supported-green?style=flat-square" alt="module support" />
</p>

---

## 📖 Table of Contents

* [Installation](#-installation)
* [Quick Start](#-quick-start)
* [Output Structure](#-output-structure)
* [API Reference](#-api-reference)

  * [getTimes(options)](#gettimesoptions)
  * [helios(lat-lng)](#helioslat-lng)
* [Features](#-features)
* [Design Philosophy](#-design-philosophy)
* [Use Cases](#-use-cases)
* [Module Support](#-module-support)
* [Roadmap](#-roadmap)
* [License](#-license)

---

## 📦 Installation

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

## 🚀 Quick Start

```ts
import { getTimes } from "@blcklab/helios";

const result = getTimes({
  lat: 14.4297,
  lng: 120.9367,
  date: new Date(),
});

console.log(result);
```

---

## 📊 Output Structure

```ts
{
  dawn: Date,
  sunrise: Date,
  solarNoon: Date,
  sunset: Date,
  dusk: Date,

  dayLength: number,
  sunProgress: number,

  phase: SunPhase,

  position: {
    altitude: number,
    azimuth: number
  },

  direction: {
    x: number,
    y: number,
    z: number
  },

  light: {
    intensity: number,
    colorTemperature: number,
    rgb: {
      r: number,
      g: number,
      b: number
    }
  },

  goldenHour: {
    morning: {
      start: Date,
      end: Date
    },
    evening: {
      start: Date,
      end: Date
    }
  },

  isDay: boolean,
  isNight: boolean
}
```

---

# 📚 API Reference

## `getTimes(options)`

Calculates solar information for a specific location and date.

### Parameters

```ts
type GetTimesOptions = {
  lat: number;
  lng: number;
  date?: Date;
};
```

### Example

```ts
import { getTimes } from "@blcklab/helios";

const solar = getTimes({
  lat: 14.4297,
  lng: 120.9367,
});

console.log(solar.sunrise);
console.log(solar.sunset);
```

---

## `helios(lat, lng)`

Factory wrapper for a fluent API experience.

### Example

```ts
import { helios } from "@blcklab/helios";

const h = helios(14.4297, 120.9367);

h.now();
h.at(new Date());
h.getTimes(new Date());
```

---

## 🌅 Features

### Solar Events

* Dawn
* Sunrise
* Solar Noon
* Sunset
* Dusk

### Sun Position

* Altitude calculation
* Azimuth calculation
* 3D directional vector

### Daylight Analysis

* Day length
* Day progress (`sunProgress`)
* Day/Night detection
* Sun phase classification

### Lighting Simulation

* Dynamic sunlight intensity
* Color temperature estimation
* RGB sunlight color generation

### Time-Based Calculations

* Morning golden hour
* Evening golden hour

### Developer Friendly

* TypeScript support
* ESM and CommonJS compatibility
* Framework agnostic
* Zero dependencies

---

## ⚙️ Design Philosophy

Helios is built around a few core principles:

* Deterministic outputs
* Pure astronomical calculations
* No external APIs
* No runtime dependencies
* Fast execution
* Small bundle footprint
* Edge-runtime compatibility
* Predictable results across environments

---

## 🌍 Use Cases

Helios can power a wide variety of applications:

### 📷 Photography

Plan shoots around sunrise, sunset, and golden hour.

### 🌦 Weather Applications

Enhance forecasts with daylight and solar position data.

### 💡 Smart Lighting

Adjust lighting systems based on real-world sunlight conditions.

### 🌱 Agriculture

Optimize schedules around daylight availability.

### 🔭 Astronomy

Visualize solar movement and daily cycles.

### 📅 Scheduling

Build daylight-aware automation and workflows.

### 🎮 Game Development

Create realistic lighting and environmental systems driven by actual solar positions.

- Day/night cycle systems
- Dynamic sky and sunlight rendering
- Golden hour visual effects
- Survival gameplay mechanics
- NPC behavior based on daylight
- Real-world location simulations
- Open-world and sandbox games
- Flight and driving simulators
- City builders and strategy games
- AR and location-based experiences


---

## 📦 Module Support

### ESM

```ts
import { getTimes } from "@blcklab/helios";
```

### CommonJS

```js
const { getTimes } = require("@blcklab/helios");
```

---

## 🧪 Roadmap

### Planned Features

* [ ] Civil twilight calculations
* [ ] Nautical twilight calculations
* [ ] Astronomical twilight calculations
* [ ] Moon phase support
* [ ] Lunar position calculations
* [ ] Timezone-aware outputs
* [ ] CLI tool (`helios`)
* [ ] Browser visualization demo
* [ ] Seasonal solar analytics

---

## 🤝 Contributing

Contributions, bug reports, feature requests, and discussions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT License © Black Lab
