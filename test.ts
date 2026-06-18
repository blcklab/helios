import { helios } from "./dist/index.js";
const now = new Date()
console.log(
  helios(
    14.4297,
    120.9367,
    now
  ).getTimes()
)