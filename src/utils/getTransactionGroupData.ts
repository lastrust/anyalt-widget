// import { BestRouteResponse } from '@anyalt/sdk';
// import { TransactionDetailsType } from '../types/transaction';

// //TODO: Need to separate cases when there is internal swaps and when there is not
// /*
// This function is used for displaying transaction steps for swapping of tokens
// 1. For example if no internal swaps, then need to get data directly from swap object
// 2. If internal swaps exist, then it should collect
// */
// export const getTransactionGroupData = (
//   transactionData: BestRouteResponse,
// ): TransactionDetailsType[] => {
//   return transactionData.swapSteps.map((swapStep) => ({
//     operationId: transactionData.operationId,
//     gasPrice:
//       swapStep.fees
//         .filter((fee) => fee.expenseType === 'FROM_SOURCE_WALLET')
//         .reduce((acc, fee) => {
//           return acc + fee.price * parseFloat(fee.amount);
//         }, 0)
//         .toString() || '0',
//     time: swapStep.estimatedTimeInSeconds?.toString() || '0',
//     profit: '0.00', //TODO: Ask Sahadat to add profit in response
//     swapperLogo: swapStep.swapperLogoUrl,
//     swapperName: swapStep.swapperName,
//     swapperType: swapStep.swapperType,
//     swapChainType: swapStep.swapType,
//     fromAmount: swapStep.amount,
//     toAmount: swapStep.payout,
//     requiredSings: 1,
//     from: {
//       name: swapStep.sourceToken.symbol,
//       icon: swapStep.sourceToken.logo,
//       amount: swapStep.amount,
//       usdAmount: (
//         swapStep.sourceToken.tokenUsdPrice * parseFloat(swapStep.amount)
//       ).toFixed(2),
//       chainName: swapStep.sourceToken.blockchain,
//       chainIcon: swapStep.sourceToken.blockchainLogo,
//     },
//     to: {
//       name: swapStep.destinationToken.symbol,
//       icon: swapStep.destinationToken.logo,
//       amount: swapStep.payout,
//       usdAmount: (
//         swapStep.destinationToken.tokenUsdPrice * parseFloat(swapStep.payout)
//       ).toFixed(2),
//       chainName: swapStep.destinationToken.blockchain,
//       chainIcon: swapStep.destinationToken.blockchainLogo,
//     },
//     status: 'Pending' as const,
//   }));
// };
