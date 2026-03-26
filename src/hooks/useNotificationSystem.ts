import { useEffect } from "react";
import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import { lastVisited } from "@/stores/globalStore";
import { showToastAtom } from "@/stores/toastStore";
import { notificationEvents } from "@/constants/notificationEvents";
import { wasShownToday, markNotificationShown } from "@/utils/notificationTracking";
import dayjs from "@/utils/dayjs";

export function useNotificationSystem() {
  const [lastVisitedDate, setLastVisited] = useAtom(lastVisited);
  const showToast = useSetAtom(showToastAtom);

  useEffect(() => {
    const now = dayjs();
    const lastVisit = dayjs(lastVisitedDate);

    const isFirstVisit = !lastVisitedDate || !lastVisit.isValid() || lastVisit.isAfter(now); // Check if this is the first visit (or invalid date)
    setLastVisited(now.toISOString()); // Update last visited to current time

    if (isFirstVisit) {
      return;
    }

    const matchingNotifications = notificationEvents.filter((event) => {
      
      if (!event.condition()) return false; // Check if condition is met
      if (wasShownToday(event.id)) return false; // Check if already shown today
      return true;
    });

    if (matchingNotifications.length > 0) {
      const notificationToShow = matchingNotifications[0];

      const timeoutId = setTimeout(() => {
        showToast(
          notificationToShow.message,
          notificationToShow.duration ?? 5000,
          {
            ...notificationToShow.options,
            onShow: () => {
              markNotificationShown(notificationToShow.id);
              notificationToShow.options?.onShow?.();
            },
          }
        );
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, []);
}
