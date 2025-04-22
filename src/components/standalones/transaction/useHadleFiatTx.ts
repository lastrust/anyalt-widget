import { useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';
import {
  activeOperationIdAtom,
  anyaltInstanceAtom,
  choosenFiatPaymentAtom,
  choosenOnrampPaymentAtom,
  selectedTokenOrFiatAmountAtom,
} from '../../../store/stateStore';

export const useHadleFiatTx = () => {
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const activeOperationId = useAtomValue(activeOperationIdAtom);
  const choosenFiatPaymentMethod = useAtomValue(choosenFiatPaymentAtom);
  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);
  const choosenOnrampPayment = useAtomValue(choosenOnrampPaymentAtom);

  const { address: evmAddress } = useAccount();

  const handleFiatTransaction = async () => {
    try {
      if (!anyaltInstance || !evmAddress) return;

      const tx = await anyaltInstance.createTransaction({
        onramperOperationId: activeOperationId || '',
        onramp: choosenOnrampPayment?.ramp || '',
        paymentMethod: choosenFiatPaymentMethod?.paymentTypeId || '',
        amount: Number(selectedTokenOrFiatAmount),
        quoteAmount: selectedTokenOrFiatAmount || '',
        walletAddress: evmAddress || '',
      });
      console.log(tx);
    } catch (error) {
      console.error(error);
    }
  };

  return { handleFiatTransaction };
};
