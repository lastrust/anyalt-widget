import { Grid } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { ExecuteResponse, Token, WalletConnector } from '../../..';
import { currentStepAtom } from '../../../store/stateStore';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { TransactionInfo } from '../transaction/TransactionInfo';
import { TransactionStatus } from '../transaction/TransactionStatus';

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
      <SwappingTemplate title={`Transaction ${currentStep}`}>
        <TransactionInfo
          externalEvmWalletConnector={walletConnector}
          executeCallBack={executeCallBack}
          onTxComplete={onTxComplete}
        />
      </SwappingTemplate>
      <SwappingTemplate>
        <TransactionStatus />
      </SwappingTemplate>
    </Grid>
  );
};
