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
