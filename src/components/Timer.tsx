import { useEffect, useState } from "react";
import { useAtom, isLoading } from "@/stores/globalStore";
import { formatTime } from "@/utils/formatTime";
import { calculateTimeRemaining } from "@/utils/calculateTimeRemaining";

const TimeUnit = ({ getUnitValue, label, visible = true, className = "" }: { getUnitValue: () => number; label: string; visible?: boolean; className?: string }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(getUnitValue()); // First grab the initial value

    const timerId = setInterval(() => {
      setValue(getUnitValue()); // Then update the specific time unit value on each interval
    }, 1000);

    return () => clearInterval(timerId);
  }, [getUnitValue]);

  if (!visible) return null; // Don't do anything if the time unit value = 0

  return (
    <div className={`text-center select-none ${className}`}>
      <p className="text-2xl font-bold sm:text-3xl md:text-4xl">{formatTime(value)}</p>
      <p className="text-sm text-gray-400 sm:text-base">{value === 1 ? label : `${label}s`}</p>
    </div>
  );
};

const GreatestTimeUnit = ({ getUnitValue, label, visible = true, className = "" }: { getUnitValue: () => number; label: string; visible?: boolean; className?: string }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(getUnitValue()); // First grab the initial value

    const timerId = setInterval(() => {
      setValue(getUnitValue()); // Then update the specific time unit value on each interval
    }, 1000);

    return () => clearInterval(timerId);
  }, [getUnitValue]);

  if (!visible) return null;

  return (
    <div className={`text-center select-none ${className}`}>
      <p className="text-7xl font-bold sm:text-7xl md:text-8xl">{formatTime(value)}</p>
      <p className="text-2xl font-medium text-gray-300 sm:text-2xl">{value === 1 ? label : `${label}s`}</p>
    </div>
  );
};

// Determine the greatest time unit to show to the user. The unit will return false if the value from dayjs is = 0
const getGreatestTimeUnit = (timeConfig: { showMonths: boolean; showDays: boolean; showHours: boolean; showMinutes: boolean }) => {
  if (timeConfig.showMonths) return "months";
  if (timeConfig.showDays) return "days";
  if (timeConfig.showHours) return "hours";
  if (timeConfig.showMinutes) return "minutes";
  return "seconds";
};

export default function Timer({ targetDate, className = "" }: { targetDate: string | Date; className?: string }) {
  // If any of the time unit's value reaches 0, hide it entirely
  const [timeConfig, setTimeConfig] = useState({
    showMonths: false,
    showDays: false,
    showHours: false,
    showMinutes: false,
  });

  const [_, setIsComponentLoading] = useAtom(isLoading);

  useEffect(() => {
    const initialTimeRemaining = calculateTimeRemaining(targetDate);
    setTimeConfig({
      showMonths: initialTimeRemaining.showMonths,
      showDays: initialTimeRemaining.showDays,
      showHours: initialTimeRemaining.showHours,
      showMinutes: initialTimeRemaining.showMinutes,
    });
  }, [targetDate]);

  useEffect(() => {
    setIsComponentLoading(false);

    return () => {
      setIsComponentLoading(true);
    };
  }, [setIsComponentLoading]);

  // Grab each time unit's current value
  const getMonths = () => calculateTimeRemaining(targetDate).months;
  const getDays = () => calculateTimeRemaining(targetDate).days;
  const getHours = () => calculateTimeRemaining(targetDate).hours;
  const getMinutes = () => calculateTimeRemaining(targetDate).minutes;
  const getSeconds = () => calculateTimeRemaining(targetDate).seconds;

  const greatestUnit = getGreatestTimeUnit(timeConfig); // Get the greatest time unit for the first column
  const showGreatestTimeUnit = () => { // Render the greatest time unit based on which one is currently greatest
    switch (greatestUnit) {
      case "months":
        return <GreatestTimeUnit label="Month" getUnitValue={getMonths} visible={timeConfig.showMonths} className="w-full" />;
      case "days":
        return <GreatestTimeUnit label="Day" getUnitValue={getDays} visible={timeConfig.showDays} className="w-full" />;
      case "hours":
        return <GreatestTimeUnit label="Hour" getUnitValue={getHours} visible={timeConfig.showHours} className="w-full" />;
      case "minutes":
        return <GreatestTimeUnit label="Minute" getUnitValue={getMinutes} visible={timeConfig.showMinutes} className="w-full" />;
      case "seconds":
        return <GreatestTimeUnit label="Second" getUnitValue={getSeconds} visible={true} className="w-full" />;
      default:
        return null;
    }
  };

  return (
    <section id="timer" className={`w-full ${className}`}>
      {/* For mobile users, the timer will be laid out in a grid of two columns && one row.
          The first column will span the entire row, showing the greatest time unit available. */}
      <div className="grid grid-cols-2 gap-4 sm:hidden">
        <div className="flex items-center justify-center"> {/* First column - Greatest time unit */}
          {showGreatestTimeUnit()}
        </div>

        {/* Second column - Grid of remaining units */}
        <div className="grid grid-cols-2 grid-rows-2 gap-1">
          {greatestUnit !== "months" && timeConfig.showMonths && <TimeUnit label="Month" getUnitValue={getMonths} />}
          {greatestUnit !== "days" && timeConfig.showDays && <TimeUnit label="Day" getUnitValue={getDays} />}
          {greatestUnit !== "hours" && timeConfig.showHours && <TimeUnit label="Hour" getUnitValue={getHours} />}
          {greatestUnit !== "minutes" && timeConfig.showMinutes && <TimeUnit label="Minute" getUnitValue={getMinutes} />}
          {greatestUnit !== "seconds" && <TimeUnit label="Second" getUnitValue={getSeconds} />}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex sm:flex-nowrap sm:justify-center md:gap-6 lg:gap-8">
        <TimeUnit label="Month" getUnitValue={getMonths} visible={timeConfig.showMonths} />
        <TimeUnit label="Day" getUnitValue={getDays} visible={timeConfig.showDays} />
        <TimeUnit label="Hour" getUnitValue={getHours} visible={timeConfig.showHours} />
        <TimeUnit label="Minute" getUnitValue={getMinutes} visible={timeConfig.showMinutes} />
        <TimeUnit label="Second" getUnitValue={getSeconds} visible={true} />
      </div>
    </section>
  );
}
