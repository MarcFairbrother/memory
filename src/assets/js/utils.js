export function shuffle(array) {
  const data = [...array];
  // loop over array from last to first item
  for (let i = data.length - 1; i > 0; i--) {
    // assign a random item from the array to j
    const j = Math.floor(Math.random() * (i + 1));
    // swap values of items i and j
    [data[i], data[j]] = [data[j], data[i]];
  }
  return data;
}

export function searchForPair(data, prop) {
  let pair;
  // uses for loop to break after first pair is found
  for (let i = 0; i < data.length; i++) {
    // create a new array filtered for each value
    const arr = data.filter((item) => item[prop] === data[i][prop]);
    // if the array has more than one item we can return the value and break
    if (arr.length > 1) {
      pair = arr;
      break;
    }
  }
  return pair;
}

// waits for the amount of milliseconds passed to resolve a promise
export function wait(ms = 0) {
  return new Promise((res) => setTimeout(res, ms));
}

// waits for random amount of milliseconds between min and max values to resolve a promise
export function randomWait(min = 0, max = 500, random = Math.random()) {
  const ms = Math.ceil(random * (max - min) + min);
  return new Promise((res) => setTimeout(res, ms));
}
