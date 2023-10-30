import { Controller, HttpCode, HttpStatus, Post, Next,Body,Res, Req, Patch, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import { TeamService } from '../service/team.service';
import { AppController } from '../../_shared';
import { CreateTeamDto, UpdateTeamDto } from 'mpr/core/shared/dto';

@Controller('teams')
export class TeamController extends AppController {
  constructor(protected service: TeamService, protected config: ConfigService) {
    super(config, service);
  }
  
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() payload: CreateTeamDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    return super.create(payload, res, req, next);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() payload: UpdateTeamDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    return super.patch(id, payload, req, res, next);
  }
}
