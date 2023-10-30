import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Next,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AppService } from './app.service';
import { SeedService } from './_shared/seed';
import {
  PusherService,
} from 'mpr/core';
import { Transport, RedisOptions } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private service: AppService,
    private seedService: SeedService,
    private health: HealthCheckService,
    private m_service: MicroserviceHealthIndicator,
    private mongoService: MongooseHealthIndicator,
    private typeOrmService: TypeOrmHealthIndicator,
    private config: ConfigService,
    @InjectConnection()
    private readonly connection: Connection,
    private pusherService: PusherService,
  ) {}

  @Get('/pusher')
  public async pusherTest(@Res() res, @Req() req, @Next() next: NextFunction) {
    try {
      await this.pusherService
        .instance()
        .trigger('notifications', 'notifications.get', {
          hello: 'world',
        });
      return res.status(HttpStatus.OK).json({ pusher: true });
    } catch (error) {
      throw error;
    }
  }

  @Get('/ping')
  @HealthCheck()
  checkService() {
    const redis = new URL(this.config.get('app.redis.url'));
    return this.health.check([
      () =>
        Promise.resolve<HealthIndicatorResult>({
          api: {
            app: `${this.config.get('app.appName')}-api`,
            status: 'up',
            environment: this.config.get('app.environment'),
          },
        }),
      () =>
        this.mongoService.pingCheck('mongoDB', {
          connection: this.connection,
        }),
      () =>
        this.m_service.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: {
            host: redis.hostname,
            username: redis.username,
            password: redis.password,
            port: Number(redis.port),
          },
        }),
    ]);
  }

}
