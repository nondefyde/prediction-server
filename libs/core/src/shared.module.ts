import { Logger, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Queues } from 'mpr/core/shared';

const queues = [
  BullModule.forRootAsync({
    useFactory: (config: ConfigService) => {
      const redis = new URL(config.get('app.redis.url'));
      const prefix = `${config.get('app.appName')}_${config.get(
        'app.environment',
      )}`;
      Logger.debug(`redis_prefix >>> ${prefix}`);
      return {
        prefix,
        connection: {
          host: redis.hostname,
          username: redis.username,
          password: redis.password,
          port: Number(redis.port),
        },
      };
    },
    inject: [ConfigService],
  }),
  BullModule.registerQueue({
    name: Queues.API,
  }),
  BullModule.registerQueue({
    name: Queues.MPR_TASK,
  }),
];
@Module({
  imports: [...queues],
  providers: [],
  exports: [...queues],
})
export class SharedModule {}
