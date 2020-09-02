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
