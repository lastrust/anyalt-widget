import { useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';
import {
  anyaltInstanceAtom,
  choosenFiatPaymentAtom,
  choosenOnrampPaymentAtom,
  onramperOperationIdAtom,
  selectedTokenOrFiatAmountAtom,
} from '../../../store/stateStore';

export const useHadleFiatTx = () => {
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const onramperOperationId = useAtomValue(onramperOperationIdAtom);
  const choosenFiatPaymentMethod = useAtomValue(choosenFiatPaymentAtom);
  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);
  const choosenOnrampPayment = useAtomValue(choosenOnrampPaymentAtom);

  const { address: evmAddress } = useAccount();

//   const waitUntilTxIsConfirmed = async (tx: any) => {
//     const txHash = tx.transactionHash;
//     const txReceipt = await anyaltInstance?.getTransactionReceipt(txHash);
//     return txReceipt?.status === 'success';
//   };

  const executeFiatTransaction = async () => {
    try {
      if (!anyaltInstance || !evmAddress || !onramperOperationId) return;

      const tx = await anyaltInstance.createTransaction({
        onramperOperationId: onramperOperationId || '',
        onramp: choosenOnrampPayment?.ramp || '',
        paymentMethod: choosenFiatPaymentMethod?.paymentTypeId || '',
        amount: Number(selectedTokenOrFiatAmount),
        quoteAmount: String(choosenOnrampPayment?.payout) || '',
        walletAddress: evmAddress || '',
      });

      window.open(tx.transactionUrl, '_blank');

      
    } catch (error) {
      console.error(error);
    }
  };

  return { executeFiatTransaction };
};
