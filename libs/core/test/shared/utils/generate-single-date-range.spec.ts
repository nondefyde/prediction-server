import { Utils } from '../../../src/shared/utils/index';
import * as typeorm from 'typeorm';

jest.mock('typeorm', () => {
  return {
    __esModule: true,
    ...jest.requireActual('typeorm'),
  };
});

describe('generateSingleDateRange', () => {
  let dateString;
  let betweenSpy;
  let generateSingleDateRangeSpy;

  beforeEach(() => {
    betweenSpy = jest.spyOn(typeorm, 'Between');
    generateSingleDateRangeSpy = jest.spyOn(Utils, 'generateSingleDateRange');
  });

  afterEach(() => jest.clearAllMocks());

  it('Should by default generate a date range off a single date based on start and end of day by calling Typeorm Between date operator', async () => {
    dateString = '2022-09-16T13:54:42.726Z';
    const result = Utils.generateSingleDateRange(dateString);

    expect(betweenSpy).not.toHaveBeenCalled();
    expect(generateSingleDateRangeSpy).toHaveBeenCalled();
    expect(generateSingleDateRangeSpy).toHaveBeenCalledWith(dateString);
    expect(generateSingleDateRangeSpy).toHaveReturned();
    expect(generateSingleDateRangeSpy).toHaveReturnedWith(result);
    expect(result).toBeInstanceOf(Object);
  });

  it('Should generate a date range off a single date based on start and end of day when provided DB type is NoSql', async () => {
    dateString = '2022-09-16T13:54:42.726Z';
    const result = Utils.generateSingleDateRange(dateString, 'MySql');

    expect(betweenSpy).toHaveBeenCalled();
    expect(generateSingleDateRangeSpy).toHaveBeenCalled();
    expect(generateSingleDateRangeSpy).toHaveBeenCalledWith(
      dateString,
      'MySql',
    );
    expect(generateSingleDateRangeSpy).toHaveReturned();
    expect(generateSingleDateRangeSpy).toHaveReturnedWith(result);
    expect(result).toBeInstanceOf(Object);
  });
});
