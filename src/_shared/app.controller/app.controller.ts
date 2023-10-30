import { BaseController } from 'mpr/core/base';
import {
  Body,
  HttpCode,
  HttpStatus,
  Next,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NextFunction } from 'express';
// import { JwtAuthGuard } from 'mpr/core';

export class AppController extends BaseController {
  @Post('/')
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() payload: any,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    return super.create(payload, res, req, next);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  public async patch(
    @Param('id') id: string,
    @Body() payload: any,
    @Req() req,
    @Res() res,
    @Next() next: NextFunction,
  ) {
    return super.patch(id, payload, req, res, next);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() payload: any,
    @Req() req,
    @Res() res,
    @Next() next: NextFunction,
  ) {
    return super.update(id, payload, req, res, next);
  }
}
