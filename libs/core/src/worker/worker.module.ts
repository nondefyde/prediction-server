import { Module } from '@nestjs/common';
import { WorkService } from 'mpr/core/service';
import { SharedModule } from 'mpr/core/shared.module';

@Module({
  imports: [SharedModule],
  providers: [WorkService],
  exports: [WorkService],
})
export class WorkerModule {}
