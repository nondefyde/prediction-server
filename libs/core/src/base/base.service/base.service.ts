import * as _ from 'lodash';
import {
  AppException,
  BaseAbstract,
  Pagination,
  QueryParser,
  Utils,
} from 'mpr/core/shared';
import * as mongoose from 'mongoose';

export class BaseService extends BaseAbstract {
  constructor(protected model: any) {
    super();
    this.modelName = model.collection.collectionName;
    this.entity = model;

    if (!this?.entity?.config) {
      this.entity.config = { ...this.defaultConfig };
    } else {
      if (this.entity.config instanceof Function) {
        this.entity.config = Object.assign(
          this.defaultConfig,
          this.entity.config(),
        );
      } else {
        this.entity.routes = Object.assign(this.routes, this.entity.routes);
        this.entity.config = Object.assign(
          this.defaultConfig,
          this.entity.config,
        );
      }
    }
  }
  /**
   * @param {Object} obj The payload object
   * @param {Object} session The payload object
   * @return {Object}
   */
  public async createNewObject(obj, session?) {
    const tofill = this.entity.config.fillables;
    let payload = { ...obj };

    if (tofill && tofill.length > 0) {
      payload = _.pick(obj, ...tofill);
    }
    if (obj.userId) {
      payload.user = obj.userId;
    }
    if (obj.vendor) {
      payload.vendor = obj.vendor;
    }
    const data = new this.model({
      ...payload,
      publicId: Utils.generateUniqueId(this.defaultConfig.idToken),
    });
    return data.save();
  }

  public getIdCondition(id) {
    const condition: any = {
      deleted: false,
    };
    if (Utils.IsObjectId(id)) {
      condition['_id'] = id;
    } else {
      condition['publicId'] = id;
    }
    return condition;
  }

  /**
   * @param {Object} id The payload object
   * @param {Object} obj The payload object
   * @return {Object}
   */
  public async updateObject(id, obj) {
    try {
      const tofill = this.entity.config.updateFillables;
      if (tofill && tofill.length > 0) {
        obj = _.pick(obj, ...tofill);
      }
      const condition = this.getIdCondition(id);
      return this.model.findOneAndUpdate(
        { ...condition },
        {
          ...obj,
        },
        { new: true },
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {Object} current The payload object
   * @param {Object} obj The payload object
   * @return {Object}
   */
  public async patchUpdate(current, obj) {
    const tofill = this.entity.config.updateFillables;
    if (tofill && tofill.length > 0) {
      obj = _.pick(obj, ...tofill);
    }
    _.extend(current, obj);
    return current.save();
  }

  /**
   * @param {String} id The payload object
   * @param {QueryParser} options The payload object
   * @return {Object}
   */
  public async findObject(id, options: any = {}) {
    try {
      const condition = this.getIdCondition(id);
      const object = await this.model
        .findOne(condition)
        .populate(options.population || []);
      if (!object) {
        throw AppException.NOT_FOUND('Data not found');
      }
      return object;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {Object} object The payload object
   * @return {Object}
   */
  public async deleteObject(object) {
    if (this.entity.config.softDelete) {
      _.extend(object, { deleted: true });
      object = await object.save();
    } else {
      object = await object.remove();
    }
    if (!object) {
      throw AppException.NOT_FOUND;
    }
    return object;
  }

  /**
   * @param {Object} qParser
   * @return {Object}
   */
  async customQuery(qParser = null) {
    const queryParser = await this.defaultFilters(qParser);
    const obj = queryParser.query;
    const query = [];
    if (!_.isEmpty(obj)) {
      query.push({
        $match: {
          ...queryParser.query,
        },
      });
    }
    if (
      queryParser.search &&
      this.entity.searchQuery &&
      this.entity.searchQuery(queryParser.search).length > 0
    ) {
      const searchQuery = this.entity.searchQuery(queryParser.search);
      query.push({
        $match: {
          $or: [...searchQuery],
        },
      });
    }
    return query;
  }

  /**
   * @param {Pagination} pagination The pagination object
   * @param {QueryParser} qParser The query parser
   * @return {Object}
   */
  async buildModelQueryObject(
    pagination: Pagination,
    qParser: QueryParser = null,
  ) {
    const queryParser = await this.defaultFilters(qParser);
    let query = this.model.find(queryParser.query);
    if (
      queryParser.search &&
      this.entity.searchQuery &&
      this.entity.searchQuery(queryParser.search).length > 0
    ) {
      const searchQuery = this.entity.searchQuery(queryParser.search);
      queryParser.query = {
        $or: [...searchQuery],
        ...queryParser.query,
      };
      query = this.model.find({ ...queryParser.query });
    }
    if (!queryParser.getAll) {
      query = query.skip(pagination.skip).limit(pagination.perPage);
    }
    query = query.sort(
      queryParser && queryParser.sort
        ? Object.assign(queryParser.sort, { createdAt: -1 })
        : '-createdAt',
    );
    return {
      value: await query.select(queryParser.selection).exec(),
      count: await this.model.countDocuments(queryParser.query).exec(),
    };
  }
  /**
   * @param {Object} queryParser The query parser
   * @return {Object}
   */
  public async buildSearchQuery(queryParser = null) {
    return _.omit(queryParser.query, ['deleted']);
  }

  /**
   * @param {Object} query The query object
   * @return {Promise<Object>}
   */
  public async countQueryDocuments(query) {
    let count = await this.model.aggregate(query.concat([{ $count: 'total' }]));
    count = count[0] ? count[0].total : 0;
    return count;
  }

  /**
   * @param {Object} pagination The pagination object
   * @param {Object} query The query
   * @param {Object} queryParser The query parser
   * @return {Object}
   */
  public async buildModelAggregateQueryObject(
    pagination,
    query,
    queryParser = null,
  ) {
    query = await this.customQuery(queryParser);
    const count = await this.countQueryDocuments(query);
    query.push({
      $sort: queryParser.sort
        ? Object.assign({}, { ...queryParser.sort, createdAt: -1 })
        : { createdAt: -1 },
    });
    if (!queryParser.getAll) {
      query.push(
        {
          $skip: pagination.skip,
        },
        {
          $limit: pagination.perPage,
        },
      );
    }
    return {
      value: await this.model
        .aggregate(query)
        .collation({ locale: 'en', strength: 1 }),
      count,
    };
  }

  /**
   * @param {Object} obj The request object
   * @return {Promise<Object>}
   */
  public async retrieveExistingResource(obj) {
    if (obj.user?._id) obj.user = obj.user?._id;
    const query = {};
    if (this.entity.config.uniques) {
      const uniqueKeys = this.entity.config.uniques;
      for (const key of uniqueKeys) {
        query[key] = obj[key];
      }
    }
    const found = !_.isEmpty(query)
      ? await this.model.findOne({
          ...query,
          deleted: false,
        })
      : false;
    if (found) {
      return found;
    }
    return null;
  }

  /**
   * @param {String} payLoad The payload object
   * @return {Object}
   */
  public async validateObject(payLoad) {
    const moreCondition = { deleted: false };
    const condition: any = {
      $or: [{ publicId: payLoad.id }, { _id: payLoad.id }],
      ...moreCondition,
    };
    return this.model.findOne(condition);
  }

  /**
   * @param {QueryParser} query The query object
   * @return {Object}
   */

  public async searchOneObject(query: Record<string, any>) {
    const queryParams = _.omit(query, ['latest']);
    const queryToExec = this.model.findOne({ ...queryParams });
    if (query.latest) {
      try {
        const latestQuery = JSON.parse(query.latest);
        queryToExec.sort({ ...latestQuery });
      } catch (e) {}
    }
    return queryToExec.exec();
  }

  /**
   * @param {Object} key The unique key
   * @param {Object} params The request param
   * @return {Array}
   */
  public async findByUniqueKey(key, params = {}) {
    return this.model.distinct(key, {
      ...params,
      deleted: false,
    });
  }

  public async defaultFilters(queryParser) {
    let dateFilters: Array<string> = this?.entity?.config?.dateFilters || [];
    dateFilters = ['createdAt', 'updatedAt', ...dateFilters];
    if (dateFilters && dateFilters.length > 0) {
      dateFilters.forEach((key: string) => {
        if (queryParser.query[key]) {
          queryParser.query[key] = Utils.generateDateRange(
            queryParser.query[key],
          );
        }
      });
    }

    const conditions: Array<string> = ['gt', 'gte', 'lt', 'lte'];
    for (const c of conditions) {
      if (queryParser[c]) {
        // Using Conditionals for filtering values
        for (const [key, value] of Object.entries(queryParser[c])) {
          queryParser.query[key] = !queryParser.query[key] // when doesn't exist
            ? { [`$${c}`]: value } // add new
            : { ...queryParser.query[key], [`$${c}`]: value }; // else find range
        }
      }
    }

    if (queryParser.btw) {
      // Using Between to filter range of values
      for (const [key, value] of Object.entries(queryParser.btw)) {
        queryParser.query[key] = { $gte: value[0], $lte: value[1] };
      }
    }

    let booleanFields = this?.entity?.config?.booleanFields || [];
    booleanFields = ['active', 'deleted', ...booleanFields];
    for (const key of booleanFields) {
      if (queryParser.query[key]) {
        queryParser.query[key] = Utils.checkBooleanValue(
          queryParser.query[key],
        );
      }
    }

    let objectIds: Array<string> = this?.entity?.config?.objectIds || [];
    objectIds = ['_id', ...objectIds];
    if (objectIds) {
      for (const key of objectIds) {
        if (
          queryParser.query[key] &&
          mongoose.isValidObjectId(queryParser.query[key])
        ) {
          queryParser.query[key] = new mongoose.Types.ObjectId(
            String(queryParser.query[key]),
          );
        }
      }
    }

    let arrayFilters: Array<string> = this?.entity?.config?.arrayFilters || [];
    arrayFilters = ['status', '_id', ...arrayFilters];
    if (arrayFilters && arrayFilters?.length) {
      let objectIds: Array<string> = this?.entity?.config?.objectIds || [];
      objectIds = ['_id', ...objectIds];
      for (const key of arrayFilters) {
        if (queryParser.query[key]) {
          let value = queryParser.query[key];
          try {
            value = JSON.parse(queryParser.query[key]);
          } catch (e) {}
          if (Array.isArray(value)) {
            const inArray = !objectIds.includes(key)
              ? [...value]
              : value.map((v) => new mongoose.Types.ObjectId(String(v)));
            queryParser.query[key] = { $in: [...inArray] };
          }
        }
      }
    }
    return queryParser;
  }

  async incrementId(model, entity, unique, session?) {
    const { seq } = await model.findOneAndUpdate(
      { entity, unique },
      {
        $setOnInsert: {
          unique,
          entity,
        },
        $inc: { seq: 1 },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        session,
      },
    );
    return seq;
  }

  /**
   * @param {Object} payload request body with ids
   */
  async deleteMany(payload) {
    try {
      const { ids } = payload;
      const deleted = [];
      if (ids?.length) {
        const objects = await this.model.find({
          _id: { $in: [...ids] },
          deleted: false,
        });
        const isSoftDelete = this.entity.config.softDelete;
        for (let object of objects) {
          if (isSoftDelete) {
            _.extend(object, { deleted: true });
            object = await object.save();
          } else {
            object = await object.remove();
          }
          deleted.push(object._id);
        }
      }
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}
