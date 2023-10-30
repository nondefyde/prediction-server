import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '@config';
import { CoreModule, PusherService } from 'mpr/core';
import { ApiMiddleware } from 'mpr/core/shared';
import { TeamModule } from './team';
import { FixtureModule } from './fixture';
import { AppService } from './app.service';
import { SeedService } from './_shared/seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['_env/api/.env.local', '_env/.env'],
      load: [configuration],
    }),
    CoreModule,
    TerminusModule,
    TeamModule,
    FixtureModule
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, PusherService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ApiMiddleware).forRoutes('*');
  }
}
