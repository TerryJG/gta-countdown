import { externalLinks } from "@/constants/appInfo";

import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { type FontAwesomeIconProps, FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTwitch, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

export type SocialMediaPlatforms = "youtube" | "twitter" | "instagram" | "twitch";

export const SocialMediaButton = ({
  platform = "youtube",
  className = "",
  iconClassName = "",
  href,
  openInNewTab = true,
  disableHref = false,
  ...iconProps
}: {
  platform?: SocialMediaPlatforms;
  className?: string;
  iconClassName?: string;
  href?: string;
  openInNewTab?: boolean;
  disableHref?: boolean;
} & Omit<FontAwesomeIconProps, "icon" | "size">) => {
  const getSocialMediaIcon = (platform: SocialMediaPlatforms): IconDefinition => {
    switch (platform) {
      case "youtube":
        return faYoutube;
      case "twitter":
        return faTwitter;
      case "instagram":
        return faInstagram;
      case "twitch":
        return faTwitch;
      default:
        return faPhone;
    }
  };

  const getSocialMediaUrl = (platform: SocialMediaPlatforms): string => {
    const socialMedia = externalLinks.socialMedia.find((item) => item.platform === platform);
    return socialMedia?.url || "#";
  };

  const faSocialMediaIcon = getSocialMediaIcon(platform);
  const linkHref = href || getSocialMediaUrl(platform) || "#";

  // If href is disabled, just return the icon
  if (disableHref) {
    return (
      <span className={`inline-flex items-center justify-center rounded-md p-1 transition-all ${className}`} aria-label={`${platform} social media`}>
        <FontAwesomeIcon icon={faSocialMediaIcon} style={{ fontSize: "1rem" }} className={`${iconClassName} transition-all`} {...iconProps} />
      </span>
    );
  }

  // Otherwise return the linked version
  return (
    <a
      href={linkHref}
      className={`inline-flex items-center justify-center rounded-md p-1 transition-all ${className}`}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      aria-label={`${platform} social media`}
    >
      <FontAwesomeIcon icon={faSocialMediaIcon} style={{ fontSize: "1rem" }} className={`${iconClassName} min-w-full transition-all`} {...iconProps} />
    </a>
  );
};
