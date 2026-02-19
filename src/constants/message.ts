export const SUCCESS_MESSAGES = {
  // Reservation
  RESERVATION_CREATED: 'Reservation created successfully',
  RESERVATION_UPDATED: 'Reservation updated successfully',
  RESERVATION_CANCELLED: 'Reservation cancelled successfully',
  RESERVATION_COMPLETED: 'Reservation marked as completed',
  RESERVATION_NO_SHOW: 'Reservation marked as no-show',

  // Admin Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',

  // Customer Auth
  CUSTOMER_LOGIN_SUCCESS: 'Welcome back!',
  CUSTOMER_SIGNUP_SUCCESS: 'Account created successfully',
  
  // Table
  TABLE_STATUS_UPDATED: 'Table status updated successfully',
  TABLE_CREATED: 'Table created successfully',
  TABLE_UPDATED: 'Table updated successfully',
  TABLE_DELETED: 'Table deleted successfully',

  // Restaurant
  RESTAURANT_CREATED: 'Restaurant created successfully',
  RESTAURANT_UPDATED: 'Restaurant updated successfully',
  RESTAURANT_DELETED: 'Restaurant deleted successfully',
  RESTAURANT_FETCHED: 'Restaurants fetched successfully',  // ✅ ADDED
} as const;

export const ERROR_MESSAGES = {
  // General
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred',
  INVALID_REQUEST: 'Invalid request data',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',

  // Customer Auth
  CUSTOMER_INVALID_CREDENTIALS: 'Invalid email/phone or password',
  CUSTOMER_NOT_FOUND: 'Customer not found',
  CUSTOMER_ALREADY_EXISTS: 'An account with this email or phone already exists',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  TOKEN_INVALID: 'Invalid authentication token',
  LOGIN_REQUIRED: 'Please login to continue',

  // Admin Auth
  INVALID_CREDENTIALS: 'Invalid username or password',
  ADMIN_NOT_FOUND: 'Admin not found',

  // Reservation
  RESERVATION_NOT_FOUND: 'Reservation not found',
  RESERVATION_CONFLICT: 'This time slot is already booked',
  RESERVATION_PAST: 'Cannot modify past reservations',
  CANNOT_MODIFY: 'Cannot modify reservation within 2 hours of start time',
  CANNOT_CANCEL: 'Cannot cancel reservation within 2 hours of start time',
  NO_TABLES_AVAILABLE: 'No tables available for this time slot',
  BLACKOUT_DATE: 'Restaurant is closed on this date',  // ✅ ADDED

  // Table
  TABLE_NOT_FOUND: 'Table not found',
  TABLE_UNAVAILABLE: 'Table is not available',  // ✅ Keep this name (not TABLE_NOT_AVAILABLE)
  TABLE_IN_USE: 'Cannot modify table - it has active reservations',

  // Restaurant
  RESTAURANT_NOT_FOUND: 'Restaurant not found',
  RESTAURANT_CLOSED: 'Restaurant is closed at this time',
  INVALID_TIME_SLOT: 'Invalid time slot selected',

  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PHONE: 'Invalid phone number',
  INVALID_DATE: 'Invalid date format',
  INVALID_TIME: 'Invalid time format',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_NO_SPECIAL_CHAR: 'Password must contain at least one special character',
} as const;