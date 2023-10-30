import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { BaseService, Fixture, FixtureDocument } from 'mpr/core';

@Injectable()
export class FixtureService extends BaseService {
  public routes = {
    create: true,
    findOne: true,
    find: true,
    update: false,
    patch: false,
    remove: true,
  };
  constructor(
    @InjectModel(Fixture.name) protected model: Model<FixtureDocument>,
    protected config: ConfigService,
  ) {
    super(model);
  }
}
