import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useSolana } from '../../../../../providers/useSolana';
import {
  currentUiStepAtom,
  inTokenAmountAtom,
  inTokenAtom,
} from '../../../../../store/stateStore';
import { getEvmTokenBalance } from '../../../../../utils';

export const useTokenInputBox = () => {
  const inToken = useAtomValue(inTokenAtom);
  const [inTokenAmount, setInTokenAmount] = useAtom(inTokenAmountAtom);
  const currentStep = useAtomValue(currentUiStepAtom);
  const { getSolanaTokenBalance } = useSolana();
  const { address: evmAddress } = useAccount();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const getBalance = async () => {
    if (inToken) {
      if (inToken?.chain?.chainType === 'SOLANA' && publicKey) {
        const balance = await getSolanaTokenBalance(
          inToken.tokenAddress ?? '',
          publicKey.toString(),
        );
        setBalance(balance);
      } else if (inToken?.chain?.chainType === 'EVM' && evmAddress) {
        const balance = await getEvmTokenBalance(
          inToken.chain?.chainId ?? 1,
          inToken.tokenAddress ?? '',
          evmAddress,
        );
        setBalance(balance);
      }
    }
  };

  const maxButtonClick = async () => {
    setInTokenAmount(balance);
  };

  useEffect(() => {
    if (
      currentStep === 1 &&
      balance &&
      inTokenAmount &&
      parseFloat(balance) < parseFloat(inTokenAmount)
    ) {
      setInTokenAmount(balance);
    }
  }, [inTokenAmount, balance, currentStep]);

  useEffect(() => {
    getBalance();
  }, [inToken, evmAddress, publicKey]);

  useEffect(() => {
    if (inTokenAmount) {
      setInTokenAmount(inTokenAmount.toString());
    }
  }, [inTokenAmount]);

  return {
    currentStep,
    inToken,
    inTokenAmount,
    setInTokenAmount,
    maxButtonClick,
    balance,
  };
};
