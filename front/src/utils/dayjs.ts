import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import arraySupport from 'dayjs/plugin/arraySupport';
import localeData from 'dayjs/plugin/localeData';
import mgLocale from '../dayjs/mg.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(arraySupport);
dayjs.extend(localeData);
dayjs.locale('mg', mgLocale, true);

dayjs.tz.setDefault('Indian/Antananarivo');

export const DATE_FORMATS = {
  DATE_DISPLAY: 'DD/MM/YYYY',
  TIME_DISPLAY: 'HH:mm',
  DATETIME_DISPLAY: 'DD/MM/YYYY HH:mm',
  DATETIME_FULL: 'dddd, DD MMMM YYYY HH:mm',
  DATE_FULL: 'dddd, DD MMMM YYYY',

  DATE_API: 'YYYY-MM-DD',
  DATETIME_API: 'YYYY-MM-DDTHH:mm:ss',
  DATETIME_ISO: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',

  MONTH_YEAR: 'MMMM YYYY',
  DAY_MONTH: 'DD MMM',
  WEEKDAY_SHORT: 'ddd',
  WEEKDAY_FULL: 'dddd',

  DEPARTURE_TIME: 'HH:mm',
  VOYAGE_DATE: 'ddd DD MMM',
  SCHEDULE_DISPLAY: 'DD/MM/YYYY à HH:mm',
} as const;

type DayjsInput = string | Date | dayjs.Dayjs;

export const voyageDateUtils = {
  formatDepartureTime: (date: DayjsInput) => {
    return dayjs(date).format(DATE_FORMATS.DEPARTURE_TIME);
  },

  formatVoyageSchedule: (date: DayjsInput) => {
    return dayjs(date).format(DATE_FORMATS.SCHEDULE_DISPLAY);
  },

  formatVoyageDate: (date: DayjsInput, textPrice?: string) => {
    if (dayjs(date).isValid()) {
      return dayjs(date).format(DATE_FORMATS.VOYAGE_DATE);
    }
    return textPrice ?? '-';
  },

  isToday: (date: DayjsInput) => {
    return dayjs(date).isSame(dayjs(), 'day');
  },

  isPast: (date: DayjsInput) => {
    return dayjs(date).isBefore(dayjs());
  },

  isWithin24Hours: (date: DayjsInput) => {
    return dayjs(date).isBetween(dayjs(), dayjs().add(24, 'hours'));
  },

  getDuration: (start: DayjsInput, end: DayjsInput) => {
    const duration = dayjs(end).diff(dayjs(start));
    return dayjs.duration(duration);
  },

  formatDuration: (start: DayjsInput, end: DayjsInput) => {
    const duration = voyageDateUtils.getDuration(start, end);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours}h` + (minutes > 0 ? ` ${minutes}min` : '');
  },

  getRelativeTime: (date: DayjsInput) => {
    return dayjs(date).fromNow();
  },

  formatWithLocale: (date: DayjsInput, format: string, locale: string = 'en') => {
    return dayjs(date).locale(locale).format(format);
  },

  isSameDay: (date1: DayjsInput, date2: DayjsInput) => {
    return dayjs(date1).isSame(dayjs(date2), 'day');
  },

  startOfDay: (date: DayjsInput) => {
    return dayjs(date).startOf('day');
  },

  endOfDay: (date: DayjsInput) => {
    return dayjs(date).endOf('day');
  },

  getWeekday: (date: DayjsInput) => {
    return dayjs(date).weekday();
  },

  getMonthDates: (date: DayjsInput) => {
    const startOfMonth = dayjs(date).startOf('month');
    const endOfMonth = dayjs(date).endOf('month');
    const dates = [];

    let current = startOfMonth;
    while (current.isSameOrBefore(endOfMonth)) {
      dates.push(current);
      current = current.add(1, 'day');
    }

    return dates;
  },

  toApiFormat: (date: DayjsInput) => {
    return dayjs(date).format(DATE_FORMATS.DATETIME_ISO);
  },

  toDateApiFormat: (date: DayjsInput) => {
    return dayjs(date).format(DATE_FORMATS.DATE_API);
  },

  fromApiFormat: (dateString: string) => {
    return dayjs(dateString);
  },

  now: () => {
    return dayjs().tz('Indian/Antananarivo');
  },

  addBusinessDays: (date: DayjsInput, days: number) => {
    let current = dayjs(date);
    let addedDays = 0;

    while (addedDays < days) {
      current = current.add(1, 'day');
      if (current.day() !== 0 && current.day() !== 6) {
        addedDays++;
      }
    }

    return current;
  },
};

export const calendarUtils = {
  getCalendarMonth: (date: string | Date | dayjs.Dayjs) => {
    const monthStart = dayjs(date).startOf('month');
    const monthEnd = dayjs(date).endOf('month');

    const calendarStart = monthStart.startOf('week');
    const calendarEnd = monthEnd.endOf('week');

    const days = [];
    let current = calendarStart;

    while (current.isSameOrBefore(calendarEnd)) {
      days.push({
        date: current,
        isCurrentMonth: current.isSame(monthStart, 'month'),
        isToday: current.isSame(dayjs(), 'day'),
        isPast: current.isBefore(dayjs(), 'day'),
      });
      current = current.add(1, 'day');
    }

    return {
      days,
      monthStart,
      monthEnd,
      title: monthStart.format(DATE_FORMATS.MONTH_YEAR),
    };
  },

  groupVoyagesByDate: (voyages: Array<{ departureTime: string }>) => {
    const grouped: Record<string, Array<{ departureTime: string }>> = {};

    for (const voyage of voyages) {
      const dateKey = dayjs(voyage.departureTime).format(DATE_FORMATS.DATE_API);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(voyage);
    }

    return grouped;
  },
};

export default dayjs;
