export function formatTime(unit: number): string {
  return unit.toString().padStart(2, "0");
}