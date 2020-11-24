import { searchForPair } from './utils';

test('should return first pair of matching objects from an array of objects', () => {
  const data = [{ value: 'foo' }, { value: 'bar' }, { value: 'foo' }, { value: 'baz' }, { value: 'baz' }];
  const result = searchForPair(data, 'value');
  expect(result).toEqual([{ value: 'foo' }, { value: 'foo' }]);
});
