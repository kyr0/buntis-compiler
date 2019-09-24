import { bench, getRandomInt } from "./bench";
import { ADDRGETNETWORKPARAMS } from "dns";

const b = bench({ iterations: 100000 });

const benchPushAndIndex = () => {
  const arr1 = [];
  const arr2 = [];
  b.measure("push", i => {
    arr1.push(i);
  });

  b.measure("index[]", i => {
    arr2[arr2.length] = i;
  });
  b.start();
};

const benchArrayCheck = () => {
  b.measure("Array.inArray", () => {
    const res = Array.isArray(getRandomInt(1, 10) === 5 ? [] : true);
  });

  b.measure("Array instance of", () => {
    const d = getRandomInt(1, 10) === 5 ? [] : true;
    const res = d instanceof Array;
  });

  b.start();
};

const benchIndexOf = () => {
  function customIndexOf(arr, searchElement) {
    var minIndex = 0;
    var maxIndex = arr.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
      currentIndex = ((minIndex + maxIndex) / 2) | 0;
      currentElement = arr[currentIndex];

      if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
      } else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
      } else {
        return currentIndex;
      }
    }
    return -1;
  }

  const data : any = [];
  for (let i = 0; i < 10000; i++) {
    data.push(i);
  }

  b.measure("indexOf", () => {
    data.indexOf(getRandomInt(1, 10000));
  });

  b.measure("customIndexOf", () => {
    customIndexOf(data, getRandomInt(1, 10000));
  });

  b.measure("includes", () => {
    data.includes(getRandomInt(1, 10000));
  });
  b.start();
};

benchIndexOf();
