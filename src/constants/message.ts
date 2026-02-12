export const SUCCESS_MESSAGES = {
  RESERVATION_CREATED: 'Reservation created successfully',
  RESERVATION_UPDATED: 'Reservation updated successfully',
  RESERVATION_CANCELLED: 'Reservation cancelled successfully',
  RESTAURANT_FETCHED: 'Restaurants fetched successfully',
  AVAILABILITY_CHECKED: 'Availability checked successfully',
};

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NOT_FOUND: 'Resource not found',
  RESERVATION_NOT_FOUND: 'Reservation not found',
  RESTAURANT_NOT_FOUND: 'Restaurant not found',
  TABLE_NOT_AVAILABLE: 'No tables available for selected time',
  BLACKOUT_DATE: 'Restaurant is closed on this date',
  CANNOT_MODIFY: 'Cannot modify reservation within 2 hours of start time',
  CANNOT_CANCEL: 'Cannot cancel reservation within 2 hours of start time',
  INTERNAL_ERROR: 'Internal server error',
};