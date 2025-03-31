import { Account } from '@ant-design/web3';
import { SupportedChain } from '@anyalt/sdk';
import { PublicKey } from '@solana/web3.js';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ChainType, WalletConnector, WidgetTemplateType } from '../../..';
import {
  activeOperationIdAtom,
  allRoutesAtom,
  anyaltInstanceAtom,
  transactionsProgressAtom,
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
  const [allRoutes, setAllRoutes] = useAtom(allRoutesAtom);

  const setActiveOperationId = useSetAtom(activeOperationIdAtom);
  const setTransactionsProgress = useSetAtom(transactionsProgressAtom);

  const onChooseRouteButtonClick = async () => {
    try {
      if (areWalletsConnected) {
        await confirmSelectedRoute();
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

  const confirmSelectedRoute = async () => {
    try {
      setLoading(true);

      let destination = '';

      const selectedWallets: Record<string, string> = {};
      //TODO: It shoudl read data from selected route.
      allRoutes?.swapSteps.forEach((swapStep, index) => {
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

        if (index === allRoutes.swapSteps.length - 1) {
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

      if (allRoutes?.swapSteps.length === 0) {
        const res = await anyaltInstance?.createOperation();
        if (!res?.operationId) throw new Error('Failed to create operation');

        setActiveOperationId(res?.operationId);
      } else {
        if (!allRoutes?.operationId) return;
        const res = await anyaltInstance?.confirmRoute({
          operationId: allRoutes?.operationId,
          selectedWallets,
          destination: destination,
        });

        if (!res?.operationId || !res?.ok)
          throw new Error('Failed to confirm route');

        setActiveOperationId(res?.operationId);
        setAllRoutes(allRoutes);
        const localStorageKey =
          widgetTemplate === 'TOKEN_BUY'
            ? 'tokenBuyOperationId'
            : 'operationId';
        localStorage.setItem(localStorageKey, res.operationId);
      }

      connectWalletsClose();
      setActiveStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    onChooseRouteButtonClick,
  };
};
