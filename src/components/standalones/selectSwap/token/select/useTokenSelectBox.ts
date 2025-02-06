import { SupportedChain, SupportedToken } from '@anyalt/sdk';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import {
  allChainsAtom,
  anyaltInstanceAtom,
} from '../../../../../store/stateStore';
import {
  isValidEthereumAddress,
  isValidSolanaAddress,
} from '../../../../../utils';

export const useTokenSelectBox = () => {
  const allChains = useAtomValue(allChainsAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const [showAllChains, setShowAllChains] = useState<boolean>(false);
  const [chains, setChains] = useState<SupportedChain[]>(allChains.slice(0, 8));
  const [activeChain, setActiveChain] = useState<SupportedChain | null>(null);
  const [allTokens, setAllTokens] = useState<SupportedToken[]>([]);
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [customToken, setCustomToken] = useState<SupportedToken | null>(null);
  const [showAccept, setShowAccept] = useState<boolean>(false);

  useEffect(() => {
    if (showAllChains) {
      setChains(allChains);
    } else {
      setChains(allChains.slice(0, 8));
    }
    if (allChains.length > 0) {
      setActiveChain(allChains[0]);
    }
  }, [showAllChains, allChains]);

  useEffect(() => {
    if (activeChain) {
      if (searchInputValue.length === 0) {
        anyaltInstance
          ?.getTokens({
            chainId: activeChain.id,
            page: 0,
            pageSize: 100,
          })
          .then((res) => {
            setAllTokens(res.tokens);
          });
      } else {
        const isValidAddress =
          activeChain?.chainType === 'solana'
            ? isValidSolanaAddress(searchInputValue)
            : isValidEthereumAddress(searchInputValue);
        if (isValidAddress) {
          anyaltInstance
            ?.getToken(activeChain.id, searchInputValue)
            .then((res) => {
              setCustomToken(res);
            });
        } else {
          anyaltInstance
            ?.getTokens({
              keyword: searchInputValue,
              chainId: activeChain.id,
              page: 0,
              pageSize: 100,
            })
            .then((res) => {
              setAllTokens(res.tokens);
            });
        }
      }
    }
  }, [activeChain, searchInputValue]);

  const isValidAddress = useMemo(() => {
    return activeChain?.chainType === 'solana'
      ? isValidSolanaAddress(searchInputValue)
      : isValidEthereumAddress(searchInputValue);
  }, [activeChain, searchInputValue]);

  return {
    showAccept,
    setShowAccept,
    isValidAddress,
    setSearchInputValue,
    customToken,
    chains,
    allTokens,
    activeChain,
    setActiveChain,
    showAllChains,
    setShowAllChains,
    searchInputValue,
  };
};
