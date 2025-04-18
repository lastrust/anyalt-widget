import { Account } from '@ant-design/web3';
import { SupportedChain } from '@anyalt/sdk';
import { PublicKey } from '@solana/web3.js';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ChainType, WalletConnector, WidgetTemplateType } from '../../..';
import {
  activeOperationIdAtom,
  activeOperationsListAtom,
  anyaltInstanceAtom,
  onramperOperationIdAtom,
  selectedRouteAtom,
  selectedTokenOrFiatAmountAtom,
  transactionsProgressAtom,
  widgetModeAtom,
} from '../../../store/stateStore';

type UseConfirmRouteProps = {
  evmAddress: `0x${string}` | undefined;
  solanaAddress: PublicKey | null;
  bitcoinAccount: Account | undefined;
  widgetTemplate: WidgetTemplateType;
  areWalletsConnected: boolean;
  walletConnector: WalletConnector | undefined;
  connectWalletsOpen: () => void;
  connectWalletsClose: () => void;
  setActiveStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  getChain: (blockchain: string) => SupportedChain | undefined;
};

export const useConfirmRoute = ({
  evmAddress,
  solanaAddress,
  bitcoinAccount,
  widgetTemplate,
  walletConnector,
  connectWalletsOpen,
  areWalletsConnected,
  getChain,
  setLoading,
  setActiveStep,
  connectWalletsClose,
}: UseConfirmRouteProps) => {
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);

  const [activeOperationsList, setActiveOperationsList] = useAtom(
    activeOperationsListAtom,
  );

  const widgetMode = useAtomValue(widgetModeAtom);
  const [, setActiveOperationId] = useAtom(activeOperationIdAtom);
  const [, setOnramperOperationId] = useAtom(onramperOperationIdAtom);
  const setTransactionsProgress = useSetAtom(transactionsProgressAtom);
  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);

  const getActiveRouteIdByOperationId = (
    operationId: string | undefined,
  ): string | undefined => {
    if (!operationId) return undefined;
    return activeOperationsList.find((str) => str === operationId);
  };

  const onChooseRouteButtonClick = async () => {
    try {
      if (areWalletsConnected) {
        await goToTransactionScreen();
        setTransactionsProgress({});
      } else {
        if (walletConnector) {
          walletConnector.connect();
        } else {
          connectWalletsOpen();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addOperationId = (newString: string) => {
    setActiveOperationsList((prev) =>
      prev.includes(newString) ? prev : [...prev, newString],
    );
  };

  const confirmRoute = async (): Promise<string | undefined> => {
    try {
      setLoading(true);
      let destination = '';
      const selectedWallets: Record<string, string> = {};

      selectedRoute?.swapSteps.forEach((swapStep, index) => {
        const fromBlockchain = swapStep.sourceToken.blockchain;
        const toBlockchain = swapStep.destinationToken.blockchain;

        const isSolanaFrom = fromBlockchain === 'SOLANA';
        const isSolanaTo = toBlockchain === 'SOLANA';
        const isBitcoinFrom = fromBlockchain === 'BTC';
        const isBitcoinTo = toBlockchain === 'BTC';

        if (isSolanaFrom || isSolanaTo) {
          selectedWallets['SOLANA'] = solanaAddress?.toString() || '';
        }
        if (isBitcoinFrom || isBitcoinTo) {
          selectedWallets['BTC'] = bitcoinAccount?.address || '';
        }

        const fromChain = getChain(fromBlockchain);
        const toChain = getChain(toBlockchain);

        const isEvmFrom = fromChain?.chainType === ChainType.EVM;
        const isEvmTo = toChain?.chainType === ChainType.EVM;

        if (isEvmFrom || isEvmTo) {
          if (!evmAddress) {
            throw new Error('EVM Wallet not connected');
          }
        }

        if (isSolanaFrom || isSolanaTo) {
          if (!solanaAddress) {
            throw new Error('Solana Wallet not connected');
          }
        }

        if (isBitcoinFrom || isBitcoinTo) {
          if (!bitcoinAccount) {
            throw new Error('Bitcoin Wallet not connected');
          }
        }

        if (isEvmFrom) selectedWallets[fromBlockchain] = evmAddress!;
        if (isEvmTo) selectedWallets[toBlockchain] = evmAddress!;

        if (index === selectedRoute.swapSteps.length - 1) {
          switch (true) {
            case isEvmTo:
              destination = evmAddress!;
              break;
            case isSolanaTo:
              destination = solanaAddress!.toString();
              break;
            case isBitcoinTo:
              destination = bitcoinAccount!.address;
              break;
            default:
              throw new Error('Destination not found');
          }
        }
      });

      if (selectedRoute?.swapSteps.length === 0) {
        const res = await anyaltInstance?.createOperation();
        if (!res?.operationId) throw new Error('Failed to create operation');

        setActiveOperationId(res?.operationId);

        return res?.operationId;
      } else {
        const isRouteConfirmed =
          !selectedRoute?.routeId ||
          selectedRoute?.routeId ===
            getActiveRouteIdByOperationId(selectedRoute?.routeId);

        if (isRouteConfirmed) return;

        const res = await anyaltInstance?.confirmRoute({
          operationId: selectedRoute?.routeId,
          selectedWallets,
          destination: destination,
        });

        if (!res?.operationId || !res?.ok)
          throw new Error('Failed to confirm route');

        setActiveOperationId(res?.operationId);
        addOperationId(res?.operationId);

        const localStorageKey =
          widgetTemplate === 'TOKEN_BUY'
            ? 'tokenBuyOperationId'
            : 'operationId';
        localStorage.setItem(localStorageKey, res.operationId);
        return res?.operationId;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createOnramperOperation = async () => {
    const res = await anyaltInstance?.createOperationAndOnramperOperation({
      fiatId: selectedRoute?.fiatStep?.fiat.id || '',
      fiatBridgeTokenId: selectedRoute?.fiatStep?.middleToken.id || '',
      fiatInputAmount: selectedTokenOrFiatAmount || '',
    });
    if (!res?.operationId)
      throw new Error('Failed to create onramper operation');

    setActiveOperationId(res?.operationId);
    setOnramperOperationId(res?.onramperOperationId);
    return {
      operationId: res?.operationId,
      onramperOperationId: res?.onramperOperationId,
    };
  };

  const goToTransactionScreen = async () => {
    if (widgetMode === 'fiat') {
      await createOnramperOperation();
    } else {
      await confirmRoute();
    }
    connectWalletsClose();
    setActiveStep(2);
  };

  return {
    onChooseRouteButtonClick,
  };
};
