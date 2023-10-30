import { Utils } from '../../../src/shared/utils/index';
import * as uuid from 'uuid';

jest.mock('uuid', () => {
  return {
    __esModule: true,
    ...jest.requireActual('uuid'),
  };
});

describe('generateUniqueId', () => {
  it('should generate a unique id beginning with the specified key', async () => {
    const key = 'test';
    const generateUniqueIdSpy = jest.spyOn(Utils, 'generateUniqueId');
    const uuidSpy = jest.spyOn(uuid, 'v4');

    const result = Utils.generateUniqueId(key);

    expect(generateUniqueIdSpy).toHaveBeenCalled();
    expect(uuidSpy).toHaveBeenCalledTimes(1);
    expect(generateUniqueIdSpy).toHaveReturned();
    expect(generateUniqueIdSpy).toHaveReturnedWith(result);
    expect(result.startsWith(key)).toBe(true);
    expect(result.startsWith('key')).toBe(false);

    generateUniqueIdSpy.mockClear();
  });
});
