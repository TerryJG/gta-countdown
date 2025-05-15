import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export type TimeElapsed = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
};

export function calculateTimeElapsed(dateString: string | Date): TimeElapsed {
  const now = dayjs();
  const date = dayjs(dateString);
  const diff = now.diff(date, "second");

  // For future dates, calculate the time until that date is reached
  if (diff < 0) {
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (60 * 60 * 24));
    const hours = Math.floor((absDiff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((absDiff % (60 * 60)) / 60);
    const seconds = Math.floor(absDiff % 60);

    return { 
      days: -days, 
      hours: -hours, 
      minutes: -minutes, 
      seconds: -seconds,
      totalSeconds: diff 
    };
  }

  // Past dates (normal case)
  const days = Math.floor(diff / (60 * 60 * 24));
  const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((diff % (60 * 60)) / 60);
  const seconds = Math.floor(diff % 60);

  return { 
    days, 
    hours, 
    minutes, 
    seconds,
    totalSeconds: diff 
  };
}

export function getRelativeTimeElapsed(dateString: string | Date): string {
  const now = dayjs();
  const date = dayjs(dateString);
  
  // Check if the date is in the future
  if (date.isAfter(now)) {
    return `in the future (${date.format('MMM D, YYYY')})`;
  }
  
  const elapsed = now.diff(date, 'second');
  const relativeTime = dayjs.duration(elapsed, 'seconds').humanize(true);
  
  return relativeTime;
}


export function getAbsoluteTimeElapsed(dateString: string | Date): string {
  const now = dayjs();
  const date = dayjs(dateString);
  
  // Check if the date is in the future
  if (date.isAfter(now)) {
    return `${date.format('MMM D, YYYY')} (in the future)`;
  }
  
  const years = now.diff(date, 'year');
  const months = now.diff(date, 'month') % 12;
  const days = now.diff(date.add(years, 'year').add(months, 'month'), 'day');
  
  const parts: string[] = [];  // Format the result based on elapsed time
  
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }
  
  if (days > 0 || parts.length === 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  
  return parts.join(' ');
}


