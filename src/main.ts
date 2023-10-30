import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as morgan from 'morgan';
import { ResponseFilter, ValidationPipe } from 'mpr/core/shared';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
    logger:
      process.env.NODE_ENV === 'development'
        ? ['debug']
        : ['error', 'warn', 'debug'],
  });
  app.use(morgan('tiny'));
  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new ResponseFilter());
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService);

  app.enableShutdownHooks();
  const port = config.get(`app.port`);
  console.log('port ::: ', port);
  await app.listen(port, () =>
    Logger.debug(`Api Service is listening at port ${port} ...`),
  );
}

bootstrap();
