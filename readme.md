🌞 Helios

<p align="left">
  <img src="https://img.shields.io/npm/v/@blacklab/helios?style=flat-square" />
  <img src="https://img.shields.io/npm/dm/@blacklab/helios?style=flat-square" />
  <img src="https://img.shields.io/github/license/blacklab/helios?style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-ready-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/ESM%20%2F%20CJS-supported-green?style=flat-square" />
</p>

📦 Install

```bash
npm install @blacklab/helios
```

🚀 Quick Start

```ts
import { getTimes } from "@blacklab/helios";

const result = getTimes({
  lat: 14.4297,
  lng: 120.9367,
  date: new Date()
});

console.log(result);
```

📊 Output

```ts
{
  sunrise: Date,
  sunset: Date,

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

🧠 API

### `getTimes(options)`

Returns solar times for a given location.

```ts
type GetTimesOptions = {
  lat: number;
  lng: number;
  date?: Date;
};
```

---

### `helios(lat, lng)`

Factory wrapper for chained usage.

```ts
import { helios } from "@blacklab/helios";

const h = helios(14.4297, 120.9367);

h.now();
h.at(new Date());
h.getTimes(new Date());
```

🌅 Features

- Sunrise / Sunset calculation  
- Golden hour (morning & evening)  
- Day / Night detection  
- Latitude / longitude based  
- Pure astronomical formulas (no API dependency)  
- Framework-agnostic  

⚙️ Design Philosophy

- Deterministic outputs  
- No external dependencies  
- Fast, lightweight computation  
- Safe for Node.js and edge environments  
- Predictable math-based results  

🌍 Use Cases

- Photography planning tools  
- Weather applications  
- Smart lighting systems  
- Agriculture / environmental systems  
- Astronomy dashboards  
- Scheduling based on daylight cycles  


📦 Module Support

### ESM

```ts
import { getTimes } from "@blacklab/helios";
```

### CommonJS

```js
const { getTimes } = require("@blacklab/helios");
```

🧪 Roadmap

- Solar azimuth & elevation angles  
- Twilight phases (civil / nautical / astronomical)  
- Moon phase support  
- Timezone-aware output  
- CLI tool (helios)  
- Visualization demo  

📄 License

MIT © Black Lab
