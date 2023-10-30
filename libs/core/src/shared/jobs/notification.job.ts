/**
 * Created by EdgeTech on 12/12/2016.
 */
import { WorkerQueue } from '../enum';
import { Job } from './job';

export class NotificationJob extends Job {
  //   public to: string;
  public template?: string;
  public headings?: any;
  public context: any;
  public sound?: any;
  public data?: any;
  public deviceId: string[];

  constructor() {
    super(WorkerQueue.PROCESS_WORK);
  }

  public setDeviceId(value: string[]) {
    this.deviceId = value;
    return this;
  }

  public setTemplate(value: string) {
    this.template = value;
    return this;
  }

  public setHeading(value: string) {
    this.headings = value;
    return this;
  }

  public setContent(context: any) {
    this.context = context;
    return this;
  }

  public setData(value: any) {
    this.data = value;
    return this;
  }
}
