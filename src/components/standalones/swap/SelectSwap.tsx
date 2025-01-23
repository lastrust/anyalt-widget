import { Divider, Flex } from '@chakra-ui/react';
import { SlippageModal } from '../modals/SlippageModal';
import { TokenInputBox } from '../token/input/TokenInputBox';
import { TokenQuoteBox } from '../token/quote/TokenQuoteBox';
import { TokenSelectBox } from '../token/select/TokenSelectBox';
import { useSelectSwap } from './useSelectSwap';

type Props = {
  loading: boolean;
  openSlippageModal: boolean;
  setOpenSlippageModal: (open: boolean) => void;
};

export const SelectSwap = ({
  loading,
  openSlippageModal,
  setOpenSlippageModal,
}: Props) => {
  const {
    finalTokenEstimate,
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    openTokenSelect,
    setOpenTokenSelect,
    protocolInputToken,
    protocolFinalToken,
    activeRoute,
  } = useSelectSwap();

  return (
    <Flex flexDirection="column" gap="16px" mb="16px">
      <TokenInputBox
        openTokenSelectModal={() => setOpenTokenSelect(true)}
        loading={loading}
        price={inTokenPrice}
      />
      <TokenQuoteBox
        loading={loading}
        headerText="Vault Is Expecting"
        tokenName={protocolInputToken?.symbol ?? ''}
        tokenLogo={protocolInputToken?.logoUrl ?? ''}
        chainName={protocolInputToken?.chain?.displayName ?? ''}
        chainLogo={protocolInputToken?.chain?.logoUrl ?? ''}
        amount={parseFloat(activeRoute?.outputAmount ?? '0').toFixed(2)}
        price={outTokenPrice}
      />
      <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
      <TokenQuoteBox
        loading={loading}
        headerText="What You Are Getting"
        tokenName={protocolFinalToken?.symbol ?? ''}
        tokenLogo={protocolFinalToken?.logoUrl ?? ''}
        chainName={protocolInputToken?.chain?.displayName ?? ''}
        chainLogo={protocolInputToken?.chain?.logoUrl ?? ''}
        amount={finalTokenEstimate?.amountOut ?? ''}
        price={finalTokenEstimate?.priceInUSD ?? ''}
      />
      {openTokenSelect && (
        <TokenSelectBox
          onClose={() => setOpenTokenSelect(false)}
          onTokenSelect={onTokenSelect}
        />
      )}
      {openSlippageModal && (
        <SlippageModal onClose={() => setOpenSlippageModal(false)} />
      )}
    </Flex>
  );
};
