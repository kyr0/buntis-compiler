import { bench, getRandomInt } from "./bench";

const b = bench({ iterations: 10000 });

b.measure("Array.inArray", () => {
  const res = Array.isArray(getRandomInt(1, 10) === 5 ? [] : true);
});

b.measure("Array instance of", () => {
  const d = getRandomInt(1, 10) === 5 ? [] : true;
  const res = d instanceof Array;
});

b.start();