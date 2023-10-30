import { Controller, HttpCode, HttpStatus, Post, Next,Body,Res, Req} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import { FixtureService } from '../service/fixture.service';
import { AppController } from '../../_shared';
import { CreateFixtureDto } from 'mpr/core/shared/dto';

@Controller('fixtures')
export class FixtureController extends AppController {
  constructor(protected service: FixtureService, protected config: ConfigService) {
    super(config, service);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() payload: CreateFixtureDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    return super.create(payload, res, req, next);
  }
}
