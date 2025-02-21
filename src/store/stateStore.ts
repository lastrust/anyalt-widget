import {
  AnyAlt,
  BestRouteResponse,
  SupportedChain,
  SupportedToken,
} from '@anyalt/sdk';
import { atom } from 'jotai';
import { EstimateResponse, Token } from '..';
import {
  TransactionsProgress,
  TransactionStatusList,
} from '../types/transaction';

export const anyaltInstanceAtom = atom<AnyAlt | undefined>(undefined);

export const inTokenAtom = atom<SupportedToken | undefined>(undefined);

export const allChainsAtom = atom<SupportedChain[]>([]);

export const protocolInputTokenAtom = atom<SupportedToken | undefined>(
  undefined,
);

export const protocolFinalTokenAtom = atom<Token | undefined>(undefined);

export const slippageAtom = atom<string>('3');

export const inTokenAmountAtom = atom<string | undefined>('');

export const bestRouteAtom = atom<BestRouteResponse | undefined>(undefined);

export const finalTokenEstimateAtom = atom<EstimateResponse | undefined>(
  undefined,
);

export const selectedRouteAtom = atom<BestRouteResponse | undefined>(undefined);

export const activeOperationIdAtom = atom<string | undefined>(undefined);

export const transactionIndexAtom = atom<number>(1);

export const transactionsProgressAtom = atom<TransactionsProgress | undefined>(
  undefined,
);

export const finalTokenAmountAtom = atom<string>('');

export const currentUiStepAtom = atom<number>(0);

export const transactionsListAtom = atom<TransactionStatusList | undefined>(
  undefined,
);

export const isTokenBuyTemplateAtom = atom<boolean>(false);

export const minDepositAmountAtom = atom<number>(0);

export const swapDataAtom = atom<{
  swapIsFinished: boolean;
  isCrosschainSwapError: boolean;
  crosschainSwapOutputAmount: string;
  totalSteps: number;
}>({
  swapIsFinished: false,
  isCrosschainSwapError: false,
  crosschainSwapOutputAmount: '0',
  totalSteps: 0,
});

export const tokenFetchErrorAtom = atom<{
  isError: boolean;
  errorMessage: string;
}>({
  isError: false,
  errorMessage: '',
});
