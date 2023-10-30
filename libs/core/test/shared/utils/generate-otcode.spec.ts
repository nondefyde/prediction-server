import { Utils } from '../../../src/shared/utils/index';

describe('generateOTCode', () => {
  it('should generate a unique numeric one time code with default size', async () => {
    const size = 6;
    const generateOTCodeSpy = jest.spyOn(Utils, 'generateOTCode');

    const result = Utils.generateOTCode();

    expect(generateOTCodeSpy).toHaveBeenCalled();
    expect(generateOTCodeSpy).toHaveReturned();
    expect(generateOTCodeSpy).toHaveReturnedWith(result);
    expect(typeof +result === 'number').toBe(true);
    expect(result.length).toBe(size);

    generateOTCodeSpy.mockClear();
  });

  it('should generate a unique alphanumeric one time code with specified size', async () => {
    const size = 4;
    const alpha = true;
    const generateOTCodeSpy = jest.spyOn(Utils, 'generateOTCode');

    const result = Utils.generateOTCode(size, alpha);

    expect(generateOTCodeSpy).toHaveBeenCalled();
    expect(generateOTCodeSpy).toHaveReturned();
    expect(generateOTCodeSpy).toHaveReturnedWith(result);
    expect(typeof result === 'number').toBe(false);
    expect(+result).toBe(NaN);
    expect(result.length).toBe(size);

    generateOTCodeSpy.mockClear();
  });
});
