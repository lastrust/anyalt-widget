import { BoxProps, Divider, Flex, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { WalletConnector } from '../../..';
import { selectedRouteAtom } from '../../../store/stateStore';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { CustomButton } from '../../atoms/buttons/CustomButton';
import { TokenSelectModal } from '../modals/selectTokenModal/SelectTokenModal';
import { SlippageModal } from '../modals/SlippageModal';
import { WalletsGroup } from '../walletsGroup/WalletsGroup';
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
  const selectedRoute = useAtomValue(selectedRouteAtom);
  const {
    isConnected,
    solanaAddress,
    evmAddress,
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    bitcoinAccount,
    tokenFetchError,
    openTokenSelect,
    widgetTemplate,
    finalTokenEstimate,
    setOpenTokenSelect,
    protocolInputToken,
    protocolFinalToken,
    isEvmWalletConnected,
    isSolanaWalletConnected,
    isBitcoinWalletConnected,
  } = useSelectToken({
    walletConnector,
    showConnectedWallets,
  });

  return (
    <Flex flexDirection="column" gap="16px" {...props}>
      <TokenInputBox
        openTokenSelectModal={() => setOpenTokenSelect(true)}
        loading={loading}
        price={inTokenPrice}
        isValidAmountIn={isValidAmountIn}
        failedToFetchRoute={failedToFetchRoute}
        readonly={false}
        w="full"
      />

      <VStack gap="12px" w="full" alignItems="flex-start">
        <TokenQuoteBox
          loading={loading}
          headerText={
            widgetTemplate === 'TOKEN_BUY'
              ? 'What You Are Getting'
              : 'Vault Is Expecting'
          }
          tokenName={protocolInputToken?.symbol ?? ''}
          tokenLogo={protocolInputToken?.logoUrl ?? ''}
          chainName={protocolInputToken?.chain?.displayName ?? ''}
          chainLogo={protocolInputToken?.chain?.logoUrl ?? ''}
          amount={truncateToDecimals(selectedRoute?.outputAmount ?? '0.00', 4)}
          price={truncateToDecimals(outTokenPrice ?? '0.00', 4)}
        />

        {widgetTemplate === 'DEPOSIT_TOKEN' && (
          <>
            <Divider w="100%" h="1px" bgColor="brand.bg.primary" />
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
      <WalletsGroup
        evmAddress={evmAddress}
        isConnected={isConnected}
        walletConnector={walletConnector}
        solanaAddress={solanaAddress?.toBase58()}
        bitcoinAccount={bitcoinAccount?.address}
        connectWalletsOpen={connectWalletsOpen}
        showConnectedWallets={showConnectedWallets}
        isEvmWalletConnected={isEvmWalletConnected}
        isSolanaWalletConnected={isSolanaWalletConnected}
        isBitcoinWalletConnected={isBitcoinWalletConnected}
      />
      <TokenSelectModal
        isOpen={openTokenSelect}
        onClose={() => setOpenTokenSelect(false)}
        onTokenSelect={(token) =>
          onTokenSelect(token, () => {
            setOpenTokenSelect(false);
          })
        }
      />
      <SlippageModal
        isOpen={openSlippageModal}
        onClose={() => setOpenSlippageModal(false)}
      />
    </Flex>
  );
};
