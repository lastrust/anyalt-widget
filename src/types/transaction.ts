export interface TransactionStepType {
  stepNumber: number;
  exchangeIcon?: string;
  exchangeName: string;
  fromToken: {
    name: string;
    amount: string;
  };
  toToken: {
    name: string;
    amount: string;
  };
}

export type TransactionStatus =
  | 'pending'
  | 'signing'
  | 'broadcasting'
  | 'confirmed'
  | 'failed'
  | 'stuck';

export interface TransactionProgressDetails {
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
}

export interface TransactionProgress {
  status: TransactionStatus;
  message: string;
  isApproval: boolean;
  chainName?: string;
  txHash?: string;
  error?: string;
  details: TransactionProgressDetails;
}

export interface TransactionGroup {
  approve?: TransactionProgress;
  swap?: TransactionProgress;
}

export type TransactionStatusList = {
  steps?: {
    from: {
      tokenName: string;
      tokenLogo: string;
      tokenAmount: string;
      tokenPrice: string;
      tokenUsdPrice: string;
      tokenDecimals: number;
      blockchain: string;
      blockchainLogo: string;
    };
    to: {
      tokenName: string;
      tokenLogo: string;
      tokenAmount: string;
      tokenPrice: string;
      tokenUsdPrice: string;
      tokenDecimals: number;
      blockchain: string;
      blockchainLogo: string;
    };
  }[];
};

export interface TransactionsProgress {
  [key: number | string]: TransactionGroup;
}

export class TransactionError extends Error {
  constructor(
    message: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}
