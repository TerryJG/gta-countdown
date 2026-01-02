import { useState, useEffect } from "react";
import { useAtom, currentBackgroundImage, isBlurEnabled } from "@/stores/globalStore";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function ImageBackground() {
  const [imageUrl] = useAtom(currentBackgroundImage);
  const [blurEnabled] = useAtom(isBlurEnabled);
  const [displayImage, setDisplayImage] = useState<string>("");
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!imageUrl) return;

    const handleImageChange = async () => {
      if (displayImage && displayImage !== imageUrl) {
        // Image change - fade out first
        setOpacity(0);
        await wait(500); // Wait for fade out
        setDisplayImage(imageUrl);
        await wait(300); // Delay before fade in
        setOpacity(0.08);
      } else if (!displayImage) {
        // First image - just fade in
        setDisplayImage(imageUrl);
        await wait(300); // Delay before fade in
        setOpacity(0.08);
      }
    };

    handleImageChange();
  }, [imageUrl, displayImage]);

  return (
    <aside id="image-container" className="pointer-events-none fixed inset-0 z-0 h-screen w-screen transition-opacity duration-500" style={{ opacity }}>
      <img src={displayImage} alt="Background" className={`absolute inset-0 h-full w-full object-cover ${blurEnabled ? 'blur-md' : ''}`} />
    </aside>
  );
}
