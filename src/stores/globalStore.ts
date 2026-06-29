import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { coverArtImage } from "@/constants/appInfo";
export { useAtom } from "jotai";

export const lastVisited = atomWithStorage("lastVisited", new Date().toISOString());
export const isLoading = atom(true);

export const isBlurEnabled = atomWithStorage("isBlurEnabled", true);
export const isAlertEnabled = atomWithStorage("isAlertEnabled", true);

export const currentBackgroundImage = atom<string | null>(coverArtImage);
export const isAnimating = atom<boolean>(false);
