import { Grid } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { ExecuteResponse, Token, WalletConnector } from '../../..';
import { currentStepAtom } from '../../../store/stateStore';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { TransactionInfo } from '../transaction/info/TransactionInfo';
import { TransactionList } from '../transaction/transactionList/TransactionsList';

type Props = {
  walletConnector?: WalletConnector;
  onBackClick: () => void;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
  onTxComplete: () => void;
};

export const TransactionStep = ({
  walletConnector,
  executeCallBack,
  onBackClick,
  onTxComplete,
}: Props) => {
  const currentStep = useAtomValue(currentStepAtom);
  return (
    <Grid templateColumns="1fr 1fr" gap="16px" m="24px 0px 16px">
      <SwappingTemplate
        title={`Transaction ${currentStep}`}
        m="0"
        h="100%"
        onBackClick={onBackClick}
      >
        <TransactionInfo
          externalEvmWalletConnector={walletConnector}
          executeCallBack={executeCallBack}
          onTxComplete={onTxComplete}
        />
      </SwappingTemplate>
      <SwappingTemplate m="0" maxH={'520px'} overflow={'scroll'}>
        <TransactionList />
      </SwappingTemplate>
    </Grid>
  );
};
