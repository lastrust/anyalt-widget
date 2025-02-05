import { FC } from 'react';
import { ExecuteResponse, Token, WalletConnector } from '../../..';
import { TransactionInfo } from '../transaction/TransactionInfo';

type Props = {
  externalEvmWalletConnector?: WalletConnector;
  onTxComplete: () => void;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
};

export const TransactionSwap: FC<Props> = ({
  executeCallBack,
  onTxComplete,
  externalEvmWalletConnector,
}) => {
  return (
    <TransactionInfo
      externalEvmWalletConnector={externalEvmWalletConnector}
      executeCallBack={executeCallBack}
      onTxComplete={onTxComplete}
    />
  );
};
