import { isLoading } from "@/stores/globalStore";
import { useAtom } from "jotai";
import Logo from "@/components/Logo";

export default function Loader({ forcedVisibility, onError = false, onSuccess = false }: { forcedVisibility?: boolean; onError?: boolean; onSuccess?: boolean }) {
  const [isComponentLoading] = useAtom(isLoading);

  // Use Jotai's loading state or prop's loading state
  const isVisible = forcedVisibility !== undefined ? forcedVisibility : isComponentLoading;
  const colorClass = onError ? "text-red-500" : onSuccess ? "text-green-500" : "";

  return (
    <Logo
      variant={3}
      containerClassName={`${colorClass} absolute top-5 left-5 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"} ${isVisible && !onError && !onSuccess ? "animate-pulse" : ""}`}
      logoClassName="w-10 h-auto"
    />
  );
}
