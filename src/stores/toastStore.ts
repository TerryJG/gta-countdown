import { atom } from "jotai";
import { type ReactNode } from "react";

export type ToastId = string;

export type ToastOptions = {
  onShow?: () => void;
  onComplete?: () => void;
};

export type Toast = {
  id: ToastId;
  content: ReactNode;
  duration: number;
  options?: ToastOptions;
  timestamp: number;
};

const toastQueueAtom = atom<Toast[]>([]);
export const currentToastAtom = atom<Toast | null>(null);

const generateToastId = (): ToastId => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const showToastAtom = atom(null, (get, set, content: ReactNode, duration: number = 3000, options?: ToastOptions): ToastId => {
  const id = generateToastId();
  const toast: Toast = {
    id,
    content,
    duration,
    options,
    timestamp: Date.now(),
  };

  const queue = get(toastQueueAtom);
  set(toastQueueAtom, [...queue, toast]);

  if (get(currentToastAtom) === null) {
    set(processQueueAtom);
  }

  return id;
});

const processQueueAtom = atom(null, (get, set) => {
  const queue = get(toastQueueAtom);
  const currentToast = get(currentToastAtom);

  if (currentToast !== null || queue.length === 0) {
    return;
  }

  const [nextToast, ...remainingQueue] = queue;
  set(toastQueueAtom, remainingQueue);
  set(currentToastAtom, nextToast);

  nextToast.options?.onShow?.();
});

export const completeCurrentToastAtom = atom(null, (get, set) => {
  const currentToast = get(currentToastAtom);

  if (currentToast) {
    currentToast.options?.onComplete?.();
  }

  set(currentToastAtom, null);

  setTimeout(() => {
    set(processQueueAtom);
  }, 100);
});
