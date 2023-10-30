import { Utils } from '../../../src/shared/utils/index';

describe('cleanUpMobileNumber', () => {
  it('should return  mobile number prefixed with 234 if mobile number begins with 0', async () => {
    const mobile = '08141151299';
    const mockResult = '2348141151299';

    const cleanedUpMobileNumberSpy = jest.spyOn(Utils, 'cleanUpMobileNumber');

    const result = Utils.cleanUpMobileNumber(mobile);

    expect(cleanedUpMobileNumberSpy).toHaveBeenCalled();
    expect(cleanedUpMobileNumberSpy).toHaveBeenCalledWith(mobile);
    expect(cleanedUpMobileNumberSpy).toHaveReturned();
    expect(cleanedUpMobileNumberSpy).toHaveReturnedWith(result);
    expect(cleanedUpMobileNumberSpy).not.toHaveReturnedWith(mobile);
    expect(result).toEqual(mockResult);

    cleanedUpMobileNumberSpy.mockClear();
  });
  it('should return provided mobile number if mobile number does not begin with +', async () => {
    const mobile = '+2348141151299';
    const mockResult = '2348141151299';

    const cleanedUpMobileNumberSpy = jest.spyOn(Utils, 'cleanUpMobileNumber');

    const result = Utils.cleanUpMobileNumber(mobile);

    expect(cleanedUpMobileNumberSpy).toHaveBeenCalled();
    expect(cleanedUpMobileNumberSpy).toHaveBeenCalledWith(mobile);
    expect(cleanedUpMobileNumberSpy).toHaveReturned();
    expect(cleanedUpMobileNumberSpy).toHaveReturnedWith(result);
    expect(cleanedUpMobileNumberSpy).not.toHaveReturnedWith(mockResult);
    expect(result).not.toEqual(mockResult);

    cleanedUpMobileNumberSpy.mockClear();
  });

  it('should return provided mobile number if mobile number does not begin with +', async () => {
    const mobile = '2348141151299';
    const mockResult = '2348141151299';

    const cleanedUpMobileNumberSpy = jest.spyOn(Utils, 'cleanUpMobileNumber');

    const result = Utils.cleanUpMobileNumber(mobile);

    expect(cleanedUpMobileNumberSpy).toHaveBeenCalled();
    expect(cleanedUpMobileNumberSpy).toHaveBeenCalledWith(mobile);
    expect(cleanedUpMobileNumberSpy).toHaveReturned();
    expect(cleanedUpMobileNumberSpy).toHaveReturnedWith(mockResult);
    expect(result).toEqual(mockResult);

    cleanedUpMobileNumberSpy.mockClear();
  });
});
