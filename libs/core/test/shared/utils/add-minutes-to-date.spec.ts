import { Utils } from '../../../src/shared/utils/index';

describe('addMinToDate', () => {
  it('should add minute(s) to current date using the default value', async () => {
    const generateNewdateSpy = jest.spyOn(Utils, 'addMinToDate');

    const result = Utils.addMinToDate();

    expect(generateNewdateSpy).toHaveBeenCalled();
    expect(generateNewdateSpy).toHaveBeenCalledWith();
    expect(generateNewdateSpy).toHaveReturned();
    expect(generateNewdateSpy).toHaveReturnedWith(result);
    expect(result instanceof Date).toBe(true);

    generateNewdateSpy.mockClear();
  });
  it('should add minute(s) to current date', async () => {
    const min = 2;

    const generateNewdateSpy = jest.spyOn(Utils, 'addMinToDate');

    const result = Utils.addMinToDate(min);

    expect(generateNewdateSpy).toHaveBeenCalled();
    expect(generateNewdateSpy).toHaveBeenCalledWith(min);
    expect(generateNewdateSpy).toHaveReturned();
    expect(generateNewdateSpy).toHaveReturnedWith(result);
    expect(result instanceof Date).toBe(true);

    generateNewdateSpy.mockClear();
  });
});
