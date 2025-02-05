import {
  BoxProps,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAccount } from 'wagmi';
import { WalletConnector } from '../../..';
import { SlippageModal } from '../modals/SlippageModal';
import { TokenInputBox } from '../token/input/TokenInputBox';
import { TokenQuoteBox } from '../token/quote/TokenQuoteBox';
import { TokenSelectBox } from '../token/select/TokenSelectBox';
import { useSelectSwap } from './useSelectSwap';

type Props = {
  loading: boolean;
  buttonText: string;
  isValidAmountIn?: boolean;
  openSlippageModal: boolean;
  showConnectedWallets?: boolean;
  walletConnector?: WalletConnector;
  onButtonClick: () => void;
  refetchCallback: (withGoNext: boolean) => void;
  handleWalletsOpen?: () => void;
  setOpenSlippageModal: (open: boolean) => void;
  failedToFetchRoute?: boolean;
} & BoxProps;

export const SelectSwap = ({
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  showConnectedWallets = false,
  isValidAmountIn = true,
  walletConnector,
  onButtonClick,
  failedToFetchRoute,
  handleWalletsOpen: connectWalletsOpen,
  buttonText = 'Start Transaction',
  refetchCallback,
  ...props
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

  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();

  const isConnected =
    isEvmConnected || isSolanaConnected || walletConnector?.isConnected;

  return (
    <Flex flexDirection="column" gap="16px" mb="16px" {...props}>
      <TokenInputBox
        openTokenSelectModal={() => setOpenTokenSelect(true)}
        loading={loading}
        price={inTokenPrice}
        isValidAmountIn={isValidAmountIn}
        failedToFetchRoute={failedToFetchRoute}
        readonly={false}
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
      <Button
        width="100%"
        bg="brand.tertiary.100"
        _hover={{
          bg: 'brand.tertiary.90',
        }}
        color="white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        h="64px"
        isDisabled={failedToFetchRoute}
        onClick={() => {
          onButtonClick();
        }}
        isLoading={loading}
      >
        {buttonText}
      </Button>
      {showConnectedWallets && (
        <HStack alignItems={'self-start'}>
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
                >
                  {solanaAddress?.toBase58()}
                </Text>
              </HStack>
            )}
          </VStack>
        </HStack>
      )}

      {openTokenSelect && (
        <TokenSelectBox
          onClose={() => setOpenTokenSelect(false)}
          onTokenSelect={(token) =>
            onTokenSelect(token, () => {
              setOpenTokenSelect(false);
              refetchCallback?.(false);
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
