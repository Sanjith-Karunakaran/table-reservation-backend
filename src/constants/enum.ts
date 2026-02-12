export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum BookingSource {
  ONLINE = 'ONLINE',
  PHONE = 'PHONE',
  WALK_IN = 'WALK_IN',
  ADMIN = 'ADMIN',
}

export enum WaitlistStatus {
  WAITING = 'WAITING',
  NOTIFIED = 'NOTIFIED',
  CONVERTED = 'CONVERTED',
  EXPIRED = 'EXPIRED',
}