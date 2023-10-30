import { Utils } from '../../../src/shared/utils/index';
import * as mongoose from 'mongoose';

describe('IsObjectId', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return false if provided value is an invalid mongoose ObjectId string', async () => {
    const value = '123456789';
    const IsObjectIdSpy = jest.spyOn(Utils, 'IsObjectId');
    let result;

    try {
      result = Utils.IsObjectId(value);

      expect(IsObjectIdSpy).toHaveBeenCalled();
      expect(IsObjectIdSpy).toHaveReturned();
      expect(IsObjectIdSpy).toHaveReturnedWith(result);
      expect(IsObjectIdSpy).toHaveReturnedWith(false);
      expect(result).toBe(false);
    } catch (err) {
      console.log({ err, result });
      expect(result).toBe(false);
    }
    console.log({ result });
  });

  it('should return true if provided value is a valid mongoose ObjectId string', async () => {
    const IsObjectIdSpy = jest.spyOn(Utils, 'IsObjectId');
    const mongooseObjectIdSpy = jest.spyOn(mongoose.Types, 'ObjectId');
    const value = new mongoose.Types.ObjectId();

    const result = Utils.IsObjectId(value.toString());

    expect(IsObjectIdSpy).toHaveBeenCalled();
    expect(IsObjectIdSpy).toHaveReturned();
    expect(IsObjectIdSpy).toHaveReturnedWith(result);
    expect(result).toBe(true);
    expect(mongooseObjectIdSpy).toHaveBeenCalled();
    expect(mongooseObjectIdSpy).toHaveReturned();
    expect(mongooseObjectIdSpy).toHaveReturnedWith(value);

    mongooseObjectIdSpy.mockClear();
  });
});
