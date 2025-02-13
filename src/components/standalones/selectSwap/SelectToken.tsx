import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import {
  BoxProps,
  Divider,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';
import { WalletConnector } from '../../..';
import { tokenFetchErrorAtom } from '../../../store/stateStore';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { CustomButton } from '../../atoms/buttons/CustomButton';
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
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    openTokenSelect,
    isTokenBuyTemplate,
    finalTokenEstimate,
    setOpenTokenSelect,
    protocolInputToken,
    protocolFinalToken,
    activeRoute,
  } = useSelectToken();

  const tokenFetchError = useAtomValue(tokenFetchErrorAtom);

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
          headerText={
            isTokenBuyTemplate ? 'What You Are Getting' : 'Vault Is Expecting'
          }
          tokenName={protocolInputToken?.symbol ?? ''}
          tokenLogo={protocolInputToken?.logoUrl ?? ''}
          chainName={protocolInputToken?.chain?.displayName ?? ''}
          chainLogo={protocolInputToken?.chain?.logoUrl ?? ''}
          amount={truncateToDecimals(activeRoute?.outputAmount ?? '0.00', 4)}
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
