import { DayOfWeek } from 'src/common/enums';

export const DAY_INDEX_TO_STRING: Record<number, DayOfWeek> = {
  0: DayOfWeek.SUNDAY,
  1: DayOfWeek.MONDAY,
  2: DayOfWeek.TUESDAY,
  3: DayOfWeek.WEDNESDAY,
  4: DayOfWeek.THURSDAY,
  5: DayOfWeek.FRIDAY,
  6: DayOfWeek.SATURDAY,
};

/**
 * Convert dayjs().day() number to DayOfWeek enum string
 */
export function getDayOfWeekFromDate(date: Date): DayOfWeek {
  const dayIndex = date.getDay(); // 0 = Sunday, 6 = Saturday
  return DAY_INDEX_TO_STRING[dayIndex];
}
