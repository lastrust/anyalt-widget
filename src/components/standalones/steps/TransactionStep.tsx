import { ExecuteResponse, Token, WalletConnector } from '../../..';
import { SwappingWrapper } from '../wrappers/SwappingWrapper';
import { TransactionSwap } from '../wrappers/TransactionSwap';

type Props = {
  onConfigClick: () => void;
  walletConnector?: WalletConnector;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
  onTxComplete: () => void;
};

export const TransactionStep = ({
  onConfigClick,
  walletConnector,
  executeCallBack,
  onTxComplete,
}: Props) => {
  return (
    <SwappingWrapper onConfigClick={onConfigClick}>
      <TransactionSwap
        externalEvmWalletConnector={walletConnector}
        executeCallBack={executeCallBack}
        onTxComplete={onTxComplete}
      />
    </SwappingWrapper>
  );
};
