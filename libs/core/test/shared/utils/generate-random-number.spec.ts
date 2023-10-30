import { Utils } from '../../../src/shared/utils/index';

describe('generateRandomNumber', () => {
  it('should generate a random number based on the specified length', async () => {
    const length = 5;

    const generateRandomNumberMock = jest.spyOn(Utils, 'generateRandomNumber');

    const result = Utils.generateRandomNumber(length);

    expect(generateRandomNumberMock).toHaveBeenCalled();
    expect(generateRandomNumberMock).toHaveBeenCalledWith(length);
    expect(generateRandomNumberMock).toHaveReturned();
    expect(generateRandomNumberMock).toHaveReturnedWith(result);
    expect(result.toString().length).toBe(length);

    generateRandomNumberMock.mockClear();
  });
});
