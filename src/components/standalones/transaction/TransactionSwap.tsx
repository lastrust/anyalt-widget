import { Grid } from '@chakra-ui/react';
import { TransactionDetails } from './TransactionDetails';
import { TransactionStatus } from './TransactionStatus';

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

export const TransactionSwap = ({
  exchangeName,
  transactionDetails,
}: Props) => {
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
