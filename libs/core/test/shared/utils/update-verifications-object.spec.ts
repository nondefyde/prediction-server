import { Utils } from '../../../src/shared/utils/index';

describe('updateVerification', () => {
  const key = 'bvn';
  const mockObj = {
    email: 'test@gmail.com',
    password: 'abcd1234',
    verificationCodes: {
      mobile: '123456',
      email: '123456',
      bvn: '123456789',
    },
    verifications: {
      mobile: false,
      bvn: false,
    },
  };
  it('should update verification object', async () => {
    const updateVerificationSpy = jest.spyOn(Utils, 'updateVerification');

    const { verifications, verificationCodes } = Utils.updateVerification(
      mockObj,
      key,
    );

    expect(updateVerificationSpy).toHaveBeenCalled();
    expect(updateVerificationSpy).toHaveReturned();
    expect(updateVerificationSpy).toHaveReturnedWith({
      verifications,
      verificationCodes,
    });
    expect(verifications).toHaveProperty(key);
    expect(verifications[key]).toEqual(true);
    expect(verificationCodes).not.toHaveProperty(key);

    updateVerificationSpy.mockClear();
  });
});
