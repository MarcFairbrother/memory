import { checkForMatchingCard } from './strategy';

// checkForMatchingCard
test('should return an empty array', () => {
  const previous = [{ name: 'foo' }];
  const settings = {
    discovered: [{ name: 'foo' }, { name: 'bar' }],
  };
  const result = checkForMatchingCard(previous, settings);
  expect(result.length).toEqual(0);
});

test('should return an array with the matching value', () => {
  const previous = [{ name: 'foo' }];
  const settings = {
    discovered: [{ name: 'foo' }, { name: 'foo' }],
  };
  const result = checkForMatchingCard(previous, settings);
  expect(result).toEqual([{ name: 'foo' }]);
});
