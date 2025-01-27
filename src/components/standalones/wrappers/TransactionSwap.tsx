import { Grid } from '@chakra-ui/react';
import { FC } from 'react';
import { ExecuteResponse } from '../../..';
import { TransactionInfo } from '../transaction/TransactionInfo';
import { TransactionStatus } from '../transaction/TransactionStatus';

type Props = {
  executeCallBack: (amountIn: number) => Promise<ExecuteResponse>;
  onTxComplete: () => void;
};

export const TransactionSwap: FC<Props> = ({
  executeCallBack,
  onTxComplete,
}) => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <TransactionInfo
        executeCallBack={executeCallBack}
        onTxComplete={onTxComplete}
      />
      <TransactionStatus />
    </Grid>
  );
};
