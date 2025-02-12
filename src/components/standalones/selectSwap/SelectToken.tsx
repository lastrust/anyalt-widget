import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
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
  failedToFetchRoute,
  handleWalletsOpen: connectWalletsOpen,
  buttonText = 'Start Transaction',
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
  } = useSelectToken();

  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { account: bitcoinAccount } = useBitcoinWallet();

  const isConnected =
    isEvmConnected ||
    isSolanaConnected ||
    walletConnector?.isConnected ||
    bitcoinAccount;

  return (
    <Flex flexDirection="column" gap="16px" {...props}>
      <TokenInputBox
        openTokenSelectModal={() => setOpenTokenSelect(true)}
        loading={loading}
        price={inTokenPrice}
        isValidAmountIn={isValidAmountIn}
        failedToFetchRoute={failedToFetchRoute}
        readonly={false}
      />
      <VStack gap="12px" w="full" alignItems="flex-start">
        <TokenQuoteBox
          loading={loading}
          headerText="Vault Is Expecting"
          tokenName={protocolInputToken?.symbol ?? ''}
          tokenLogo={protocolInputToken?.logoUrl ?? ''}
          chainName={protocolInputToken?.chain?.displayName ?? ''}
          chainLogo={protocolInputToken?.chain?.logoUrl ?? ''}
          amount={activeRoute?.outputAmount ?? '0.00'}
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
          amount={finalTokenEstimate?.amountOut ?? '0.00'}
          price={finalTokenEstimate?.priceInUSD ?? '0.00'}
        />
      </VStack>

      <Button
        p={'16px 20px'}
        width="100%"
        color="white"
        borderRadius="8px"
        bg="brand.tertiary.100"
        isLoading={loading}
        fontSize="16px"
        fontWeight="700"
        lineHeight="120%"
        height={'unset'}
        _hover={{
          bg: 'brand.tertiary.90',
        }}
        isDisabled={showConnectedWallets && failedToFetchRoute}
        onClick={() => {
          onButtonClick();
        }}
      >
        {buttonText}
      </Button>
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
