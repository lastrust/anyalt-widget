import { Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
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
  hideButton?: boolean;
  isValidAmountIn?: boolean;
  openSlippageModal: boolean;
  showConnectedWallets?: boolean;
  walletConnector?: WalletConnector;
  onButtonClick: () => void;
  handleWalletsOpen?: () => void;
  isTokenInputReadonly?: boolean;
  setOpenSlippageModal: (open: boolean) => void;
  failedToFetchRoute?: boolean;
};

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

  return (
    <Flex flexDirection="column" gap="16px" mb="16px">
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
      <VStack gap={'8px'} alignItems={'flex-start'}>
        {showConnectedWallets &&
          (isEvmConnected || walletConnector?.isConnected) && (
            <Text
              cursor={'pointer'}
              textStyle={'regular.2'}
              color="brand.secondary.3"
              onClick={
                walletConnector?.isConnected
                  ? () => walletConnector.disconnect()
                  : connectWalletsOpen
              }
            >
              EVM: {evmAddress || walletConnector?.address}
            </Text>
          )}
        {showConnectedWallets && isSolanaConnected && (
          <Text
            cursor={'pointer'}
            textStyle={'regular.2'}
            color="brand.secondary.3"
            onClick={connectWalletsOpen}
          >
            SOL: {solanaAddress?.toBase58()}
          </Text>
        )}
      </VStack>

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
