import { AnyAlt } from '@anyalt/sdk';
import { switchChain } from '@wagmi/core';
import { useAtom, useAtomValue } from 'jotai';
import { ChainType, ExecuteResponse, Token } from '../../..';
import { config } from '../../../constants/configs';
import {
  STEP_DESCR,
  TX_MESSAGE,
  TX_STATUS,
} from '../../../constants/transaction';
import {
  bestRouteAtom,
  finalTokenAmountAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';
import {
  TransactionError,
  TransactionProgress,
} from '../../../types/transaction';
import { chainIdsValues } from '../../../utils/chains';

type UseLastMileTransactionProps = {
  updateTransactionProgress: (progress: TransactionProgress) => void;
  swapDataRef: React.RefObject<{
    swapIsFinished: boolean;
    isCrosschainSwapError: boolean;
    crosschainSwapOutputAmount: string;
    totalSteps: number;
    currentStep: number;
  }>;
};

export const useLastMileTransaction = ({
  swapDataRef,
  updateTransactionProgress,
}: UseLastMileTransactionProps) => {
  const bestRoute = useAtomValue(bestRouteAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);

  const [, setFinalTokenAmount] = useAtom(finalTokenAmountAtom);

  const executeLastMileTransaction = async (
    stepIndex: number,
    executeCallBack: (token: Token) => Promise<ExecuteResponse>,
    aaInstance: AnyAlt,
    operationId: string,
  ) => {
    if (
      bestRoute?.swapSteps &&
      bestRoute?.swapSteps?.length > 0 &&
      !swapDataRef.current.swapIsFinished
    )
      throw new TransactionError('Swap is not finished');

    try {
      const isEvm = protocolInputToken?.chain?.chainType === ChainType.EVM;

      if (isEvm && protocolInputToken?.chain?.chainId) {
        await switchChain(config, {
          chainId: protocolInputToken.chain.chainId as chainIdsValues,
        });
      }

      updateTransactionProgress({
        isApproval: false,
        status: TX_STATUS.pending,
        message: TX_MESSAGE.signing,
        details: {
          currentStep: stepIndex + 1,
          totalSteps: swapDataRef.current.totalSteps,
          stepDescription: STEP_DESCR.pending,
        },
      });

      const executeResponse = await executeCallBack({
        amount: swapDataRef.current.crosschainSwapOutputAmount,
        address: protocolInputToken?.tokenAddress || '',
        decimals: protocolInputToken?.decimals || 0,
        chainId: protocolInputToken?.chain?.chainId || 1,
        name: protocolInputToken?.symbol || '',
        symbol: protocolInputToken?.symbol || '',
        chainType: isEvm ? ChainType.EVM : ChainType.SOLANA,
      });

      setFinalTokenAmount(executeResponse.amountOut);

      if (executeResponse.approvalTxHash) {
        updateTransactionProgress({
          isApproval: true,
          status: TX_STATUS.confirmed,
          message: TX_MESSAGE.confirmed,
          txHash: executeResponse.approvalTxHash,
          chainName: protocolInputToken?.chain?.name,
          details: {
            currentStep: stepIndex + 1,
            totalSteps: swapDataRef.current.totalSteps,
            stepDescription: STEP_DESCR.complete,
          },
        });

        await aaInstance.createLastMileTransaction({
          vmType: isEvm ? 'EVM' : 'SOLANA',
          operationId,
          order: 0,
          chainId: isEvm ? protocolInputToken?.chain?.chainId || 1 : 101,
          transactionHash: executeResponse.approvalTxHash,
        });
      }

      if (executeResponse.executeTxHash) {
        updateTransactionProgress({
          isApproval: false,
          status: TX_STATUS.confirmed,
          message: TX_MESSAGE.confirmed,
          txHash: executeResponse.executeTxHash,
          chainName: protocolInputToken?.chain?.name,
          details: {
            currentStep: stepIndex + 1,
            totalSteps: swapDataRef.current.totalSteps,
            stepDescription: STEP_DESCR.complete,
          },
        });

        await aaInstance.createLastMileTransaction({
          vmType: isEvm ? 'EVM' : 'SOLANA',
          operationId,
          order: 1,
          chainId: isEvm ? protocolInputToken?.chain?.chainId || 1 : 101,
          transactionHash: executeResponse.executeTxHash,
        });
      }
    } catch (error) {
      const isErrorInstance = error instanceof Error;
      const errorMessage = isErrorInstance ? error.message : String(error);
      const isRejectedByUser =
        (error as any)?.code === 4001 || errorMessage.includes('User rejected');

      try {
        updateTransactionProgress({
          isApproval: false,
          status: TX_STATUS.failed,
          message: isRejectedByUser
            ? 'Transaction rejected by user'
            : TX_MESSAGE.failed, // Default failure message
          error: errorMessage,
          details: {
            currentStep: stepIndex + 1,
            totalSteps: swapDataRef.current.totalSteps,
            stepDescription: STEP_DESCR.failed,
          },
        });
      } catch (updateError) {
        console.error('Failed to update step progress:', updateError);
      }

      throw new TransactionError(
        isRejectedByUser
          ? 'Transaction was rejected by the user in MetaMask'
          : 'Failed to execute last mile transaction',
        error,
      );
    }
  };

  return { executeLastMileTransaction };
};
