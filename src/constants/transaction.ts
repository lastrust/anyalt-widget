import { TransactionStatus } from '../types/transaction';

export const TX_MESSAGE = {
  signing: 'Please sign the transaction in your wallet...',
  broadcasting: 'Broadcasting transaction...',
  pending: 'Waiting for confirmation on source and destination chains...',
  confirmed: 'Transaction confirmed successfully!',
  failed: 'Transaction failed',
};

export const TX_STATUS: Record<string, TransactionStatus> = {
  signing: 'signing',
  broadcasting: 'broadcasting',
  pending: 'pending',
  confirmed: 'confirmed',
  failed: 'failed',
};

export const STEP_DESCR = {
  pending: 'pending',
  approval: 'approval',
  swap: 'swap',
  complete: 'complete',
  failed: 'failed',
};

export const REFRESH_INTERVAL = 30000;
export const DEBOUNCE_TIMEOUT = 600;
