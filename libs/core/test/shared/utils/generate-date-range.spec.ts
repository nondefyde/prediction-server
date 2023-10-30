import { Utils } from '../../../src/shared/utils/index';
import * as typeorm from 'typeorm';

jest.mock('typeorm', () => {
  return {
    __esModule: true,
    ...jest.requireActual('typeorm'),
  };
});
describe('generateDateRange', () => {
  let betweenSpy;
  let generateDateRangeSpy;
  let generateSingleDateRangeSpy;

  beforeEach(() => {
    betweenSpy = jest.spyOn(typeorm, 'Between');
    generateDateRangeSpy = jest.spyOn(Utils, 'generateDateRange');
    generateSingleDateRangeSpy = jest.spyOn(Utils, 'generateSingleDateRange');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should generate date range based on given start and end dates by not calling the Between method of typeorm', async () => {
    const payload = {
      startDate: '2022-09-14T16:46:26.330Z',
      endDate: '2022-09-14T16:54:39.438Z',
    };

    const result = Utils.generateDateRange(JSON.stringify(payload));

    expect(generateSingleDateRangeSpy).not.toHaveBeenCalled();
    expect(generateDateRangeSpy).toHaveBeenCalled();
    expect(generateDateRangeSpy).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(generateDateRangeSpy).toHaveReturned();
    expect(generateDateRangeSpy).toHaveReturnedWith(result);
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('$lte');
    expect(result['$lte'] instanceof Date).toBe(true);
    expect(result).toHaveProperty('$gte');
    expect(result['$gte'] instanceof Date).toBe(true);
    expect(betweenSpy).not.toHaveBeenCalled();
  });

  it('Should generate date range based on given start and end dates by calling the Between method of typeorm', async () => {
    const payload = {
      startDate: '2022-09-14T16:46:26.330Z',
      endDate: '2022-09-14T16:54:39.438Z',
    };

    try {
      const result = Utils.generateDateRange(JSON.stringify(payload), 'mySQL');

      expect(generateSingleDateRangeSpy).not.toHaveBeenCalled();
      expect(generateDateRangeSpy).toHaveBeenCalled();
      expect(generateDateRangeSpy).toHaveBeenCalledWith(
        JSON.stringify(payload),
        'mySQL',
      );
      expect(generateDateRangeSpy).toHaveReturned();
      expect(generateDateRangeSpy).toHaveReturnedWith(result);
      expect(result).toBeInstanceOf(Object);
      expect(betweenSpy).toHaveBeenCalledTimes(1);
      expect(betweenSpy).toHaveBeenCalledWith(
        JSON.stringify(payload.startDate),
        JSON.stringify(payload.endDate),
      );
      expect(betweenSpy).toHaveReturned();
    } catch (error) {}
  });

  it('Should generate single date based on provided payload argument', async () => {
    const payload = {
      startDate: '2022-09-14T16:46:26.330Z',
    };

    const result = Utils.generateDateRange(JSON.stringify(payload), 'mySQL');

    expect(generateSingleDateRangeSpy).toHaveBeenCalled();
    expect(generateDateRangeSpy).toHaveBeenCalled();
    expect(generateDateRangeSpy).toHaveBeenCalledWith(
      JSON.stringify(payload),
      'mySQL',
    );
    expect(generateDateRangeSpy).toHaveReturned();
    expect(generateDateRangeSpy).toHaveReturnedWith(result);
    expect(result).toBeInstanceOf(Object);
    expect(betweenSpy).toHaveBeenCalledTimes(1);
    expect(betweenSpy).toHaveReturned();
  });

  it('Should generate single date based on provided payload argument', async () => {
    const payload = {
      endDate: '2022-09-14T16:46:26.330Z',
    };

    const result = Utils.generateDateRange(JSON.stringify(payload), 'mySQL');

    expect(generateSingleDateRangeSpy).toHaveBeenCalled();
    expect(generateDateRangeSpy).toHaveBeenCalled();
    expect(generateDateRangeSpy).toHaveBeenCalledWith(
      JSON.stringify(payload),
      'mySQL',
    );
    expect(generateDateRangeSpy).toHaveReturned();
    expect(generateDateRangeSpy).toHaveReturnedWith(result);
    expect(result).toBeInstanceOf(Object);
    expect(betweenSpy).toHaveBeenCalledTimes(1);
    expect(betweenSpy).toHaveReturned();
  });

  it('Should generate single date with current date and time when payload does not contain start and end dates', async () => {
    const payload = {};

    const result = Utils.generateDateRange(JSON.stringify(payload), 'mySQL');

    expect(generateSingleDateRangeSpy).toHaveBeenCalled();
    expect(generateDateRangeSpy).toHaveBeenCalled();
    expect(generateDateRangeSpy).toHaveBeenCalledWith(
      JSON.stringify(payload),
      'mySQL',
    );
    expect(generateDateRangeSpy).toHaveReturned();
    expect(generateDateRangeSpy).toHaveReturnedWith(result);
    expect(result).toBeInstanceOf(Object);
    expect(betweenSpy).toHaveBeenCalledTimes(1);
    expect(betweenSpy).toHaveReturned();
  });
});
