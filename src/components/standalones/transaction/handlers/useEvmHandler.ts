import { EVMTransactionDataResponse } from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';
import {
  getGasPrice,
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

const GAS_PRICE_INCREASE_FACTOR = 2; // set gas price to 2x

const EIP1559_SUPPORTED_CHAINS = [
  1, // Ethereum
  42161, // Arbitrum
  43114, // Avalanche
  8453, // Base
  56, // BSC/BNB Chain
  10, // Optimism
  137, // Polygon
  59144, // Linea
];

export const useEvmHandler = (externalEvmWalletConnector?: WalletConnector) => {
  const { isConnected: isEvmConnected, address } = useAccount();
  const allChains = useAtomValue(allChainsAtom);

  const handleEvmTransaction = useCallback(
    async (
      transactionDetails: EVMTransactionDataResponse,
      higherGasCost?: boolean,
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
        const nonce =
          Number(transactionDetails.nonce) ||
          (await getTransactionCount(config, {
            address: walletAddress as `0x${string}`,
          }));

        if (higherGasCost) {
          // NEED TO FIGURE OUT HOW TO INCREASE GAS FOR THE EXTERNAL WALLET CONNECTOR
        }

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

        if (!address) {
          throw new TransactionError('No wallet address available');
        }

        const nonce = await getTransactionCount(config, {
          address,
        });

        const txParams: any = {
          to: transactionDetails.to as `0x${string}`,
          data: transactionDetails.data! as `0x${string}`,
          nonce, // Explicitly set the nonce
        };

        if (!transactionDetails.isApprovalTx) {
          txParams.value = BigInt(transactionDetails.value || 0);
        }

        if (higherGasCost) {
          const gasPrice = await getGasPrice(config);

          // For EIP-1559 compatible chains
          if (
            chain.chainId &&
            EIP1559_SUPPORTED_CHAINS.includes(chain.chainId)
          ) {
            const increasedGasPrice = BigInt(
              Math.floor(Number(gasPrice) * GAS_PRICE_INCREASE_FACTOR),
            );

            txParams.maxFeePerGas = increasedGasPrice;
            txParams.maxPriorityFeePerGas = BigInt(
              Math.floor(Number(increasedGasPrice) / 2),
            );
          } else {
            // For legacy transactions
            txParams.gasPrice = BigInt(
              Math.floor(Number(gasPrice) * GAS_PRICE_INCREASE_FACTOR),
            );
          }
        }

        // Send transaction
        const txHash = await sendTransaction(config, txParams);

        await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        return {
          txHash,
          nonce,
        };
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
