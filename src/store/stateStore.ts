import {
  AnyAlt,
  BestRouteResponse,
  SupportedChain,
  SupportedToken,
} from '@anyalt/sdk';
import { atom } from 'jotai';
import { EstimateResponse, Token } from '..';
import { StepsProgress } from '../hooks/useHandleTransaction';

export const anyaltInstanceAtom = atom<AnyAlt | undefined>(undefined);

export const inTokenAtom = atom<SupportedToken | undefined>(undefined);

export const allChainsAtom = atom<SupportedChain[]>([]);

export const protocolInputTokenAtom = atom<SupportedToken | undefined>(
  undefined,
);

export const protocolFinalTokenAtom = atom<Token | undefined>(undefined);

export const slippageAtom = atom<string>('0.5');

export const inTokenAmountAtom = atom<string | undefined>('');

export const bestRouteAtom = atom<BestRouteResponse | undefined>(undefined);

export const finalTokenEstimateAtom = atom<EstimateResponse | undefined>(
  undefined,
);

export const selectedRouteAtom = atom<BestRouteResponse | undefined>(undefined);

export const activeOperationIdAtom = atom<string | undefined>(undefined);

export const currentStepAtom = atom<number>(1);

export const stepsProgressAtom = atom<StepsProgress | undefined>(undefined);

export const finalTokenAmountAtom = atom<string>('');

export const currentUiStepAtom = atom<number>(0);
