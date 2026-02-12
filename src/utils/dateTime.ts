import { format, parse, addHours, isAfter, isBefore, differenceInHours } from 'date-fns';

export class DateTimeUtil {
  /**
   * Format time string to HH:mm:ss
   */
  static formatTime(time: string): string {
    // Input: "18:00" or "6:00 PM"
    // Output: "18:00:00"
    if (time.includes(':') && time.length === 5) {
      return `${time}:00`;
    }
    return time;
  }

  /**
   * Calculate end time (start + duration hours)
   */
  static calculateEndTime(startTime: string, durationHours: number = 2): string {
    // Parse time string
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Add duration
    const endDate = addHours(date, durationHours);

    // Format back to string
    return format(endDate, 'HH:mm:ss');
  }

  /**
   * Check if time1 is before time2
   */
  static isTimeBefore(time1: string, time2: string): boolean {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);

    if (h1 < h2) return true;
    if (h1 === h2 && m1 < m2) return true;
    return false;
  }

  /**
   * Check if reservation can be modified (2 hours before)
   */
  static canModifyReservation(reservationDate: Date, startTime: string): boolean {
    const now = new Date();
    
    // Parse reservation datetime
    const [hours, minutes] = startTime.split(':').map(Number);
    const reservationDateTime = new Date(reservationDate);
    reservationDateTime.setHours(hours, minutes, 0, 0);

    // Check if more than 2 hours away
    const hoursDifference = differenceInHours(reservationDateTime, now);
    return hoursDifference >= 2;
  }

  /**
   * Check if date is in the past
   */
  static isDateInPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  }
}