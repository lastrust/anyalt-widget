import {
  AnyAlt,
  BestRouteResponse,
  SupportedChain,
  SupportedToken,
} from '@anyalt/sdk';
import { atom } from 'jotai';
import { EstimateResponse, Token } from '../types/types';

export const anyaltInstanceAtom = atom<AnyAlt | undefined>(undefined);

export const inTokenAtom = atom<SupportedToken | undefined>(undefined);

export const allChainsAtom = atom<SupportedChain[]>([]);

export const protocolInputTokenAtom = atom<SupportedToken | undefined>(
  undefined,
);

export const protocolFinalTokenAtom = atom<Token | undefined>(undefined);

export const slippageAtom = atom<string>('0.5');

export const inTokenAmountAtom = atom<string | undefined>(undefined);

export const activeRouteAtom = atom<BestRouteResponse | undefined>(undefined);

export const finalTokenEstimateAtom = atom<EstimateResponse | undefined>(
  undefined,
);
