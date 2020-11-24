import { searchForPair, shuffle, wait, randomWait } from './utils';

// searchForPair
test('should return first pair of matching objects from an array of objects', () => {
  const data = [{ value: 'foo' }, { value: 'bar' }, { value: 'foo' }, { value: 'baz' }, { value: 'baz' }];
  const result = searchForPair(data, 'value');
  expect(result).toEqual([{ value: 'foo' }, { value: 'foo' }]);
});

// shuffle
test('should return an array with same values but different order from the source array', () => {
  const data = [1, 2, 3, 4];
  const result = shuffle(data);
  expect(result).not.toEqual([1, 2, 3, 4]);
  data.forEach((value) => {
    expect(result).toContain(value);
  });
});

// wait
test('should set result to true after 500ms when promise is resolved', () => {
  let result = false;
  setTimeout(() => {
    expect(result).toBe(false);
  }, 450);
  setTimeout(() => {
    expect(result).toBe(true);
  }, 550);
  return wait(500).then(() => {
    result = true;
  });
});

// randomWait
test('should set result to true after 500ms when promise is resolved', () => {
  let result = false;
  setTimeout(() => {
    expect(result).toBe(false);
  }, 450);
  setTimeout(() => {
    expect(result).toBe(true);
  }, 550);
  return randomWait(0, 500, 1).then(() => {
    result = true;
  });
});
