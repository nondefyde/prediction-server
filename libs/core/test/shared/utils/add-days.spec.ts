import { Utils } from '../../../src/shared/utils/index';

describe('addDays', () => {
  it('should add day(s) to current date', async () => {
    const days = 2;
    const dateString = 'October 13, 2014 11:13:00';

    const generateNewdateSpy = jest.spyOn(Utils, 'addDays');

    const result = Utils.addDays(dateString, days);

    expect(generateNewdateSpy).toHaveBeenCalled();
    expect(generateNewdateSpy).toHaveBeenCalledWith(dateString, days);
    expect(generateNewdateSpy).toHaveReturned();
    expect(generateNewdateSpy).toHaveReturnedWith(result);
    expect(result instanceof Date).toBe(true);

    generateNewdateSpy.mockClear();
  });
});
