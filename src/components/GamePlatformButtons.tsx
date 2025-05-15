import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAtom, isLoading, isAlertEnabled } from "@/stores/globalStore";
import { externalLinks } from "@/constants/appInfo";
import AlertDialog from "@/components/AlertDialog";

const platforms = [
  {
    alt: "Xbox Series X|S",
    storeName: "Xbox Store",
    src: "/platforms/xbox-series-xs.webp",
    width: "w-30",
    buttonColor: "bg-[#107c10] hover:bg-[#107c10]/90",
    buttonClassName: "",
    iconClassName: "",
  },
  {
    alt: "PlayStation 5",
    storeName: "PlayStation Store",
    src: "/platforms/playstation-5.webp",
    width: "w-20",
    buttonColor: "bg-[#0070D1] hover:bg-[#0070D1]/90",
    buttonClassName: "",
    iconClassName: "",
  },
  {
    alt: "Steam",
    storeName: "Steam",
    src: "/platforms/steam.webp",
    width: "w-20",
    buttonColor: "bg-gray-800",
    buttonClassName: "",
    iconClassName: "",
  },
  {
    alt: "Rockstar Games Launcher",
    storeName: "Rockstar Games Store",
    width: "w-5",
    src: "/platforms/rockstargames.webp",
    buttonColor: "bg-[#e19808] hover:bg-[#e19808]/90",
    buttonClassName: "p-2",
    iconClassName: "invert ms-1",
  },
];

export default function GamePlatformButtons() {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [_, setIsComponentLoading] = useAtom(isLoading);
  const [alertsEnabled] = useAtom(isAlertEnabled);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const handleImageLoad = (platformSrc: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [platformSrc]: true,
    }));
  };

  // Get product URL for a platform from appInfo
  const getProductUrl = (storeName: string): string => {
    const store = externalLinks.storefronts.find((store) => store.storeName === storeName);

    if (store && store.productURL && store.productURL.length > 0) {
      return store.productURL;
    }

    return "";
  };

  const handleExternalLinkClick = (url: string, event: React.MouseEvent) => {
    if (alertsEnabled) {
      event.preventDefault();
      setPendingUrl(url);
      setShowAlert(true);
    }
  };

  const confirmNavigation = () => {
    if (pendingUrl) {
      window.open(pendingUrl, "_blank", "noopener,noreferrer");
      setShowAlert(false);
      setPendingUrl(null);
    }
  };

  const cancelNavigation = () => {
    setShowAlert(false);
    setPendingUrl(null);
  };

  useEffect(() => {
    const allImagesLoaded = platforms.every((platform) => loadedImages[platform.src]); // Check if all platform images are loaded

    // If all platform images loaded, mark component as ready to load
    if (platforms.length === 0 || (platforms.length > 0 && allImagesLoaded)) {
      setIsComponentLoading(false);
    } else {
      setIsComponentLoading(true);
    }

    return () => {
      setIsComponentLoading(true);
    };
  }, [loadedImages, setIsComponentLoading]);

  return (
    <section id="platform-buttons" className="flex flex-wrap justify-center gap-3 px-4 w-full">
      {/* External Link Dialog */}
      {pendingUrl && <AlertDialog isOpen={showAlert} url={pendingUrl} onConfirm={confirmNavigation} onCancel={cancelNavigation} />}

      {platforms.map((platform, index) => {
        const productUrl = getProductUrl(platform.storeName);
        const hasLink = productUrl.length > 0;

        if (!hasLink) return null; // Don't show the button if no product url exists

        return (
          <Button
            key={index}
            className={`h-10 p-4 ${platform.buttonClassName} ${platform.buttonColor} mb-2`}
            asChild={!alertsEnabled}
            title={`Wishlist for ${platform.alt}`}
            onClick={alertsEnabled ? (e) => handleExternalLinkClick(productUrl, e) : undefined}
          >
            {alertsEnabled ? (
              <div className="flex items-center justify-center">
                <img className={`${platform.width} ${platform.iconClassName}`} src={platform.src} alt={platform.alt} onLoad={() => handleImageLoad(platform.src)} />
              </div>
            ) : (
              <a href={productUrl} target="_blank" rel="noopener noreferrer">
                <img className={`${platform.width} ${platform.iconClassName}`} src={platform.src} alt={platform.alt} onLoad={() => handleImageLoad(platform.src)} />
              </a>
            )}
          </Button>
        );
      })}
    </section>
  );
}
