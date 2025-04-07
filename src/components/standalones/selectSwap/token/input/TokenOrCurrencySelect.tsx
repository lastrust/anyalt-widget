import { SupportedToken } from '@anyalt/sdk';
import { Box, Icon } from '@chakra-ui/react';
import { useMemo } from 'react';
import { SelectTokenIcon } from '../../../../atoms/icons/selectToken/SelectTokenIcon';
import { TokenIconBox } from '../../../../molecules/TokenIconBox';
import { TokenInfoBox } from '../../../../molecules/TokenInfoBox';

type FiatCurrency = {
  symbol: string;
  name: string;
  logoUrl: string;
};

type SelectProps = {
  inToken: SupportedToken | FiatCurrency | undefined;
  widgetMode: 'fiat' | 'crypto';
  handleCryptoModal: () => void;
  handleFiatModal: () => void;
};

const isSupportedToken = (
  token: FiatCurrency | SupportedToken | undefined,
): token is SupportedToken => {
  return token !== undefined && 'chain' in token;
};

export const TokenOrCurrencySelect = ({
  inToken,
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
      <TokenIconBox
        tokenName={inToken?.symbol ?? ''}
        tokenIcon={inToken?.logoUrl ?? ''}
        chainName={
          isSupportedToken(inToken) ? String(inToken?.chain?.displayName) : ''
        }
        chainIcon={
          isSupportedToken(inToken) ? String(inToken?.chain?.logoUrl) : ''
        }
        mr="8px"
      />
      <TokenInfoBox
        tokenName={inToken?.symbol ?? placeholders.tokenTitle}
        subText={
          isSupportedToken(inToken) && inToken?.chain?.displayName
            ? `On ${inToken?.chain?.displayName}`
            : placeholders.chainTitle
        }
        mr="12px"
      />
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
