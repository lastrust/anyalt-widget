import { SupportedToken } from '@anyalt/sdk';
import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { TransactionListToken } from '../../../../types/transaction';
import { TokenQuoteBox } from '../../selectSwap/token/quote/TokenQuoteBox';

type FromTokenProps = {
  selectedRoute: GetAllRoutesResponseItem | undefined;
  recentTransactionItem: TransactionListToken | undefined;
  protocolInputToken: SupportedToken | undefined;
  tokenName: string;
  tokenLogo: string;
  amount: string;
  price: string;
};

export const TokenBox = ({
  selectedRoute,
  recentTransactionItem,
  protocolInputToken,
  tokenName,
  tokenLogo,
  amount,
  price,
}: FromTokenProps) => {
  return (
    selectedRoute?.swapSteps &&
    (selectedRoute?.swapSteps?.length > 0 ? (
      <TokenQuoteBox
        loading={false}
        headerText=""
        tokenName={recentTransactionItem?.tokenName || ''}
        tokenLogo={recentTransactionItem?.tokenLogo || ''}
        chainName={recentTransactionItem?.blockchain || ''}
        chainLogo={recentTransactionItem?.blockchainLogo || ''}
        amount={Number(recentTransactionItem?.tokenAmount).toFixed(5)}
        price={(
          Number(recentTransactionItem?.tokenUsdPrice) *
          Number(recentTransactionItem?.tokenAmount)
        ).toFixed(2)}
        w={'100%'}
        p={'0'}
        m={'0'}
      />
    ) : (
      <TokenQuoteBox
        loading={false}
        headerText=""
        tokenName={tokenName}
        tokenLogo={tokenLogo}
        chainName={protocolInputToken?.chain?.displayName || ''}
        chainLogo={protocolInputToken?.chain?.logoUrl || ''}
        amount={amount}
        price={price}
        w={'100%'}
        p={'0'}
        m={'0'}
      />
    ))
  );
};
