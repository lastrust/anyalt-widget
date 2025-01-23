import { Grid } from '@chakra-ui/react';
import { TransactionDetails } from '../transaction/TransactionDetails';
import { TransactionStatus } from '../transaction/TransactionStatus';

export type TransactionDetailsType = {
  transactionDetails: {
    requestId: string;
    gasPrice: string;
    time: string;
    profit: string;
    from: {
      name: string;
      icon: string;
      amount: string;
      usdAmount: string;
      chainName: string;
      chainIcon: string;
    };
    to: {
      name: string;
      icon: string;
      amount: string;
      usdAmount: string;
      chainName: string;
      chainIcon: string;
    };
    status: string;
  };
};

type Props = {
  exchangeName: string;
} & TransactionDetailsType;

export const SwapProgress = ({ exchangeName, transactionDetails }: Props) => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <TransactionDetails
        exchangeName={exchangeName}
        transactionDetails={transactionDetails}
      />
      <TransactionStatus
        requestId={transactionDetails.requestId}
        status={transactionDetails.status}
      />
    </Grid>
  );
};
