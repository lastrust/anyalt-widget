import {
  GetAllRoutesResponseItem,
  SupportedToken,
} from '@anyalt/sdk/dist/adapter/api/api';
import { EstimateResponse, Token } from '../../../..';
import { TransactionListGroup } from '../../../../types/transaction';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { TokenBox } from './TokenBox';
import { SepartionBlock } from './TransactionInfo';

type Props = {
  selectedRoute: GetAllRoutesResponseItem | undefined;
  recentTransaction: TransactionListGroup | undefined;
  protocolInputToken: SupportedToken | undefined;
  protocolFinalToken: Token | undefined;
  finalTokenEstimate: EstimateResponse | undefined;
  inTokenAmount: string | undefined;
};

export const TokenTransaction = ({
  selectedRoute,
  recentTransaction,
  protocolInputToken,
  protocolFinalToken,
  finalTokenEstimate,
  inTokenAmount,
}: Props) => {
  return (
    <>
      <TokenBox
        selectedRoute={selectedRoute}
        recentTransactionItem={recentTransaction?.from}
        protocolInputToken={protocolInputToken}
        tokenName={protocolInputToken?.symbol || ''}
        tokenLogo={protocolInputToken?.logoUrl || ''}
        amount={Number(inTokenAmount ?? 0).toFixed(4)}
        price={'0.00'}
      />
      <SepartionBlock />
      <TokenBox
        selectedRoute={selectedRoute}
        recentTransactionItem={recentTransaction?.to}
        protocolInputToken={protocolInputToken}
        tokenName={protocolFinalToken?.symbol || ''}
        tokenLogo={protocolFinalToken?.logoUrl || ''}
        amount={truncateToDecimals(finalTokenEstimate?.amountOut || '', 4)}
        price={finalTokenEstimate?.priceInUSD || '0.00'}
      />
    </>
  );
};
