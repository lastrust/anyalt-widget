import { Grid } from '@chakra-ui/react';
import { TransactionDetails } from '../transaction/TransactionDetails';
import { TransactionStatus } from '../transaction/TransactionStatus';

export const TransactionSwap = () => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <TransactionDetails />
      <TransactionStatus />
    </Grid>
  );
};
