import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useSolana } from '../../../../../providers/useSolana';
import {
  currentUiStepAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  tokenFetchErrorAtom,
} from '../../../../../store/stateStore';
import { getEvmTokenBalance } from '../../../../../utils';

export const useTokenInputBox = () => {
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const selectedToken = useAtomValue(selectedTokenAtom);
  const currentStep = useAtomValue(currentUiStepAtom);
  const tokenFetchError = useAtomValue(tokenFetchErrorAtom);
  const [, setTokenFetchError] = useAtom(tokenFetchErrorAtom);
  const [selectedTokenAmount, setSelectedTokenAmount] = useAtom(
    selectedTokenAmountAtom,
  );

  const { publicKey } = useWallet();
  const { getSolanaTokenBalance, connection: solanaConnection } = useSolana();
  const { address: evmAddress } = useAccount();
  const { account: bitcoinAccount, getBalance: getBitcoinBalance } =
    useBitcoinWallet();

  const isWalletConnected = useMemo(() => {
    const tokenType = selectedToken?.chain?.chainType;
    const isEvmWallet = tokenType === 'EVM' && evmAddress;
    const isSolanaWallet = tokenType === 'SOLANA' && publicKey;
    const isBtcWallet = tokenType === 'BTC' && bitcoinAccount;
    return isEvmWallet || isSolanaWallet || isBtcWallet;
  }, [selectedToken, evmAddress, publicKey, bitcoinAccount]);

  const getBalance = async () => {
    const tokenType = selectedToken?.chain?.chainType;
    const isEvmWallet = tokenType === 'EVM' && evmAddress;
    const isSolanaWallet = tokenType === 'SOLANA' && publicKey;
    const isBtcWallet = tokenType === 'BTC' && bitcoinAccount;

    if (selectedToken) {
      if (isSolanaWallet) {
        const balance = await getSolanaTokenBalance(
          selectedToken.tokenAddress ?? '',
          publicKey.toString(),
        );

        setBalance(balance);
      } else if (isEvmWallet) {
        const balance = await getEvmTokenBalance(
          selectedToken.chain?.chainId ?? 1,
          selectedToken.tokenAddress ?? '',
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
    setSelectedTokenAmount(balance);
  };

  useEffect(() => {
    if (currentStep === 1 && balance && selectedTokenAmount) {
      if (parseFloat(balance) < parseFloat(selectedTokenAmount)) {
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
  }, [selectedTokenAmount, balance, currentStep]);

  useEffect(() => {
    getBalance();
  }, [selectedToken, evmAddress, publicKey, bitcoinAccount, solanaConnection]);

  useEffect(() => {
    if (selectedTokenAmount) {
      setSelectedTokenAmount(selectedTokenAmount.toString());
    }
  }, [selectedTokenAmount]);

  return {
    currentStep,
    inToken: selectedToken,
    inTokenAmount: selectedTokenAmount,
    setInTokenAmount: setSelectedTokenAmount,
    tokenFetchError,
    maxButtonClick,
    balance,
    isWalletConnected,
  };
};
