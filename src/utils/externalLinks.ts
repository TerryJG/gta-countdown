export function openExternalLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function createExternalLinkHandler(
  alertsEnabled: boolean,
  onAlert: (url: string) => void
) {
  return {
    handleClick: (url: string, event?: React.MouseEvent) => {
      if (alertsEnabled && event) {
        event.preventDefault();
        onAlert(url);
      }
    },
    openLink: openExternalLink,
  };
}
