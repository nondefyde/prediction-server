import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { BaseService, Team, TeamDocument } from 'mpr/core';

@Injectable()
export class TeamService extends BaseService {
  
  constructor(
    @InjectModel(Team.name) protected model: Model<TeamDocument>,
    protected config: ConfigService,
  ) {
    super(model);
  }
}
