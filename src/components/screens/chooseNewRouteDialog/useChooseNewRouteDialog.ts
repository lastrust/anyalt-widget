import { useAtom } from 'jotai';
import { shouldFetchCryptoRoutesAtom } from '../../../store/stateStore';

export const useChooseNewRouteDialog = () => {
  const [shouldFetchCryptoRoutes, setShouldFetchCryptoRoutes] = useAtom(
    shouldFetchCryptoRoutesAtom,
  );

  return {
    shouldFetchCryptoRoutes,
    setShouldFetchCryptoRoutes,
  };
};
