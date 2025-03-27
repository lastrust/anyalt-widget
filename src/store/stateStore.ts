import {
  AnyAlt,
  BestRouteResponse,
  SupportedChain,
  SupportedToken,
} from '@anyalt/sdk';
import { atom } from 'jotai';
import { EstimateResponse, Token, WidgetTemplateType } from '..';
import {
  TransactionsProgress,
  TransactionStatusList,
} from '../types/transaction';

export const anyaltInstanceAtom = atom<AnyAlt | undefined>(undefined);

/*
 * Tokens
 */
export const selectedTokenAtom = atom<SupportedToken | undefined>(undefined);
export const selectedTokenAmountAtom = atom<string | undefined>('');
export const swapResultTokenAtom = atom<SupportedToken | undefined>(undefined); // It's same as outputToken, which comes from props on AnyaltWidget
export const depositTokenAtom = atom<Token | undefined>(undefined);
export const depositTokenAmountAtom = atom<string>('');
export const depositTokenEstimateAtom = atom<EstimateResponse | undefined>(
  undefined,
);

export const allChainsAtom = atom<SupportedChain[]>([]);

export const slippageAtom = atom<string>('3');

export const bestRouteAtom = atom<BestRouteResponse | undefined>(undefined);

export const selectedRouteAtom = atom<BestRouteResponse | undefined>(undefined);

export const activeOperationIdAtom = atom<string | undefined>(undefined);

export const transactionIndexAtom = atom<number>(1);

export const transactionsProgressAtom = atom<TransactionsProgress>({
  0: {
    approve: undefined,
    swap: undefined,
  },
});

export const currentUiStepAtom = atom<number>(0);

export const transactionsListAtom = atom<TransactionStatusList | undefined>(
  undefined,
);

export const widgetTemplateAtom = atom<WidgetTemplateType>('DEPOSIT_TOKEN');

export const minDepositAmountAtom = atom<number>(0);

export const swapDataAtom = atom<{
  swapIsFinished: boolean;
  isCrosschainSwapError: boolean;
  crosschainSwapOutputAmount: string;
  totalSteps: number;
  currentStep: number;
}>({
  swapIsFinished: false,
  isCrosschainSwapError: false,
  crosschainSwapOutputAmount: '0',
  totalSteps: 0,
  currentStep: 1,
});

export const tokenFetchErrorAtom = atom<{
  isError: boolean;
  errorMessage: string;
}>({
  isError: false,
  errorMessage: '',
});
