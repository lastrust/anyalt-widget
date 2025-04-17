import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useSolana } from '../../../../../providers/useSolana';
import {
  selectedCurrencyAtom,
  selectedTokenAtom,
  selectedTokenOrFiatAmountAtom,
  tokenFetchErrorAtom,
  widgetModeAtom,
} from '../../../../../store/stateStore';
import { getEvmTokenBalance } from '../../../../../utils';

export const useTokenInputBox = () => {
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const widgetMode = useAtomValue(widgetModeAtom);
  const selectedToken = useAtomValue(selectedTokenAtom);
  const selectedCurrency = useAtomValue(selectedCurrencyAtom);
  const tokenFetchError = useAtomValue(tokenFetchErrorAtom);

  const [selectedTokenOrFiatAmount, setSelectedTokenOrFiatAmount] = useAtom(
    selectedTokenOrFiatAmountAtom,
  );

  const title = useMemo(() => {
    return widgetMode === 'crypto'
      ? 'Choose Your Deposit'
      : 'Select Your Currency ';
  }, [widgetMode]);

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
    setSelectedTokenOrFiatAmount(balance);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(',', '.');
    const regex = /^\d*\.?\d*$/;
    const isEmptyInput = inputValue === '';
    const isOnlyNumberOrOneDot = new RegExp(regex, 'g').test(inputValue);

    if (isEmptyInput || isOnlyNumberOrOneDot) {
      setSelectedTokenOrFiatAmount(inputValue);
    }
  };

  useEffect(() => {
    getBalance();
  }, [selectedToken, evmAddress, publicKey, bitcoinAccount, solanaConnection]);

  useEffect(() => {
    if (selectedTokenOrFiatAmount) {
      setSelectedTokenOrFiatAmount(selectedTokenOrFiatAmount.toString());
    }
  }, [selectedTokenOrFiatAmount]);

  return {
    title,
    widgetMode,
    selectedToken,
    selectedCurrency,
    selectedTokenOrFiatAmount,
    setSelectedTokenOrFiatAmount,
    handleInputChange,
    tokenFetchError,
    maxButtonClick,
    balance,
    isWalletConnected,
  };
};
