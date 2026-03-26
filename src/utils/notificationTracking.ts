import dayjs from "@/utils/dayjs";

export type NotificationRecord = {
  hasShown: boolean;
  timesShown: number;
  lastShownISO: string;
  lastShown: string;
  eventId: string;
};

const STORAGE_KEY = "notifications";

function getAllNotificationRecordsFromStorage(): Record<string, NotificationRecord> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

function saveAllNotificationRecords(records: Record<string, NotificationRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Failed to save notification:", error);
  }
}

export function getNotificationRecord(eventId: string): NotificationRecord | null {
  const allRecords = getAllNotificationRecordsFromStorage();
  return allRecords[eventId] || null;
}

export function wasShownToday(eventId: string): boolean {
  const record = getNotificationRecord(eventId);
  if (!record) return false;

  const lastShownDate = dayjs(record.lastShownISO);
  return lastShownDate.isSame(dayjs(), "day");
}

export function markNotificationShown(eventId: string): void {
  const allRecords = getAllNotificationRecordsFromStorage();
  const existing = allRecords[eventId];
  const now = dayjs();

  const record: NotificationRecord = {
    hasShown: true,
    timesShown: existing ? existing.timesShown + 1 : 1,
    lastShownISO: now.toISOString(),
    lastShown: now.format("MMMM D, YYYY [at] h:mm A"),
    eventId,
  };

  allRecords[eventId] = record;
  saveAllNotificationRecords(allRecords);
}

export function clearNotificationRecord(eventId: string): void {
  try {
    const allRecords = getAllNotificationRecordsFromStorage();
    delete allRecords[eventId];
    saveAllNotificationRecords(allRecords);
  } catch (error) {
    console.error("Failed to clear notification:", error);
  }
}

export function getAllNotificationRecords(): Record<string, NotificationRecord> {
  return getAllNotificationRecordsFromStorage();
}
