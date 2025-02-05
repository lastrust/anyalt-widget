import { Grid } from '@chakra-ui/react';
import { ExecuteResponse, Token, WalletConnector } from '../../..';
import { TransactionStatus } from '../transaction/TransactionStatus';
import { SwappingWrapper } from '../wrappers/SwappingWrapper';
import { TransactionSwap } from '../wrappers/TransactionSwap';

type Props = {
  walletConnector?: WalletConnector;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
  onTxComplete: () => void;
};

export const TransactionStep = ({
  walletConnector,
  executeCallBack,
  onTxComplete,
}: Props) => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <SwappingWrapper title="Step 1">
        <TransactionSwap
          externalEvmWalletConnector={walletConnector}
          executeCallBack={executeCallBack}
          onTxComplete={onTxComplete}
        />
      </SwappingWrapper>
      <SwappingWrapper>
        <TransactionStatus />
      </SwappingWrapper>
    </Grid>
  );
};
