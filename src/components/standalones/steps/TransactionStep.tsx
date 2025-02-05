import { Grid } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { ExecuteResponse, Token, WalletConnector } from '../../..';
import { currentStepAtom } from '../../../store/stateStore';
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
  const currentStep = useAtomValue(currentStepAtom);
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <SwappingWrapper title={`Transaction ${currentStep}`}>
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
