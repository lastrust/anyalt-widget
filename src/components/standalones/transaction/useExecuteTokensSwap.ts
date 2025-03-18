import { useAtom, useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';

import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { AnyAlt, EVMTransactionDataResponse } from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';
import { useWallet } from '@solana/wallet-adapter-react';

import { ChainType, EstimateResponse, Token, WalletConnector } from '../../..';
import {
  STEP_DESCR,
  TX_MESSAGE,
  TX_STATUS,
} from '../../../constants/transaction';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  protocolInputTokenAtom,
  swapDataAtom,
  transactionIndexAtom,
  transactionsListAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import {
  TransactionProgress,
  TransactionsProgress,
} from '../../../types/transaction';
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
  const bestRoute = useAtomValue(bestRouteAtom);

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { account: bitcoinAccount } = useBitcoinWallet();
  const [, setTransactionsProgress] = useAtom(transactionsProgressAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const [, setFinalTokenEstimate] = useAtom(finalTokenEstimateAtom);
  const [transactionsList, setTransactionsList] = useAtom(transactionsListAtom);

  const { handleTransaction } = useHandleTransaction({
    externalEvmWalletConnector,
  });

  const updateTransactionProgress = (progress: TransactionProgress) => {
    setTransactionsProgress((prev) => {
      const newProgress: TransactionsProgress = prev || {};
      const index = progress.details.currentStep - 1;
      const txType = progress.isApproval ? 'approve' : 'swap';

      newProgress[index] = {
        ...newProgress[index],
        [txType]: progress,
      };

      return { ...newProgress };
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
    estimateCallback: (token: Token) => Promise<EstimateResponse>,
  ) => {
    let isCrosschainSwapError = false;
    do {
      if (swapData.swapIsFinished) break;

      let isApproval = false;
      let chainName: string | undefined;
      let txHash: string | undefined;
      let nonce: number | undefined;

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

        updateTransactionProgress({
          isApproval,
          status: TX_STATUS.signing,
          message: TX_MESSAGE.signing,
          details: {
            currentStep: transactionIndex,
            totalSteps,
            stepDescription: stepText,
          },
        });

        const { nonce: nonceRes, txHash: txHashRes } =
          await handleTransaction(transactionData);

        nonce = nonceRes!;
        txHash = txHashRes!;

        updateTransactionProgress({
          isApproval,
          status: TX_STATUS.broadcasting,
          message: TX_MESSAGE.broadcasting,
          chainName,
          txHash: txHash!,
          details: {
            currentStep: transactionIndex,
            totalSteps,
            stepDescription: stepText,
          },
        });

        await submitPendingTransaction(aaInstance, {
          operationId,
          type: transactionType,
          txHash: txHash,
          nonce: nonce,
          signerAddress: signerAddress,
        });

        updateTransactionProgress({
          isApproval,
          status: TX_STATUS.pending,
          message: TX_MESSAGE.pending,
          chainName,
          txHash: txHash!,
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
          if (parseFloat(crosschainSwapOutputAmount) === 0) {
            throw new TransactionError(
              'Transaction failed: Output amount is 0',
            );
          }

          const res = await estimateCallback({
            name: protocolInputToken?.name ?? '',
            symbol: protocolInputToken?.symbol ?? '',
            address: protocolInputToken?.tokenAddress ?? '',
            chainId: Number(protocolInputToken?.chain?.id ?? 0),
            decimals: protocolInputToken?.decimals ?? 0,
            amount: crosschainSwapOutputAmount,
            chainType:
              (protocolInputToken?.chain?.chainType as ChainType) ??
              ChainType.EVM,
          });
          updateTransactionsList(crosschainSwapOutputAmount, res);
          setFinalTokenEstimate(res);
          setSwapData((prev) => {
            const newData = {
              ...prev,
              swapIsFinished: waitForTxResponse.swapIsFinished,
              crosschainSwapOutputAmount: crosschainSwapOutputAmount,
              totalSteps,
              currentStep: transactionIndex,
            };
            swapDataRef.current = newData;
            return newData;
          });

          updateTransactionProgress({
            isApproval,
            status: TX_STATUS.confirmed,
            message: TX_MESSAGE.confirmed,
            chainName,
            txHash: txHash!,
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

        updateTransactionProgress({
          isApproval,
          status: TX_STATUS.confirmed,
          message: TX_MESSAGE.confirmed,
          chainName,
          txHash: txHash!,
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

        updateTransactionProgress({
          isApproval,
          status: TX_STATUS.failed,
          message: errorMessage,
          error: errorStatus,
          chainName,
          txHash: txHash!,
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

  const updateTransactionsList = (
    crosschainSwapOutputAmount: string,
    finalEstimate: EstimateResponse,
  ) => {
    console.log('updateTransactionsList', transactionsList);
    if (transactionsList?.steps) {
      const newSteps = transactionsList.steps.slice(0, -1);
      const lastStep =
        transactionsList.steps[transactionsList.steps.length - 1];

      setTransactionsList({
        steps: [
          ...newSteps,
          {
            from: {
              tokenName: lastStep.from.tokenName,
              tokenLogo: lastStep.from.tokenLogo,
              tokenAmount: crosschainSwapOutputAmount,
              tokenPrice: lastStep.from.tokenPrice,
              tokenUsdPrice: (
                parseFloat(lastStep.from.tokenPrice) *
                parseFloat(crosschainSwapOutputAmount)
              ).toFixed(2),
              tokenDecimals: lastStep.from.tokenDecimals,
              blockchain: lastStep.from.blockchain,
              blockchainLogo: lastStep.from.blockchainLogo,
            },
            to: {
              tokenName: lastStep.to.tokenName,
              tokenLogo: lastStep.to.tokenLogo,
              tokenAmount: finalEstimate.amountOut,
              tokenPrice: (
                parseFloat(finalEstimate.priceInUSD) /
                parseFloat(finalEstimate.amountOut)
              ).toFixed(2),
              tokenUsdPrice: finalEstimate.priceInUSD,
              tokenDecimals: lastStep.to.tokenDecimals,
              blockchain: lastStep.to.blockchain,
              blockchainLogo: lastStep.to.blockchainLogo,
            },
          },
        ],
      });
    }
  };

  return {
    executeTokensSwap,
    updateTransactionProgress,
  };
};
