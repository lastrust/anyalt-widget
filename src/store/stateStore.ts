import { AnyAlt } from '@anyalt/sdk';
import { atom } from 'jotai';

export const anyaltInstanceAtom = atom<AnyAlt | undefined>(undefined);
