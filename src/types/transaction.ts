export interface TransactionDetailsType {
  requestId: string;
  gasPrice: string;
  time: string;
  profit: string;
  swapperLogo: string;
  swapperName: string;
  swapperType: 'BRIDGE' | 'DEX' | 'AGGREGATOR' | 'OFF_CHAIN';
  swapChainType: 'INTER_CHAIN' | 'INTRA_CHAIN';
  fromAmount: string;
  toAmount: string;
  requiredSings: number;
  from: {
    name: string;
    icon?: string;
    amount: string;
    usdAmount: string;
    chainName?: string;
    chainIcon?: string;
  };
  to: {
    name: string;
    icon?: string;
    amount: string;
    usdAmount: string;
    chainName?: string;
    chainIcon?: string;
  };
  status: 'Pending' | 'Completed' | 'Failed';
}

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
  | 'failed';

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

export interface StepProgress {
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

export interface StepsProgress {
  steps: StepProgress[];
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
