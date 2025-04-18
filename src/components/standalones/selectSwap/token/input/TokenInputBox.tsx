import { Box, BoxProps, Input, Skeleton, Text } from '@chakra-ui/react';
import { MaxButton } from './MaxButton';
import { TokenOrCurrencySelect } from './TokenOrCurrencySelect';
import { useTokenInputBox } from './useTokenInputBox';

type Props = BoxProps & {
  price: string;
  activeStep: number;
  loading: boolean;
  readonly: boolean;
  isValidAmountIn: boolean;
  isTokenInputDisabled?: boolean;
  failedToFetchRoute?: boolean;
  openTokenSelectModal: () => void;
};

export const TokenInputBox = ({
  loading,
  price,
  readonly,
  isValidAmountIn,
  openTokenSelectModal,
  failedToFetchRoute,
  activeStep,
  ...props
}: Props) => {
  const {
    title,
    selectedToken,
    selectedCurrency,
    balance,
    widgetMode,
    selectedTokenOrFiatAmount,
    tokenFetchError,
    maxButtonClick,
    isWalletConnected,
    handleInputChange,
  } = useTokenInputBox();

  return (
    <Box {...props}>
      <Box
        display={readonly ? 'none' : 'flex'}
        justifyContent="space-between"
        alignItems="center"
        mb="12px"
      >
        <Text color={'brand.text.secondary.2'} textStyle={'bold.2'}>
          {title}
        </Text>
        <MaxButton
          balance={balance}
          activeStep={activeStep}
          isWalletConnected={Boolean(isWalletConnected)}
          maxButtonClick={maxButtonClick}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        gap="16px"
        bgColor="brand.bg.cardBg"
        padding="16px"
        borderRadius="8px"
        border={!isValidAmountIn || failedToFetchRoute ? '1px solid' : 'none'}
        borderColor={
          !isValidAmountIn || failedToFetchRoute
            ? 'brand.border.error'
            : 'transparent'
        }
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <TokenOrCurrencySelect
            selectedToken={selectedToken}
            selectedCurrency={selectedCurrency}
            widgetMode={widgetMode}
            handleCryptoModal={openTokenSelectModal}
            handleFiatModal={openTokenSelectModal}
          />
          <Box>
            <Input
              type="text"
              pattern="[0-9]+([,\.][0-9]+)?"
              fontSize="32px"
              fontWeight="bold"
              border="none"
              outline="none"
              focusBorderColor="transparent"
              bgColor="transparent"
              color="brand.text.primary"
              placeholder="0.00"
              textAlign="right"
              maxWidth="150px"
              padding="0px"
              _placeholder={{
                color: 'brand.text.primary',
                opacity: 0.4,
              }}
              value={selectedTokenOrFiatAmount}
              onChange={handleInputChange}
              readOnly={readonly}
            />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Text color="brand.text.primary" fontSize="12px" opacity={0.4}>
            {(selectedToken?.name ?? widgetMode === 'crypto')
              ? 'Token'
              : `${selectedCurrency?.name}`}
          </Text>
          {loading ? (
            <Skeleton width="34px" height="14px" borderRadius="32px" />
          ) : (
            <Text color="brand.text.primary" fontSize="12px" opacity={0.4}>
              ~${price || '0.00'}
            </Text>
          )}
        </Box>
      </Box>
      {tokenFetchError.isError && (
        <Box
          padding="4px"
          bgColor="brand.bg.error"
          borderRadius="8px"
          width="100%"
        >
          <Text color="brand.text.error" fontSize="14px" fontWeight="bold">
            {tokenFetchError.errorMessage}
          </Text>
        </Box>
      )}
    </Box>
  );
};
