export * from './common';
export * from './enum';
export * from './exceptions';
export * from './filters';
export * from './interfaces';
export * from './pipes';
export * from './utils';
export * from './middlewares';
export * from './abstracts';
export * from './dto';
export * from './jobs';

export const CUSTOMER = 'customer';
export const VENDOR = 'vendor';

// Transaction status
export const INITIATED = 'initiated';
export const SUCCESS = 'success';
export const FAILED = 'failed';
export const ABANDONED = 'abandoned';
export const REJECTED = 'rejected';

export const PAYSTACK = 'paystack';

export const INCART = 'in-cart';
export const PENDING = 'pending';
export const PROCESSING = 'processing';
export const READY = 'ready';
export const COMPLETED = 'completed';
export const CANCELLED = 'cancelled';
export const DUPLICATE = 'duplicate';
export const ARCHIVED = 'archived';

export const BASE_URL = 'https://chv-main-store.chowville.app';

export const BANK_DEPOSIT = 'bank-deposit';
export const BANK_TRANSFER = 'bank-transfer';
export const ACTIVE = 'active';
export const INACTIVE = 'inactive';

export const TransactionStatus = {
  Initiated: 'initiated',
  Success: 'success',
  Failed: 'failed',
  Abandoned: 'abandoned',
  Rejected: 'rejected',
};
