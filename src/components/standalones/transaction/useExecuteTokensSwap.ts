import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { AnyAlt, EVMTransactionDataResponse } from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';
import { WalletConnector } from '../../..';
import {
  STEP_DESCR,
  TX_MESSAGE,
  TX_STATUS,
} from '../../../constants/transaction';
import {
  bestRouteAtom,
  stepsProgressAtom,
  swapDataAtom,
  transactionIndexAtom,
} from '../../../store/stateStore';
import { TransactionProgress } from '../../../types/transaction';
import { mapBlockchainToChainType } from '../../../utils/chains';
import { getTransactionData } from '../../../utils/getTransactionData';
import { handleSignerAddress } from '../../../utils/handleSignerAddress';
import { submitPendingTransaction } from '../../../utils/submitPendingTransaction';
import { useHandleTransaction } from './handlers/useHandleTransaction';

export const useExecuteTokensSwap = (
  increaseTransactionIndex: () => void,
  externalEvmWalletConnector?: WalletConnector,
) => {
  const transactionIndex = useAtomValue(transactionIndexAtom);
  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [, setStepsProgress] = useAtom(stepsProgressAtom);
  const bestRoute = useAtomValue(bestRouteAtom);

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { account: bitcoinAccount } = useBitcoinWallet();

  const { handleTransaction } = useHandleTransaction({
    externalEvmWalletConnector,
  });

  const updateStepProgress = (progress: TransactionProgress) => {
    setStepsProgress((prev) => {
      const newSteps = prev?.steps ? [...prev.steps] : [];
      const index = progress.details.currentStep - 1;

      const txType = progress.isApproval ? 'approve' : 'swap';

      newSteps[index] = {
        ...newSteps[index],
        [txType]: progress,
      };
      return { steps: newSteps };
    });
  };

  const executeTokensSwap = async (
    aaInstance: AnyAlt,
    operationId: string,
    slippage: string,
    totalSteps: number,
    swapDataRef: React.RefObject<{
      swapIsFinished: boolean;
      isCrosschainSwapError: boolean;
      crosschainSwapOutputAmount: string;
      totalSteps: number;
    }>,
  ) => {
    let isCrosschainSwapError = false;
    do {
      if (swapData.swapIsFinished) break;

      let isApproval = false;
      let chainName: string | undefined;
      let txHash: string | undefined;

      try {
        const currentStep = bestRoute?.swapSteps?.[transactionIndex - 1];

        if (!currentStep) {
          throw new Error('No swap step found');
        }

        let walletAddress = null;
        const chainType = mapBlockchainToChainType(
          currentStep.sourceToken.blockchain,
        );
        switch (chainType) {
          case 'EVM':
            if (!isEvmConnected) {
              throw new Error('EVM wallet not connected');
            }
            walletAddress = evmAddress;
            break;
          case 'SOLANA':
            if (!isSolanaConnected) {
              throw new Error('Solana wallet not connected');
            }
            walletAddress = solanaAddress?.toBase58();
            break;
          case 'BTC':
            if (!bitcoinAccount) {
              throw new Error('Bitcoin wallet not connected');
            }
            walletAddress = bitcoinAccount?.address;
            break;
          default:
            throw new Error('Unsupported chain type');
        }

        const transactionData = await getTransactionData(
          aaInstance,
          operationId,
          slippage,
          walletAddress as string,
        );

        chainName = transactionData.blockChain;
        const isEVMTx = transactionData.type === 'EVM';
        const evmTxData = transactionData as EVMTransactionDataResponse;
        const isApprovalTx = evmTxData.isApprovalTx;

        isApproval = isEVMTx && isApprovalTx;

        const transactionType = isApproval ? 'APPROVE' : 'MAIN';
        const signerAddress = handleSignerAddress(transactionData);
        const stepText = isApproval ? STEP_DESCR.approval : STEP_DESCR.swap;

        updateStepProgress({
          isApproval,
          status: TX_STATUS.signing,
          message: TX_MESSAGE.signing,
          details: {
            currentStep: transactionIndex,
            totalSteps,
            stepDescription: stepText,
          },
        });

        txHash = await handleTransaction(transactionData);

        updateStepProgress({
          isApproval,
          status: TX_STATUS.broadcasting,
          message: TX_MESSAGE.broadcasting,
          chainName,
          txHash,
          details: {
            currentStep: transactionIndex,
            totalSteps,
            stepDescription: stepText,
          },
        });

        await submitPendingTransaction(aaInstance, {
          operationId,
          type: transactionType,
          txHash: txHash || '',
          signerAddress: signerAddress,
        });

        updateStepProgress({
          isApproval,
          status: TX_STATUS.pending,
          message: TX_MESSAGE.pending,
          chainName,
          txHash,
          details: {
            currentStep: transactionIndex,
            totalSteps,
            stepDescription: stepText,
          },
        });

        const waitForTxResponse = await aaInstance.waitForTx({
          operationId,
        });
        const swapIsFinished = waitForTxResponse.swapIsFinished;
        const crosschainSwapOutputAmount =
          waitForTxResponse?.outputAmount || '0';
        if (swapIsFinished) {
          setSwapData((prev) => {
            const newData = {
              ...prev,
              swapIsFinished: waitForTxResponse.swapIsFinished,
              crosschainSwapOutputAmount: crosschainSwapOutputAmount,
              totalSteps,
            };
            swapDataRef.current = newData;
            return newData;
          });

          updateStepProgress({
            isApproval,
            status: TX_STATUS.confirmed,
            message: TX_MESSAGE.confirmed,
            chainName,
            txHash,
            details: {
              currentStep: transactionIndex,
              totalSteps,
              stepDescription: STEP_DESCR.complete,
            },
          });
          break;
        }

        const isTxFailed = waitForTxResponse.status === 'FAILED';
        if (isTxFailed) {
          const errMsg = 'Transaction failed: ' + waitForTxResponse.message;
          throw new TransactionError(errMsg);
        }

        updateStepProgress({
          isApproval,
          status: TX_STATUS.confirmed,
          message: TX_MESSAGE.confirmed,
          chainName,
          txHash,
          details: {
            currentStep: transactionIndex,
            totalSteps,
            stepDescription: STEP_DESCR.complete,
          },
        });

        if (isApproval) {
          console.log('approvalTx');
          continue;
        } else {
          increaseTransactionIndex();
          console.log('currentStep increased ', transactionIndex);
        }
      } catch (error) {
        console.error('Error during swap execution:', error);
        isCrosschainSwapError = true;
        setSwapData((prev) => {
          const newData = {
            ...prev,
            isCrosschainSwapError: true,
          };
          swapDataRef.current = newData;
          return newData;
        });

        const isErrorInstance = error instanceof Error;
        const isTxErrorInstance = error instanceof TransactionError;

        const errorStatus = isErrorInstance ? error.message : String(error);
        const errorMessage = isTxErrorInstance
          ? error.message
          : TX_MESSAGE.failed;

        updateStepProgress({
          isApproval,
          status: TX_STATUS.failed,
          message: errorMessage,
          error: errorStatus,
          chainName,
          txHash,
          details: {
            currentStep: transactionIndex,
            totalSteps,
            stepDescription: STEP_DESCR.failed,
          },
        });
        break;
      }
    } while (!swapData.swapIsFinished);

    return {
      isCrosschainSwapError,
    };
  };

  return {
    executeTokensSwap,
    updateStepProgress,
  };
};
