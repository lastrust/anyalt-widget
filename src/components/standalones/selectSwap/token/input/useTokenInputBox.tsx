import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useSolana } from '../../../../../providers/useSolana';
import {
  currentUiStepAtom,
  outputTokenAmountAtom,
  outputTokenAtom,
  tokenFetchErrorAtom,
} from '../../../../../store/stateStore';
import { getEvmTokenBalance } from '../../../../../utils';

export const useTokenInputBox = () => {
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const outputToken = useAtomValue(outputTokenAtom);
  const currentStep = useAtomValue(currentUiStepAtom);
  const tokenFetchError = useAtomValue(tokenFetchErrorAtom);
  const [, setTokenFetchError] = useAtom(tokenFetchErrorAtom);
  const [outputTokenAmount, setOutputTokenAmount] = useAtom(
    outputTokenAmountAtom,
  );

  const { publicKey } = useWallet();
  const { getSolanaTokenBalance, connection: solanaConnection } = useSolana();
  const { address: evmAddress } = useAccount();
  const { account: bitcoinAccount, getBalance: getBitcoinBalance } =
    useBitcoinWallet();

  const isWalletConnected = useMemo(() => {
    const tokenType = outputToken?.chain?.chainType;
    const isEvmWallet = tokenType === 'EVM' && evmAddress;
    const isSolanaWallet = tokenType === 'SOLANA' && publicKey;
    const isBtcWallet = tokenType === 'BTC' && bitcoinAccount;
    return isEvmWallet || isSolanaWallet || isBtcWallet;
  }, [outputToken, evmAddress, publicKey, bitcoinAccount]);

  const getBalance = async () => {
    const tokenType = outputToken?.chain?.chainType;
    const isEvmWallet = tokenType === 'EVM' && evmAddress;
    const isSolanaWallet = tokenType === 'SOLANA' && publicKey;
    const isBtcWallet = tokenType === 'BTC' && bitcoinAccount;

    if (outputToken) {
      if (isSolanaWallet) {
        const balance = await getSolanaTokenBalance(
          outputToken.tokenAddress ?? '',
          publicKey.toString(),
        );

        setBalance(balance);
      } else if (isEvmWallet) {
        const balance = await getEvmTokenBalance(
          outputToken.chain?.chainId ?? 1,
          outputToken.tokenAddress ?? '',
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
    setOutputTokenAmount(balance);
  };

  useEffect(() => {
    if (currentStep === 1 && balance && outputTokenAmount) {
      if (parseFloat(balance) < parseFloat(outputTokenAmount)) {
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
  }, [outputTokenAmount, balance, currentStep]);

  useEffect(() => {
    getBalance();
  }, [outputToken, evmAddress, publicKey, bitcoinAccount, solanaConnection]);

  useEffect(() => {
    if (outputTokenAmount) {
      setOutputTokenAmount(outputTokenAmount.toString());
    }
  }, [outputTokenAmount]);

  return {
    currentStep,
    inToken: outputToken,
    inTokenAmount: outputTokenAmount,
    setInTokenAmount: setOutputTokenAmount,
    tokenFetchError,
    maxButtonClick,
    balance,
    isWalletConnected,
  };
};
