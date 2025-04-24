import { GetOnramperOperationResponse } from '@anyalt/sdk/dist/adapter/api/api';
import { useAtom, useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';
import {
  anyaltInstanceAtom,
  choosenFiatPaymentAtom,
  choosenOnrampPaymentAtom,
  onramperOperationIdAtom,
  selectedTokenOrFiatAmountAtom,
  transactionIndexAtom,
} from '../../../store/stateStore';

export const useHadleFiatTx = () => {
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const onramperOperationId = useAtomValue(onramperOperationIdAtom);
  const choosenFiatPaymentMethod = useAtomValue(choosenFiatPaymentAtom);
  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);
  const choosenOnrampPayment = useAtomValue(choosenOnrampPaymentAtom);
  const [transactionIndex, setTransactionIndex] = useAtom(transactionIndexAtom);

  const { address: evmAddress } = useAccount();

  const waitUntilTxIsConfirmed = async (): Promise<
    GetOnramperOperationResponse | undefined
  > => {
    const res = await anyaltInstance?.getOnramperOperation(
      onramperOperationId || '',
    );
    return res;
  };

  const poolUntilTxIsConfirmed = async (): Promise<
    GetOnramperOperationResponse | undefined
  > => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const res = await waitUntilTxIsConfirmed();
          console.log('res', res);

          if (res?.status === 'COMPLETED') {
            clearInterval(interval);
            resolve(res);
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 5000);

      // Set a timeout to prevent infinite polling
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Transaction confirmation timeout'));
      }, 300000); // 5 minutes timeout
    });
  };

  const executeFiatTransaction = async () => {
    try {
      if (!anyaltInstance || !evmAddress || !onramperOperationId) {
        throw new Error('Missing required parameters for transaction');
      }

      const tx = await anyaltInstance.createTransaction({
        onramperOperationId: onramperOperationId || '',
        onramp: choosenOnrampPayment?.ramp || '',
        paymentMethod: choosenFiatPaymentMethod?.paymentTypeId || '',
        amount: Number(selectedTokenOrFiatAmount),
        quoteAmount: String(choosenOnrampPayment?.payout) || '',
        walletAddress: evmAddress || '',
      });

      window.open(tx.transactionUrl, '_blank');

      // Properly await the polling process
      const result = await poolUntilTxIsConfirmed();
      console.log('Transaction confirmed:', result);

      setTransactionIndex(transactionIndex + 1);

      return result;
    } catch (error) {
      console.error('Error in executeFiatTransaction:', error);
      throw error; // Re-throw to allow caller to handle the error
    }
  };

  return { executeFiatTransaction };
};
