import { SupportedChain, SupportedToken } from '@anyalt/sdk';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import {
  allChainsAtom,
  anyaltInstanceAtom,
} from '../../../../store/stateStore';
import {
  isValidEthereumAddress,
  isValidSolanaAddress,
} from '../../../../utils';
import { ChainType } from '../../../../utils/chains';

export const useTokenSelectModal = () => {
  const allChains = useAtomValue(allChainsAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);

  const [showAccept, setShowAccept] = useState<boolean>(false);
  const [allTokens, setAllTokens] = useState<SupportedToken[]>([]);
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [customToken, setCustomToken] = useState<SupportedToken | null>(null);
  const [activeChain, setActiveChain] = useState<SupportedChain | null>(null);
  const [chains, setChains] = useState<SupportedChain[]>(allChains.slice(0, 8));

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setChains(allChains);
    if (allChains.length > 0) {
      setActiveChain(allChains[0]);
    }
  }, [allChains]);

  const fetchTokens = async () => {
    try {
      setCustomToken(null);
      setAllTokens([]);
      setIsLoading(true);
      if (activeChain) {
        const isEmptyInput = searchInputValue.length === 0;

        if (isEmptyInput) {
          const res = await anyaltInstance?.getTokens({
            chainId: activeChain.id,
            page: 0,
            pageSize: 100,
          });

          setAllTokens(res?.tokens ?? []);
          return;
        }

        const isValidAddress =
          activeChain?.chainType === ChainType.SOLANA
            ? isValidSolanaAddress(searchInputValue)
            : isValidEthereumAddress(searchInputValue);

        if (isValidAddress) {
          const res = await anyaltInstance?.getToken(
            activeChain.name,
            searchInputValue,
          );

          setCustomToken(res ?? null);
        } else {
          const res = await anyaltInstance?.getTokens({
            keyword: searchInputValue,
            chainId: activeChain.id,
            page: 0,
            pageSize: 100,
          });

          setAllTokens(res?.tokens ?? []);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [activeChain, searchInputValue]);

  const isValidAddress = useMemo(() => {
    return activeChain?.chainType === ChainType.SOLANA
      ? isValidSolanaAddress(searchInputValue)
      : isValidEthereumAddress(searchInputValue);
  }, [activeChain, searchInputValue]);

  return {
    chains,
    allTokens,
    isLoading,
    showAccept,
    customToken,
    setShowAccept,
    isValidAddress,
    setSearchInputValue,
    activeChain,
    setActiveChain,
    searchInputValue,
  };
};
