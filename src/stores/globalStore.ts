import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
export { useAtom } from 'jotai';

export const lastVisited = atomWithStorage('lastVisited', new Date().toISOString());
export const isLoading = atom(true);

export const isBlurEnabled = atomWithStorage('isBlurEnabled', true);
export const isAlertEnabled = atomWithStorage('isAlertEnabled', true);
