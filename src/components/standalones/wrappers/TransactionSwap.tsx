import { Grid } from '@chakra-ui/react';
import { useState } from 'react';
import { TransactionDetails } from '../transaction/TransactionDetails';
import { TransactionStatus } from '../transaction/TransactionStatus';

export const TransactionSwap = () => {
  //TODO: David, please use this to controll which step is on going
  const [swapIndex] = useState(0);
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <TransactionDetails swapIndex={swapIndex} />
      <TransactionStatus swapIndex={swapIndex} />
    </Grid>
  );
};
