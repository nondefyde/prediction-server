import { PGBaseService } from '../pgbase.service/pgbase.service';

export class MockBaseModelClass {
  public static target = {
    name: 'MockAttributeModel',
    config: {
      fillables: ['name'],
      updateFillables: ['name'],
      uniques: ['name'],
      dateFilters: ['createdAt', 'updatedAt'],
      softDelete: true,
    },
    searchQuery: jest.fn().mockImplementation(function (data) {
      return data;
    }),
  };

  data: any;

  constructor(data: any) {
    this.data = data;
  }

  static create(data: any) {
    return {
      data,
    };
  }
  static findOne(data: any) {
    return {
      data: data['where'],
    };
  }

  static createQueryBuilder(data: any) {
    return {
      data,
      latest: JSON.stringify({}),
      setFindOptions: jest.fn().mockImplementation(function () {
        return this;
      }),
      orWhere: jest.fn().mockImplementation(() => data),
      select: jest.fn().mockImplementation(function () {
        return this;
      }),
      take: jest.fn().mockImplementation(function () {
        return this;
      }),
      distinct: jest.fn().mockImplementation(function () {
        return this;
      }),
      skip: jest.fn().mockImplementation(function () {
        return this.data;
      }),
      getRawMany: jest.fn().mockImplementation(function () {
        const value = this.data;
        const count = 5;
        return [{ value, count }];
      }),
      getManyAndCount: jest.fn().mockImplementation(function () {
        const value = this.data;
        const count = 5;
        return [value, count];
      }),
      getOne: jest.fn().mockImplementation(function () {
        return this.data;
      }),
    };
  }
  static merge(data: any, currentObject: any) {
    return data.data
      ? { ...data.data, ...currentObject }
      : { ...data, ...currentObject };
  }

  static save(data: any) {
    return data;
  }

  static remove(data: any, options1: any, options2: any) {
    return { data, save: jest.fn() };
  }
}

describe('PGBaseService', () => {
  let pgBaseService: PGBaseService;
  let pgBaseServiceSpy: jest.SpyInstance;

  beforeAll(() => {
    pgBaseService = new PGBaseService(MockBaseModelClass);
  });

  afterEach(() => {
    pgBaseServiceSpy.mockClear();
  });

  describe('createNewObject', () => {
    it('should create a new object', async () => {
      const payLoad = {
        userId: '631a04ba9cebaac253e97402',
        name: 'test-name',
      };

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'createNewObject');
      const result = await pgBaseService.createNewObject(payLoad);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(payLoad);
      expect(pgBaseServiceSpy).toHaveReturned();
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('findObject', () => {
    it('should find a record from a table of records with an alphanumeric payload id', async () => {
      const id = '6322074f7aa98fd0a96c97a8';

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'findObject');
      const result = await pgBaseService.findObject(id);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(id);
      expect(result.data).toBeInstanceOf(Object);
      expect(result.data).toHaveProperty('publicId');
      expect(result.data['publicId']).toEqual(id);
    });

    it('should find a record from a table of records with a numeric payload id', async () => {
      const id = '632207487229857019689768';

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'findObject');
      const result = await pgBaseService.findObject(id);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(id);
      expect(result.data).toBeInstanceOf(Object);
      expect(result.data).toHaveProperty('id');
      expect(result.data['id']).toEqual(id);
    });
  });

  describe('updateObject', () => {
    it('should update an existing object', async () => {
      const payload = {
        userId: '631a04ba9cebaac253e97402',
        name: 'test',
      };
      const id = '6322074f7aa98fd0a96c97a8';

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'updateObject');
      const result = await pgBaseService.updateObject(id, payload);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(id, payload);
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('publicId');
      expect(result['publicId']).toEqual(id);
    });
  });

  describe('patchUpdate', () => {
    it('should update an existing record', async () => {
      const currentObject = {
        userId: '631a04ba9cebaac253e97402',
        name: 'test',
      };
      const payload = {
        name: 'patch test',
      };

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'patchUpdate');
      const result = await pgBaseService.patchUpdate(currentObject, payload);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(currentObject, payload);
      expect(result).toBeInstanceOf(Object);
      expect(result).not.toEqual(currentObject);
    });
  });

  describe('deleteObject', () => {
    it('should delete an object', async () => {
      const payload = {
        userId: '631a04ba9cebaac253e97402',
        name: 'test',
      };

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'deleteObject');
      const result = await pgBaseService.deleteObject(payload);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(payload);
      expect(pgBaseServiceSpy).toHaveReturned();
    });
  });

  describe('buildModelQueryObject', () => {
    let pagination;
    let queryParser;

    it('should build model query object', async () => {
      pagination = {
        totalCount: 120,
        perPage: 10,
        skip: 1,
      };
      queryParser = {
        query: {
          deleted: true,
          createdAt: Date.now(),
        },
        page: 1,
        search: ['mock data'],
        sort: jest.fn(),
        selection: [''],
      };

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'buildModelQueryObject');
      const result = await pgBaseService.buildModelQueryObject(
        pagination,
        queryParser,
      );

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(pagination, queryParser);
      expect(pgBaseServiceSpy).toHaveReturned();
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('value');
      expect(result).toHaveProperty('count');
    });

    it('should build model query object with default sort value', async () => {
      pagination = {
        totalCount: 120,
        perPage: 10,
        skip: 1,
      };
      queryParser = {
        query: {
          deleted: true,
          createdAt: Date.now(),
        },
        page: 1,
        search: ['mock data'],
        selection: [''],
      };

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'buildModelQueryObject');
      const result = await pgBaseService.buildModelQueryObject(
        pagination,
        queryParser,
      );

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(pagination, queryParser);
      expect(pgBaseServiceSpy).toHaveReturned();
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('value');
      expect(result).toHaveProperty('count');
    });
  });

  describe('findByUniqueKey', () => {
    it('should search a collection using a unique key', async () => {
      const key = 'value';
      const params = {};

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'findByUniqueKey');
      const result = await pgBaseService.findByUniqueKey(key, params);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(key, params);
      expect(pgBaseServiceSpy).toHaveReturned();
      expect(result).toBeInstanceOf(Object);
    });

    it('should search a collection using a unique key and with default params', async () => {
      const key = 'value';
      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'findByUniqueKey');
      const result = await pgBaseService.findByUniqueKey(key);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(key);
      expect(pgBaseServiceSpy).toHaveReturned();
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('validateObject', () => {
    it('should validate provided payload', async () => {
      const payload = {
        id: '631a04ba9cebaac253e97402',
      };

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'validateObject');
      const result = await pgBaseService.validateObject(payload);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(payload);
      expect(pgBaseServiceSpy).toHaveReturned();
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('data');
      expect(result.data).toBeInstanceOf(Object);
      expect(result.data).toHaveProperty('publicId');
      expect(result.data['publicId']).toEqual(payload.id);
    });
  });

  describe('searchOneObject', () => {
    let query;
    it('should search one object with provided query ', async () => {
      query = {
        deleted: true,
        createdAt: Date.now(),
      };

      pgBaseServiceSpy = jest.spyOn(pgBaseService, 'searchOneObject');
      const result = await pgBaseService.searchOneObject(query);

      expect(pgBaseServiceSpy).toHaveBeenCalled();
      expect(pgBaseServiceSpy).toHaveBeenCalledWith(query);
      expect(pgBaseServiceSpy).toHaveReturned();
    });
  });
});
