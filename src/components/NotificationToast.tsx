import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentToastAtom, completeCurrentToastAtom } from "@/stores/toastStore";
import { isBlurEnabled } from "@/stores/globalStore";

export default function NotificationToast() {
  const currentToast = useAtomValue(currentToastAtom);
  const completeToast = useSetAtom(completeCurrentToastAtom);
  const [blurEffectEnabled] = useAtom(isBlurEnabled);

  useEffect(() => {
    if (!currentToast) return;

    const timer = setTimeout(() => {
      completeToast();
    }, currentToast.duration);

    return () => clearTimeout(timer);
  }, [currentToast, completeToast]);

  if (!currentToast) {
    return null;
  }

  return (
    <aside
      tabIndex={-1}
      id="notification-toast"
      data-toast-id={currentToast.id}
      className={`fixed top-12 right-12 z-1000 max-w-80 px-3 py-2 select-none ${blurEffectEnabled ? "bg-black/50 backdrop-blur-lg" : "bg-black/65"}`}
    >
      <p className="m-0 text-base leading-tight font-medium text-white">{currentToast.content}</p>
    </aside>
  );
}
