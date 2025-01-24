import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAccount } from 'wagmi';
import { SlippageModal } from '../modals/SlippageModal';
import { TokenInputBox } from '../token/input/TokenInputBox';
import { TokenQuoteBox } from '../token/quote/TokenQuoteBox';
import { TokenSelectBox } from '../token/select/TokenSelectBox';
import { useSelectSwap } from './useSelectSwap';

type Props = {
  loading: boolean;
  openSlippageModal: boolean;
  setOpenSlippageModal: (open: boolean) => void;
  showConnectedWallets?: boolean;
  isValidAmountIn?: boolean;
  buttonText: string;
  hideButton?: boolean;
  onButtonClick: () => void;
  handleWalletsOpen?: () => void;
};

export const SelectSwap = ({
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  showConnectedWallets = false,
  isValidAmountIn = true,
  handleWalletsOpen: connectWalletsOpen,
  onButtonClick,
  hideButton,
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
      {showConnectedWallets && isEvmConnected && (
        <Text onClick={connectWalletsOpen}>{evmAddress}</Text>
      )}
      {showConnectedWallets && isSolanaConnected && (
        <Text onClick={connectWalletsOpen}>{solanaAddress?.toBase58()}</Text>
      )}
      <Button
        width="100%"
        bg="brand.tertiary.100"
        color="white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        h="64px"
        onClick={onButtonClick}
        isLoading={loading}
      >
        {buttonText}
      </Button>
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
