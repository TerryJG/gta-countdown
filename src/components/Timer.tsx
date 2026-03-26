import { useEffect, useState } from "react";
import { useAtom, isLoading } from "@/stores/globalStore";
import { formatTime } from "@/utils/formatTime";
import { calculateTimeRemaining, type TimeRemaining } from "@/utils/calculateTimeRemaining";

const TimeUnit = ({ value, label, isGreatest = false }: { value: number; label: string; isGreatest?: boolean }) => {
  return (
    <div className={`text-center select-none ${isGreatest ? 'col-span-1 row-span-2 sm:col-span-1 sm:row-span-1' : ''}`}>
      <p className={isGreatest ? 'text-7xl font-bold md:text-8xl' : 'text-2xl font-bold sm:text-3xl md:text-4xl'}>
        {formatTime(value)}
      </p>
      <p className={isGreatest ? 'text-2xl font-medium text-gray-300' : 'text-sm text-gray-400 sm:text-base'}>
        {value === 1 ? label : `${label}s`}
      </p>
    </div>
  );
};

export default function Timer({ targetDate, className = "" }: { targetDate: string | Date; className?: string }) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate));
  const [_, setIsComponentLoading] = useAtom(isLoading);

  useEffect(() => {
    setIsComponentLoading(false);

    const timerId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => {
      clearInterval(timerId);
      setIsComponentLoading(true);
    };
  }, [targetDate, setIsComponentLoading]);

  const units = [
    { value: timeRemaining.months, label: "Month", visible: timeRemaining.showMonths },
    { value: timeRemaining.days, label: "Day", visible: timeRemaining.showDays },
    { value: timeRemaining.hours, label: "Hour", visible: timeRemaining.showHours },
    { value: timeRemaining.minutes, label: "Minute", visible: timeRemaining.showMinutes },
    { value: timeRemaining.seconds, label: "Second", visible: true },
  ];

  const visibleUnits = units.filter(unit => unit.visible);
  const greatestUnitIndex = 0;

  const greatestUnit = visibleUnits[greatestUnitIndex];
  const remainingUnits = visibleUnits.slice(1);

  return (
    <section id="timer" className={`w-full ${className}`}>
      {/* Mobile layout - greatest unit on left, others in grid on right */}
      <div className="flex gap-2 justify-center sm:hidden">
        <div className="flex items-center justify-center">
          <TimeUnit value={greatestUnit.value} label={greatestUnit.label} isGreatest />
        </div>
        <div className="grid grid-cols-2 gap-1 auto-rows-min">
          {remainingUnits.map(unit => (
            <TimeUnit key={unit.label} value={unit.value} label={unit.label} />
          ))}
        </div>
      </div>

      {/* Desktop layout - all units in a row */}
      <div className="hidden sm:flex sm:flex-nowrap sm:justify-center sm:gap-6">
        {visibleUnits.map(unit => (
          <TimeUnit key={unit.label} value={unit.value} label={unit.label} />
        ))}
      </div>
    </section>
  );
}
