import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { TokenQuoteBox } from '../../selectSwap/token/quote/TokenQuoteBox';
import { SepartionBlock } from './TransactionInfo';

type Props = {
  selectedRoute: GetAllRoutesResponseItem | undefined;
  inTokenAmount: string | undefined;
};

export const OnrampTransaction = ({ selectedRoute, inTokenAmount }: Props) => {
  return (
    <>
      <TokenQuoteBox
        loading={false}
        headerText=""
        tokenName={selectedRoute?.fiatStep?.fiat.code || ''}
        tokenLogo={selectedRoute?.fiatStep?.fiat.logo || ''}
        chainName={selectedRoute?.fiatStep?.fiat.name}
        chainLogo={''}
        amount={inTokenAmount || ''}
        price={inTokenAmount || ''}
        w={'100%'}
        p={'0'}
        m={'0'}
      />
      <SepartionBlock />
      <TokenQuoteBox
        loading={false}
        headerText=""
        tokenName={selectedRoute?.fiatStep?.middleToken.name || ''}
        tokenLogo={selectedRoute?.fiatStep?.middleToken.logoUrl || ''}
        chainName={selectedRoute?.fiatStep?.middleToken.chainName || ''}
        chainLogo={selectedRoute?.fiatStep?.middleToken.chain?.logoUrl || ''}
        amount={truncateToDecimals(selectedRoute?.fiatStep?.payout || '', 4)}
        price={truncateToDecimals(selectedRoute?.outputAmount || '', 4)}
        w={'100%'}
        p={'0'}
        m={'0'}
      />
    </>
  );
};
