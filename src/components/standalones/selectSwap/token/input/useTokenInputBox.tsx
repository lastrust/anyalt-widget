import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useSolana } from '../../../../../providers/useSolana';
import {
  currentUiStepAtom,
  inTokenAmountAtom,
  inTokenAtom,
} from '../../../../../store/stateStore';
import { getEvmTokenBalance } from '../../../../../utils';

export const useTokenInputBox = () => {
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const inToken = useAtomValue(inTokenAtom);
  const currentStep = useAtomValue(currentUiStepAtom);
  const [inTokenAmount, setInTokenAmount] = useAtom(inTokenAmountAtom);

  const { publicKey } = useWallet();
  const { getSolanaTokenBalance } = useSolana();
  const { address: evmAddress } = useAccount();
  const { account: bitcoinAccount, getBalance: getBitcoinBalance } =
    useBitcoinWallet();

  const getBalance = async () => {
    if (inToken) {
      console.log(inToken);
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
      } else if (inToken?.chain?.name === 'BTC' && bitcoinAccount) {
        console.log('BTC balance');
        const balance = await getBitcoinBalance();
        if (balance.value && balance.decimals) {
          setBalance(formatUnits(balance.value, balance.decimals));
        }
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
  }, [inToken, evmAddress, publicKey, bitcoinAccount]);

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
