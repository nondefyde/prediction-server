import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixtureService } from './service/fixture.service';
import { Fixture, FixtureSchema } from 'mpr/core/models';
import { FixtureController } from './controller/fixture.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fixture.name, schema: FixtureSchema }]),
  ],
  controllers: [FixtureController],
  providers: [FixtureService],
  exports: [FixtureService],
})
export class FixtureModule {}
