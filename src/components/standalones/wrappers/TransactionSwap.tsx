import { Grid } from '@chakra-ui/react';
import { FC } from 'react';
import { ExecuteResponse, WalletConnector } from '../../..';
import { TransactionInfo } from '../transaction/TransactionInfo';
import { TransactionStatus } from '../transaction/TransactionStatus';

type Props = {
  externalEvmWalletConnector?: WalletConnector;
  onTxComplete: () => void;
  executeCallBack: (amountIn: string) => Promise<ExecuteResponse>;
};

export const TransactionSwap: FC<Props> = ({
  executeCallBack,
  onTxComplete,
  externalEvmWalletConnector,
}) => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <TransactionInfo
        externalEvmWalletConnector={externalEvmWalletConnector}
        executeCallBack={executeCallBack}
        onTxComplete={onTxComplete}
      />
      <TransactionStatus />
    </Grid>
  );
};
