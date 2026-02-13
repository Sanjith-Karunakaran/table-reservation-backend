import { 
  format, 
  addHours, 
  isBefore, 
  differenceInHours, 
  startOfDay,
  parseISO 
} from 'date-fns';

export class DateTimeUtil {
  /**
   * Format time string to HH:mm:ss
   */
  static formatTime(time: string): string {
    if (time.includes(':') && time.length === 5) {
      return `${time}:00`;
    }
    return time;
  }

  /**
   * Calculate end time (start + duration hours)
   */
  static calculateEndTime(startTime: string, durationHours: number = 2): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    const endDate = addHours(date, durationHours);
    return format(endDate, 'HH:mm:ss');
  }

  /**
   * Check if time1 is before time2
   */
  static isTimeBefore(time1: string, time2: string): boolean {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return h1 < h2 || (h1 === h2 && m1 < m2);
  }

  /**
   * Check if reservation can be modified (2 hours before)
   */
  static canModifyReservation(reservationDate: Date, startTime: string): boolean {
    const now = new Date();
    const [hours, minutes] = startTime.split(':').map(Number);
    const reservationDateTime = new Date(reservationDate);
    reservationDateTime.setHours(hours, minutes, 0, 0);
    const hoursDifference = differenceInHours(reservationDateTime, now);
    return hoursDifference >= 2;
  }

  /**
   * Check if date is in the past (TO BE DEBUGGED)
   */
  static isDateInPast(date: Date | string): boolean {
    // Handle both Date objects and date strings
    const inputDate = typeof date === 'string' ? parseISO(date) : date;
    
    const today = startOfDay(new Date());
    const checkDate = startOfDay(inputDate);
    
    return isBefore(checkDate, today);
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  }
}