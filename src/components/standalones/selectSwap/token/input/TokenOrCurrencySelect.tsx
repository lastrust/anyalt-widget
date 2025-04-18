import { SupportedToken } from '@anyalt/sdk';
import { SupportedFiat } from '@anyalt/sdk/dist/adapter/api/api';
import { Box, Icon } from '@chakra-ui/react';
import { useMemo } from 'react';
import { SelectTokenIcon } from '../../../../atoms/icons/selectToken/SelectTokenIcon';
import { TokenIconBox } from '../../../../molecules/TokenIconBox';
import { TokenInfoBox } from '../../../../molecules/TokenInfoBox';

const isSupportedToken = (
  token: SupportedToken | undefined,
): token is SupportedToken => {
  return token !== undefined && 'chain' in token;
};

type SelectProps = {
  selectedToken: SupportedToken | undefined;
  selectedCurrency: SupportedFiat | undefined;
  widgetMode: 'fiat' | 'crypto';
  handleCryptoModal: () => void;
  handleFiatModal: () => void;
};

export const TokenOrCurrencySelect = ({
  selectedToken,
  selectedCurrency,
  widgetMode,
  handleCryptoModal,
  handleFiatModal,
}: SelectProps) => {
  const handleSelectModal = () => {
    if (widgetMode === 'crypto') {
      handleCryptoModal();
    } else if (widgetMode === 'fiat') {
      handleFiatModal();
    }
  };

  const placeholders = useMemo(() => {
    if (widgetMode === 'crypto')
      return {
        tokenTitle: 'Select Token',
        chainTitle: 'Select Chain',
      };

    return {
      tokenTitle: 'Select Currency',
      chainTitle: '',
    };
  }, [widgetMode]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      onClick={() => handleSelectModal()}
      cursor={'pointer'}
    >
      {widgetMode === 'crypto' ? (
        <TokenIconBox
          widgetMode={widgetMode}
          tokenName={selectedToken?.symbol ?? ''}
          tokenIcon={selectedToken?.logoUrl ?? ''}
          chainName={
            isSupportedToken(selectedToken)
              ? String(selectedToken?.chain?.displayName)
              : ''
          }
          chainIcon={
            isSupportedToken(selectedToken)
              ? String(selectedToken?.chain?.logoUrl)
              : ''
          }
          mr="8px"
        />
      ) : (
        <TokenIconBox
          tokenName={selectedCurrency?.name ?? placeholders.tokenTitle}
          tokenIcon={selectedCurrency?.logo ?? ''}
          chainName={''}
          chainIcon={''}
          mr="8px"
        />
      )}
      {widgetMode === 'crypto' ? (
        <TokenInfoBox
          mr="12px"
          tokenName={selectedToken?.symbol ?? placeholders.tokenTitle}
          subText={
            isSupportedToken(selectedToken) && selectedToken?.chain?.displayName
              ? `On ${selectedToken?.chain?.displayName}`
              : placeholders.chainTitle
          }
        />
      ) : (
        <TokenInfoBox
          tokenName={selectedCurrency?.code ?? placeholders.tokenTitle}
          subText={placeholders.chainTitle}
          mr="12px"
        />
      )}
      <Box
        cursor="pointer"
        color={'brand.buttons.action.bg'}
        _hover={{
          color: 'brand.buttons.action.hover',
        }}
      >
        <Icon as={SelectTokenIcon} />
      </Box>
    </Box>
  );
};
