import { Grid } from '@chakra-ui/react';
import { useState } from 'react';
import { TransactionInfo } from '../transaction/TransactionInfo';
import { TransactionStatus } from '../transaction/TransactionStatus';

export const TransactionSwap = () => {
  //TODO: David, please use this to controll which step is on going
  const [swapIndex, setSwapIndex] = useState(0);
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <TransactionInfo swapIndex={swapIndex} setSwapIndex={setSwapIndex} />
      <TransactionStatus swapIndex={swapIndex} />
    </Grid>
  );
};
