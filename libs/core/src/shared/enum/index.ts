export enum QueueTasks {
  UPLOAD_PHOTO = 'task.upload.photo',
  SEND_EMAIL = 'task.send.email',
  SEND_SMS = 'task.send.sms',
  SEND_NOTIFICATION = 'task.send.notification',
  PING = 'task.send.ping',
  INVENTORY = 'task.send.inventory',
  MENU = 'task.send.menu',
}

export enum Queues {
  API = 'mpr.queue.api',
  MPR_TASK = 'mpr.queue.task',
}

export enum InventoryTasks {
  QUANTITY = 'inventory.task.quantity',
}

export enum MenuTasks {
  STATUS = 'menu.task.status',
}

export enum WorkerQueue {
  PROCESS_WORK = 'mpr.jobs.process.work',
}

export enum BusinessCategory {
  RESTAURANT = 'restaurant',
  HOTEL = 'hotel',
  FAST_FOOD = 'fast-food',
  PRIVATE_KITCHEN = 'private-kitchen',
  OTHERS = 'others',
}

export enum SalesPattern {
  SCHEDULED = 'scheduled',
  SAME_DAY_DELIVERY = 'same-day',
  BOTH = 'both',
}

export enum SenderType {
  Customer = 'customer',
  Vendor = 'vendor',
}
