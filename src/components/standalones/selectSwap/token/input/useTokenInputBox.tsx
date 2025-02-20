import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useSolana } from '../../../../../providers/useSolana';
import {
  currentUiStepAtom,
  inTokenAmountAtom,
  inTokenAtom,
  tokenFetchErrorAtom,
} from '../../../../../store/stateStore';
import { getEvmTokenBalance } from '../../../../../utils';

export const useTokenInputBox = () => {
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const inToken = useAtomValue(inTokenAtom);
  const currentStep = useAtomValue(currentUiStepAtom);
  const tokenFetchError = useAtomValue(tokenFetchErrorAtom);
  const [, setTokenFetchError] = useAtom(tokenFetchErrorAtom);
  const [inTokenAmount, setInTokenAmount] = useAtom(inTokenAmountAtom);

  const { publicKey } = useWallet();
  const { getSolanaTokenBalance, connection: solanaConnection } = useSolana();
  const { address: evmAddress } = useAccount();
  const { account: bitcoinAccount, getBalance: getBitcoinBalance } =
    useBitcoinWallet();

  const isWalletConnected = useMemo(() => {
    const tokenType = inToken?.chain?.chainType;
    const isEvmWallet = tokenType === 'EVM' && evmAddress;
    const isSolanaWallet = tokenType === 'SOLANA' && publicKey;
    const isBtcWallet = tokenType === 'BTC' && bitcoinAccount;
    return isEvmWallet || isSolanaWallet || isBtcWallet;
  }, [inToken, evmAddress, publicKey, bitcoinAccount]);

  const getBalance = async () => {
    const tokenType = inToken?.chain?.chainType;
    const isEvmWallet = tokenType === 'EVM' && evmAddress;
    const isSolanaWallet = tokenType === 'SOLANA' && publicKey;
    const isBtcWallet = tokenType === 'BTC' && bitcoinAccount;

    if (inToken) {
      if (isSolanaWallet) {
        const balance = await getSolanaTokenBalance(
          inToken.tokenAddress ?? '',
          publicKey.toString(),
        );

        setBalance(balance);
      } else if (isEvmWallet) {
        const balance = await getEvmTokenBalance(
          inToken.chain?.chainId ?? 1,
          inToken.tokenAddress ?? '',
          evmAddress,
        );

        setBalance(balance);
      } else if (isBtcWallet) {
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
    if (currentStep === 1 && balance && inTokenAmount) {
      if (parseFloat(balance) < parseFloat(inTokenAmount)) {
        setTokenFetchError({
          isError: true,
          errorMessage: `Not enough balance.`,
        });
      } else {
        setTokenFetchError({
          isError: false,
          errorMessage: '',
        });
      }
    }
  }, [inTokenAmount, balance, currentStep]);

  useEffect(() => {
    getBalance();
  }, [inToken, evmAddress, publicKey, bitcoinAccount, solanaConnection]);

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
    tokenFetchError,
    maxButtonClick,
    balance,
    isWalletConnected,
  };
};
