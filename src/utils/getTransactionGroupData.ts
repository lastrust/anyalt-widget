import { BestRouteResponse } from '@anyalt/sdk';
import { TransactionDetailsType } from '../types/transaction';

//TODO: Need to separate cases when there is internal swaps and when there is not
/*
This function is used for displaying transaction steps for swapping of tokens
1. For example if no internal swaps, then need to get data directly from swap object
2. If internal swaps exist, then it should collect 
*/
export const getTransactionGroupData = (
  transactionData: BestRouteResponse,
): TransactionDetailsType[] => {
  return transactionData.swaps.flatMap((swap) => {
    if (swap.internalSwaps) {
      return swap.internalSwaps.map((internalSwap) => ({
        requestId: transactionData?.requestId || '',
        gasPrice: internalSwap?.fee[0]?.price?.toString() || '0',
        time: internalSwap?.estimatedTimeInSeconds?.toString() || '0',
        profit: '0.00', //TODO: Ask Sahadat to add profit in response
        swapperLogo: swap.swapperLogo,
        swapperName: swap.swapperId,
        swapperType: swap.swapperType,
        fromAmount: swap.fromAmount,
        toAmount: swap.toAmount,
        requiredSings: swap.maxRequiredSign,
        from: {
          name: internalSwap?.from.symbol || '',
          icon: internalSwap?.from.logo,
          amount: internalSwap?.fromAmount || '0',
          usdAmount: internalSwap?.from.usdPrice?.toString() || '0',
          chainName: internalSwap?.from.blockchain,
          chainIcon: internalSwap?.from.blockchainLogo,
        },
        to: {
          name: internalSwap?.to.symbol,
          icon: internalSwap?.to.logo,
          amount: internalSwap?.toAmount || '0',
          usdAmount: internalSwap?.to.usdPrice?.toString() || '0',
          chainName: internalSwap?.to.blockchain,
          chainIcon: internalSwap?.to.blockchainLogo,
        },
        status: 'Pending' as const,
      }));
    } else {
      return [
        {
          requestId: transactionData?.requestId || '',
          gasPrice: swap?.fee[0]?.price?.toString() || '0',
          time: swap?.estimatedTimeInSeconds?.toString() || '0',
          profit: '0.00', //TODO: Ask Sahadat to add profit in response
          swapperLogo: swap.swapperLogo,
          swapperName: swap.swapperId,
          swapperType: swap.swapperType,
          fromAmount: swap.fromAmount,
          toAmount: swap.toAmount,
          requiredSings: swap.maxRequiredSign,
          from: {
            name: swap?.from.symbol || '',
            icon: swap?.from.logo,
            amount: swap?.fromAmount || '0',
            usdAmount: swap?.from.usdPrice?.toString() || '0',
            chainName: swap?.from.blockchain,
            chainIcon: swap?.from.blockchainLogo,
          },
          to: {
            name: swap?.to.symbol,
            icon: swap?.to.logo,
            amount: swap?.toAmount || '0',
            usdAmount: swap?.to.usdPrice?.toString() || '0',
            chainName: swap?.to.blockchain,
            chainIcon: swap?.to.blockchainLogo,
          },
          status: 'Pending' as const,
        },
      ];
    }
  });
};
