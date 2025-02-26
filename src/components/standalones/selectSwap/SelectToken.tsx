import {
  BoxProps,
  Divider,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { WalletConnector } from '../../..';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { CustomButton } from '../../atoms/buttons/CustomButton';
import { CrossChainWarningCard } from '../../molecules/card/CrossChainWarning';
import { SlippageModal } from '../modals/SlippageModal';
import { TokenSelectModal } from '../modals/TokenSelectModal';
import { TokenInputBox } from './token/input/TokenInputBox';
import { TokenQuoteBox } from './token/quote/TokenQuoteBox';
import { useSelectToken } from './useSelectToken';

type Props = {
  loading: boolean;
  buttonText: string;
  isValidAmountIn?: boolean;
  openSlippageModal: boolean;
  showConnectedWallets?: boolean;
  walletConnector?: WalletConnector;
  onButtonClick: () => void;
  isButtonDisabled?: boolean;
  handleWalletsOpen?: () => void;
  setOpenSlippageModal: (open: boolean) => void;
  failedToFetchRoute?: boolean;
} & BoxProps;

export const SelectToken = ({
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  showConnectedWallets = false,
  isValidAmountIn = true,
  walletConnector,
  onButtonClick,
  isButtonDisabled,
  failedToFetchRoute,
  handleWalletsOpen: connectWalletsOpen,
  buttonText = 'Start Transaction',
  ...props
}: Props) => {
  const {
    bestRoute,
    isConnected,
    solanaAddress,
    evmAddress,
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    isEvmConnected,
    bitcoinAccount,
    tokenFetchError,
    openTokenSelect,
    isSolanaConnected,
    isTokenBuyTemplate,
    finalTokenEstimate,
    setOpenTokenSelect,
    protocolInputToken,
    protocolFinalToken,
  } = useSelectToken({
    walletConnector,
  });

  return (
    <Flex flexDirection="column" gap="16px" {...props}>
      <VStack w="full" gap="4px" alignItems="flex-start">
        <TokenInputBox
          openTokenSelectModal={() => setOpenTokenSelect(true)}
          loading={loading}
          price={inTokenPrice}
          isValidAmountIn={isValidAmountIn}
          failedToFetchRoute={failedToFetchRoute}
          readonly={false}
          w="full"
        />
        <CrossChainWarningCard />
      </VStack>

      <VStack gap="12px" w="full" alignItems="flex-start">
        <TokenQuoteBox
          loading={loading}
          headerText={
            isTokenBuyTemplate ? 'What You Are Getting' : 'Vault Is Expecting'
          }
          tokenName={protocolInputToken?.symbol ?? ''}
          tokenLogo={protocolInputToken?.logoUrl ?? ''}
          chainName={protocolInputToken?.chain?.displayName ?? ''}
          chainLogo={protocolInputToken?.chain?.logoUrl ?? ''}
          amount={truncateToDecimals(bestRoute?.outputAmount ?? '0.00', 4)}
          price={truncateToDecimals(outTokenPrice ?? '0.00', 4)}
        />

        {!isTokenBuyTemplate && (
          <>
            <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
            <TokenQuoteBox
              loading={loading}
              headerText="What You Are Getting"
              tokenName={protocolFinalToken?.symbol ?? ''}
              tokenLogo={protocolFinalToken?.logoUrl ?? ''}
              chainName={protocolInputToken?.chain?.displayName ?? ''}
              chainLogo={protocolInputToken?.chain?.logoUrl ?? ''}
              amount={truncateToDecimals(
                finalTokenEstimate?.amountOut ?? '0.00',
                4,
              )}
              price={truncateToDecimals(
                finalTokenEstimate?.priceInUSD ?? '0.00',
                4,
              )}
            />
          </>
        )}
      </VStack>

      <CustomButton
        isLoading={loading}
        isDisabled={
          isButtonDisabled ||
          (showConnectedWallets && failedToFetchRoute) ||
          (tokenFetchError.isError && !!isConnected)
        }
        onButtonClick={onButtonClick}
      >
        {buttonText}
      </CustomButton>
      {showConnectedWallets && (
        <HStack alignItems={'center'}>
          {isConnected && (
            <Text color="brand.tertiary.100" textStyle={'regular.2'}>
              Connected:
            </Text>
          )}
          <VStack gap={'8px'} alignItems={'flex-start'}>
            {showConnectedWallets &&
              (isEvmConnected || walletConnector?.isConnected) && (
                <HStack>
                  <Image
                    src={'https://www.anyalt.finance/widget/eth.png'}
                    w={'16px'}
                    h={'16px'}
                    alt="EVM"
                  />
                  <Text
                    cursor={'pointer'}
                    textStyle={'regular.3'}
                    color="brand.secondary.3"
                    noOfLines={1}
                    maxW={'300px'}
                    onClick={
                      walletConnector?.isConnected
                        ? () => walletConnector.disconnect()
                        : connectWalletsOpen
                    }
                  >
                    {evmAddress || walletConnector?.address}
                  </Text>
                </HStack>
              )}
            {showConnectedWallets && isSolanaConnected && (
              <HStack>
                <Image
                  src={'https://www.anyalt.finance/widget/solana.png'}
                  w={'16px'}
                  h={'16px'}
                  alt="SOL"
                />
                <Text
                  cursor={'pointer'}
                  textStyle={'regular.3'}
                  color="brand.secondary.3"
                  onClick={connectWalletsOpen}
                  noOfLines={1}
                  maxW={'300px'}
                >
                  {solanaAddress?.toBase58()}
                </Text>
              </HStack>
            )}
            {showConnectedWallets && bitcoinAccount && (
              <HStack>
                <Image
                  src={
                    'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
                  }
                  w={'16px'}
                  h={'16px'}
                  alt="BTC"
                />
                <Text
                  cursor={'pointer'}
                  textStyle={'regular.3'}
                  color="brand.secondary.3"
                  noOfLines={1}
                  maxW={'300px'}
                  onClick={connectWalletsOpen}
                >
                  {bitcoinAccount.address}
                </Text>
              </HStack>
            )}
          </VStack>
        </HStack>
      )}

      {openTokenSelect && (
        <TokenSelectModal
          onClose={() => setOpenTokenSelect(false)}
          onTokenSelect={(token) =>
            onTokenSelect(token, () => {
              setOpenTokenSelect(false);
            })
          }
        />
      )}
      {openSlippageModal && (
        <SlippageModal onClose={() => setOpenSlippageModal(false)} />
      )}
    </Flex>
  );
};
