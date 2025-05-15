import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { releaseDate } from "@/constants/appInfo";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export type TimeRemaining = {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  showMonths: boolean;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
};

export function calculateTimeRemaining(targetDate?: string | Date): TimeRemaining {
  const now = dayjs();
  const target = targetDate ? dayjs(targetDate) : dayjs(releaseDate.iso);
  const diff = target.diff(now, "second");

  // If target date is in the past, return zeros
  if (diff <= 0) {
    return { 
      months: 0,
      days: 0, 
      hours: 0, 
      minutes: 0, 
      seconds: 0,
      showMonths: false,
      showDays: false,
      showHours: false,
      showMinutes: false,
    };
  }

  // Calculate months correctly
  const months = target.diff(now, 'month');
  
  // Calculate remaining days after accounting for full months
  const monthsInDays = now.add(months, 'month');
  const days = target.diff(monthsInDays, 'day');
  
  const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((diff % (60 * 60)) / 60);
  const seconds = Math.floor(diff % 60);
  
  // Calculate if each unit should be visible
  const showMonths = months > 0;
  const showDays = days > 0;
  const showHours = hours > 0 || showDays || showMonths;
  const showMinutes = minutes > 0 || showHours;

  return { 
    days, 
    hours, 
    minutes, 
    seconds,
    showMonths,
    showDays,
    showHours,
    showMinutes,
    months
  };
}

export function getRelativeTimeFromNow(dateString: string | Date): string {
  const now = dayjs();
  const date = dayjs(dateString);
  
  // Check if the date is in the future
  if (date.isAfter(now)) {
    return `in the future (${date.format('MMM D, YYYY')})`;
  }
  
  return date.fromNow();
}