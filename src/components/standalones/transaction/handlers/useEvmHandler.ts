import { EVMTransactionDataResponse } from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';
import {
  sendTransaction,
  switchChain,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnector } from '../../../..';
import { walletConfig } from '../../../../constants/configs';
import { allChainsAtom } from '../../../../store/stateStore';

export const useEvmHandler = (externalEvmWalletConnector?: WalletConnector) => {
  const { isConnected: isEvmConnected } = useAccount();
  const allChains = useAtomValue(allChainsAtom);

  const handleEvmTransaction = useCallback(
    async (transactionDetails: EVMTransactionDataResponse): Promise<string> => {
      const chain = allChains.find(
        (chain) => chain.name === transactionDetails.blockChain,
      );

      if (externalEvmWalletConnector) {
        console.log('externalEvmWalletConnector: ', externalEvmWalletConnector);
        if (!externalEvmWalletConnector.isConnected) {
          throw new TransactionError(
            'EVM wallet not connected. Please connect your wallet.',
          );
        }

        if (chain?.chainId !== (await externalEvmWalletConnector.getChain())) {
          await externalEvmWalletConnector.switchChain(chain?.chainId || 0);
        }

        const txHash =
          await externalEvmWalletConnector.signTransaction(transactionDetails);

        return txHash;
      }

      if (!isEvmConnected) {
        throw new TransactionError(
          'EVM wallet not connected. Please connect your wallet.',
        );
      }

      try {
        if (!chain || !chain.chainId) {
          throw new TransactionError(
            `Unsupported blockchain: ${transactionDetails.blockChain}`,
          );
        }

        await switchChain(walletConfig, {
          chainId: chain.chainId,
        });

        if (transactionDetails.isApprovalTx) {
          const txHash = await sendTransaction(walletConfig, {
            to: transactionDetails.to as `0x${string}`,
            data: transactionDetails.data! as `0x${string}`,
          });
          await waitForTransactionReceipt(walletConfig, {
            hash: txHash,
          });

          return txHash;
        } else {
          const txHash = await sendTransaction(walletConfig, {
            to: transactionDetails.to as `0x${string}`,
            value: BigInt(transactionDetails.value!),
            data: transactionDetails.data! as `0x${string}`,
          });
          await waitForTransactionReceipt(walletConfig, {
            hash: txHash,
          });

          return txHash;
        }
      } catch (error) {
        console.error(error);
        throw new TransactionError(
          'Failed to send EVM transaction',
          error instanceof Error ? error.message : error,
        );
      }
    },
    [],
  );

  return {
    handleEvmTransaction,
  };
};
