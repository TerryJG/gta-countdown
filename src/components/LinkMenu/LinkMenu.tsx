import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger, MenubarCheckboxItem } from "@/components/ui/menubar";
import { gameTrailers, externalLinks } from "@/constants/appInfo";
import { YouTubeVideoCard } from "@/components/LinkMenu/YouTubeVideoCard";
import { type SocialMediaPlatforms, SocialMediaButton } from "@/components/SocialMediaButtons";
import { useAtom, isBlurEnabled, isAlertEnabled } from "@/stores/globalStore";
import { useState } from "react";
import AlertDialog from "@/components/AlertDialog";


export default function LinkMenu() {
  const [blurEffectEnabled, setBlurEffectEnabled] = useAtom(isBlurEnabled);
  const [alertsEnabled, setAlertsEnabled] = useAtom(isAlertEnabled);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Function to handle external link clicks
  const handleExternalLinkClick = (url: string, event: React.MouseEvent) => {
    if (alertsEnabled) {
      event.preventDefault();
      setPendingUrl(url);
      setShowAlert(true);
    }
  };

  // Function to confirm navigation
  const confirmNavigation = () => {
    if (pendingUrl) {
      window.open(pendingUrl, "_blank", "noopener,noreferrer");
      setShowAlert(false);
      setPendingUrl(null);
    }
  };

  // Function to cancel navigation
  const cancelNavigation = () => {
    setShowAlert(false);
    setPendingUrl(null);
  };

  return (
    <section id="link-menu" className="container mx-auto px-4 text-gray-500">
      {/* External Link Dialog */}
      {pendingUrl && <AlertDialog isOpen={showAlert} url={pendingUrl} onConfirm={confirmNavigation} onCancel={cancelNavigation} />}

      <div className="flex justify-center">
        <Menubar className="inline-flex w-auto">
          <MenubarMenu>
            {/* Trailer Tab */}
            <MenubarTrigger>Trailers</MenubarTrigger>
            <MenubarContent className="max-h-[80vh] w-80 scrollbar scrollbar-default">
              {gameTrailers.videos.map((video) => (
                <MenubarItem key={video.url} className="w-full p-0 ">
                  <div onClick={(e) => (alertsEnabled ? handleExternalLinkClick(video.url, e) : null)} className="w-full">
                    <YouTubeVideoCard videoUrl={video.url} openInNewTab={!alertsEnabled} />
                  </div>
                </MenubarItem>
              ))}
              <MenubarItem asChild>
                <div className="flex w-full items-center justify-between px-2 py-1.5">
                  <span>View Official YouTube Channel</span>
                  <MenubarShortcut>
                    <SocialMediaButton
                      platform="youtube"
                      iconClassName="text-white"
                      href={externalLinks.socialMedia.find((item) => item.platform === "youtube")?.url}
                      openInNewTab={!alertsEnabled}
                      onClick={(e) => (alertsEnabled ? handleExternalLinkClick(externalLinks.socialMedia.find((item) => item.platform === "youtube")?.url || "", e) : undefined)}
                    />
                  </MenubarShortcut>
                </div>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            {/* External Links Tab */}
            <MenubarTrigger>External Links</MenubarTrigger>
            <MenubarContent>
              {externalLinks.socialMedia.map((link) => (
                <MenubarItem 
                  key={link.platform} 
                  asChild 
                  className="focus:bg-opacity-50"
                  style={{ '--focus-bg-color': link.platformColor } as React.CSSProperties} // This creates a CSS variable for Tailwind to use to work around TW not using dynamic classes
                >
                  {alertsEnabled ? (
                    <div 
                      className="flex min-w-56 cursor-pointer items-center justify-between px-2 py-1.5 hover:bg-[var(--focus-bg-color)]/30" 
                      onClick={(e) => handleExternalLinkClick(link.url, e)}
                    >
                      <span className="capitalize">{link.platform}</span>
                      <MenubarShortcut>
                        <SocialMediaButton platform={link.platform as SocialMediaPlatforms} iconClassName="text-white" disableHref />
                      </MenubarShortcut>
                    </div>
                  ) : (
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex min-w-56 items-center justify-between px-2 py-1.5 hover:bg-[var(--focus-bg-color)]/50"
                    >
                      <span className="capitalize">{link.platform}</span>
                      <MenubarShortcut>
                        <SocialMediaButton platform={link.platform as SocialMediaPlatforms} iconClassName="text-white" disableHref />
                      </MenubarShortcut>
                    </a>
                  )}
                </MenubarItem>
              ))}
              {/* Websites Section */}
              {externalLinks.websites.length > 0 && (
                <>
                  <MenubarSeparator />
                  {externalLinks.websites.map((site) => (
                    <MenubarItem key={site.url} asChild>
                      {alertsEnabled ? (
                        <div className="flex w-full cursor-pointer items-center justify-between px-2 py-1.5" onClick={(e) => handleExternalLinkClick(site.url, e)}>
                          <span>{site.websiteName}</span>
                          {site.icon && (
                            <MenubarShortcut>
                              <img src={site.icon} alt={site.websiteName} className="h-4 w-4 object-contain" />
                            </MenubarShortcut>
                          )}
                        </div>
                      ) : (
                        <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-between px-2 py-1.5">
                          <span>{site.websiteName}</span>
                          {site.icon && (
                            <MenubarShortcut>
                              <img src={site.icon} alt={site.websiteName} className="h-4 w-4 object-contain" />
                            </MenubarShortcut>
                          )}
                        </a>
                      )}
                    </MenubarItem>
                  ))}
                </>
              )}
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            {/* Options Tab */}
            <MenubarTrigger>Options</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem
                checked={blurEffectEnabled}
                onCheckedChange={setBlurEffectEnabled}
                onSelect={(event) => event.preventDefault()} // When the user toggles a <MenubarCheckboxItem /> item, prevent the <MenubarContent> from automatically closing
              >
                Blur Effect
              </MenubarCheckboxItem>
              <MenubarCheckboxItem checked={alertsEnabled} onCheckedChange={setAlertsEnabled} onSelect={(event) => event.preventDefault()}>
                Enable Alert for External Links
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarItem>
                {alertsEnabled ? (
                  <div className="cursor-pointer" onClick={(e) => handleExternalLinkClick("https://github.com/TerryJG/gta-countdown", e)}>
                    View on Github
                  </div>
                ) : (
                  <a href="https://github.com/TerryJG/gta-countdown" target="_blank">
                    View on Github
                  </a>
                )}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </section>
  );
}
