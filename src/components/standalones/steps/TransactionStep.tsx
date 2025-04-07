import { Grid } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../..';
import { transactionIndexAtom } from '../../../store/stateStore';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { TransactionInfo } from '../transaction/info/TransactionInfo';
import { TransactionList } from '../transaction/transactionList/TransactionsList';

type Props = {
  walletConnector?: WalletConnector;
  onBackClick: () => void;
  onTxComplete: () => void;
  confirmRoute: () => Promise<string | undefined>;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
};

export const TransactionStep = ({
  walletConnector,
  onBackClick,
  onTxComplete,
  confirmRoute,
  executeCallBack,
  estimateCallback,
}: Props) => {
  const currentStep = useAtomValue(transactionIndexAtom);

  return (
    <Grid templateColumns="1fr 1fr" gap="16px" m="24px 0px 16px">
      <SwappingTemplate
        title={`Transaction ${currentStep}`}
        m="0"
        h="100%"
        maxH={'520px'}
        overflow={'scroll'}
        onBackClick={onBackClick}
      >
        <TransactionInfo
          externalEvmWalletConnector={walletConnector}
          onTxComplete={onTxComplete}
          confirmRoute={confirmRoute}
          executeCallBack={executeCallBack}
          estimateCallback={estimateCallback}
        />
      </SwappingTemplate>
      <SwappingTemplate m="0" maxH={'520px'} overflow={'scroll'}>
        <TransactionList operationType="CURRENT" />
      </SwappingTemplate>
    </Grid>
  );
};
