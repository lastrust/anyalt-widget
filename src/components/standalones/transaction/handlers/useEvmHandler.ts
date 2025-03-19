import { EVMTransactionDataResponse } from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';
import {
  getTransactionCount,
  sendTransaction,
  switchChain,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnector } from '../../../..';
import { config } from '../../../../constants/configs';
import { allChainsAtom } from '../../../../store/stateStore';
import { chainIdsValues } from '../../../../utils/chains';
import { TransactionResult } from './useHandleTransaction';

export const useEvmHandler = (externalEvmWalletConnector?: WalletConnector) => {
  const { isConnected: isEvmConnected, address } = useAccount();
  const allChains = useAtomValue(allChainsAtom);

  const handleEvmTransaction = useCallback(
    async (
      transactionDetails: EVMTransactionDataResponse,
    ): Promise<TransactionResult> => {
      const chain = allChains.find(
        (chain) => chain.name === transactionDetails.blockChain,
      );

      // Handle external wallet connector path
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

        // Assuming we can get the address from the external connector
        const walletAddress = await externalEvmWalletConnector.address;

        // Get the current nonce for the address before transaction
        const nonce = await getTransactionCount(config, {
          address: walletAddress as `0x${string}`,
        });

        const txHash =
          await externalEvmWalletConnector.signTransaction(transactionDetails);

        return {
          txHash,
          nonce,
        };
      }

      // Handle direct wagmi path
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

        await switchChain(config, {
          chainId: chain.chainId as chainIdsValues,
        });

        // Get the current nonce for the connected address
        if (!address) {
          throw new TransactionError('No wallet address available');
        }

        const nonce = await getTransactionCount(config, {
          address,
        });

        if (transactionDetails.isApprovalTx) {
          const txHash = await sendTransaction(config, {
            to: transactionDetails.to as `0x${string}`,
            data: transactionDetails.data! as `0x${string}`,
            nonce, // Explicitly set the nonce
          });
          await waitForTransactionReceipt(config, {
            hash: txHash,
          });

          return {
            txHash,
            nonce,
          };
        } else {
          const txHash = await sendTransaction(config, {
            to: transactionDetails.to as `0x${string}`,
            value: BigInt(transactionDetails.value || 0),
            data: transactionDetails.data! as `0x${string}`,
            nonce, // Explicitly set the nonce
          });
          await waitForTransactionReceipt(config, {
            hash: txHash,
          });
          return {
            txHash,
            nonce,
          };
        }
      } catch (error) {
        console.error(error);
        throw new TransactionError(
          'Failed to send EVM transaction',
          error instanceof Error ? error.message : error,
        );
      }
    },
    [address, allChains, externalEvmWalletConnector, isEvmConnected],
  );

  return {
    handleEvmTransaction,
  };
};
