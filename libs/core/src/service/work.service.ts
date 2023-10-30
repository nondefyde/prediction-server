import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BasicJob,
  EmailJob,
  MailOption,
  Queues,
  QueueTasks,
  SmsJob,
  SmsOption,
} from 'mpr/core';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
@Injectable()
export class WorkService {
  constructor(
    private readonly config: ConfigService,
    @InjectQueue(Queues.API) private readonly apiQueue: Queue,
    @InjectQueue(Queues.MPR_TASK) private readonly taskQueue: Queue,
  ) {}

  queueToSendEmail(option: MailOption) {
    const emailJob = new EmailJob()
      .setFrom(option.fromEmail)
      .setTo(option.emailName)
      .setSubject(option.subject)
      .setTemplate(option.template)
      .setContent(option.content);
    if (this.config.get('app.environment') !== 'test') {
      this.addJob(QueueTasks.SEND_EMAIL, emailJob);
    }
  }

  queueToSendSms(option: SmsOption) {
    const job = new SmsJob()
      .setFrom(option.from)
      .setTo(option.mobile)
      .setTemplate(option.template)
      .setContent(option.content);
    if (this.config.get('app.environment') !== 'test') {
      this.addJob(QueueTasks.SEND_SMS, job);
    }
  }

  handleQueuedJob(taskKey: QueueTasks, payload: any) {
    const job = new BasicJob();
    job.setData(payload);
    if (this.config.get('app.environment') !== 'test') {
      this.addJob(taskKey, job, { isTask: true });
    }
  }

  addJob(key: QueueTasks, job: any, options: Record<string, any> = {}) {
    const defaultBroker = this.config.get('app.defaultMessageBroker');
    Logger.debug(
      `${defaultBroker} job - ${key} - :: ${JSON.stringify(
        job,
      )} - options ${JSON.stringify(options)}`,
    );
    if (defaultBroker === 'redis') {
      const { isTask = false, ...rest } = options;
      const queueOption = {
        ...rest,
        removeOnComplete: 50,
        removeOnFail: 1000,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 10000,
        },
      };
      if (!isTask) {
        this.apiQueue.add(key, job, queueOption);
      } else {
        this.taskQueue.add(key, job, queueOption);
      }
    } else {
      // Todo any other message broker integration
    }
  }
}
