import { AnyAlt, SupportedChain, SupportedToken } from '@anyalt/sdk';
import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
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
export const selectedTokenAtom = atom<SupportedToken | undefined>(undefined); //Token, which user selects
export const selectedTokenAmountAtom = atom<string | undefined>('');
export const swapResultTokenAtom = atom<SupportedToken | undefined>(undefined); // It's same as outputToken, which comes from props on AnyaltWidget
export const lastMileTokenAtom = atom<Token | undefined>(undefined); //Token, which will be deposited
export const lastMileTokenAmountAtom = atom<string>('');
export const lastMileTokenEstimateAtom = atom<EstimateResponse | undefined>(
  undefined,
);

export const allChainsAtom = atom<SupportedChain[]>([]);

export const allRoutesAtom = atom<GetAllRoutesResponseItem[] | undefined>(
  undefined,
);
export const selectedRouteAtom = atom<GetAllRoutesResponseItem | undefined>(
  undefined,
);

export const pendingRouteAtom = atom<GetAllRoutesResponseItem | undefined>(
  undefined,
);

export const showStuckTransactionDialogAtom = atom<boolean>(false);
export const showPendingRouteDialogAtom = atom<boolean>(false);

// Transaction informations:
export const slippageAtom = atom<string>('3');
export const activeOperationIdAtom = atom<string | undefined>(undefined);
export const transactionIndexAtom = atom<number>(1); // Recent index of transactions
export const transactionsListAtom = atom<TransactionStatusList | undefined>( // List of transactions to show on transactions screen
  undefined,
);
export const transactionsProgressAtom = atom<TransactionsProgress>({
  0: {
    approve: undefined,
    swap: undefined,
  },
}); // Controlling and storing information about transactions progress

// Widget configurations:
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

export const activeOperationsListAtom = atom<string[]>([]);
