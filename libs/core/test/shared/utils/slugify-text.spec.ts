import { Utils } from '../../../src/shared/utils/index';
import * as slugify from 'slugify';

jest.mock('slugify', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((data, options) => data),
  };
});

describe('slugifyText', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return null if argument is null hence not slugify argument', async () => {
    const slugifyTextSpy = jest.spyOn(Utils, 'slugifyText');

    const result = Utils.slugifyText(null);

    expect(slugifyTextSpy).toHaveBeenCalled();
    expect(slugifyTextSpy).toHaveBeenCalledWith(null);
    expect(slugifyTextSpy).toHaveReturned();
    expect(slugifyTextSpy).toHaveReturnedWith(result);
    expect(slugify.default).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('should return slugified argument', () => {
    const slugifyTextSpy = jest.spyOn(Utils, 'slugifyText');
    const sluggifyMock = slugify.default as unknown as jest.Mock;
    sluggifyMock.mockImplementation(
      (data, option = '-') => `${data.split(' ').join(option)}`,
    );
    const text = 'mr biggs';

    const result = Utils.slugifyText(text);

    expect(slugifyTextSpy).toHaveBeenCalled();
    expect(slugifyTextSpy).toHaveBeenCalledWith(text);
    expect(slugifyTextSpy).toHaveReturned();
    expect(slugifyTextSpy).toHaveReturnedWith(result);
    expect(slugify.default).toHaveBeenCalled();
    expect(slugify.default).toHaveReturned();
    expect(slugify.default).toHaveReturnedWith(result);
  });

  it('should return lowercased version of provided argument', () => {
    const slugifyTextSpy = jest.spyOn(Utils, 'slugifyText');
    const text = 'Chowville';

    const result = Utils.slugifyText(text);

    expect(slugifyTextSpy).toHaveBeenCalled();
    expect(slugifyTextSpy).toHaveBeenCalledWith(text);
    expect(slugifyTextSpy).toHaveReturned();
    expect(slugifyTextSpy).toHaveReturnedWith(result);
    expect(slugify.default).not.toHaveBeenCalled();
    expect(result).not.toEqual(text);
    expect(result).toEqual(text.toLowerCase());
  });
});
