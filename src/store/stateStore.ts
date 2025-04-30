import { AnyAlt, SupportedChain, SupportedToken } from '@anyalt/sdk';
import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { atom, useAtom, useSetAtom } from 'jotai';
import { EstimateResponse, Token, WidgetTemplateType } from '..';
import {
  TransactionsProgress,
  TransactionStatusList,
} from '../types/transaction';

export enum ActionType {
  SWAP_FAILED = 'SWAP_FAILED',
}

export interface Action<T = any> {
  type: ActionType;
  payload?: T;
}

export interface SwapFailedAction extends Action {
  type: ActionType.SWAP_FAILED;
  payload: {
    error: string;
  };
}

export type AppAction = SwapFailedAction; // Add other action types as needed like SwapFailedAction | SwapSuccessAction

export const anyaltInstanceAtom = atom<AnyAlt | undefined>(undefined);

export const dispatchAtom = atom(null, (_get, set, action: AppAction) => {
  set(actionsQueueAtom, (prev) => [...prev, action]);
});

export const actionsQueueAtom = atom<AppAction[]>([]);

export function useDispatch() {
  const dispatch = useSetAtom(dispatchAtom);
  return dispatch;
}

export function useActionQueue() {
  const [actionQueue, setActionQueue] = useAtom(actionsQueueAtom);
  return {
    actions: actionQueue,
    clearQueue: () => setActionQueue([]),
  };
}

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
export const showPartialFailDialogAtom = atom<boolean>(false);

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
