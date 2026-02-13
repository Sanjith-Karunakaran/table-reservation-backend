const API_URL = 'http://localhost:5000/api';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Helper functions
const log = {
  header: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`),
  section: (msg) => console.log(`${colors.blue}${colors.bright}${msg}${colors.reset}`),
  test: (msg) => console.log(`\n${colors.yellow}➤ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  data: (data) => console.log(JSON.stringify(data, null, 2)),
};

// Test data storage
const testData = {
  restaurantId: null,
  reservationId: null,
  adminId: null,
  tableId: null,
  waitlistId: null,
};

// Future date for testing
const futureDate = '2026-03-15';
const todayDate = new Date().toISOString().split('T')[0];

// Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// API request helper
async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// ============================================
// CUSTOMER API TESTS
// ============================================

async function testCustomerAPI() {
  log.header();
  log.section('🛍️  CUSTOMER API TESTS');
  log.header();

  // TEST 1: Get All Restaurants
  log.test('TEST 1: Get All Restaurants');
  try {
    const result = await apiRequest('GET', '/customer/restaurants');
    if (result.data.success && result.data.data.length === 3) {
      log.success(`Found ${result.data.data.length} restaurants`);
      testData.restaurantId = result.data.data[0].id;
      log.info(`Using Restaurant ID: ${testData.restaurantId}`);
      result.data.data.forEach((r) => {
        console.log(`  - ${r.restaurantName} (ID: ${r.id})`);
      });
    } else {
      log.error('Failed to fetch restaurants');
      log.data(result.data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 2: Get Restaurant by ID
  log.test('TEST 2: Get Restaurant by ID');
  try {
    const result = await apiRequest('GET', `/customer/restaurants/${testData.restaurantId}`);
    if (result.data.success) {
      log.success(`Retrieved restaurant: ${result.data.data.restaurantName}`);
      log.info(`Tables available: ${result.data.data.tables?.length || 0}`);
    } else {
      log.error('Failed to fetch restaurant details');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 3: Check Availability
  log.test('TEST 3: Check Table Availability');
  try {
    const result = await apiRequest('POST', '/customer/availability', {
      restaurantId: testData.restaurantId,
      reservationDate: futureDate,
      startTime: '19:00',
      guestCount: 4,
    });
    if (result.data.success && result.data.data.available) {
      log.success(`${result.data.data.tables.length} tables available`);
      log.info(`Tables: ${result.data.data.tables.map((t) => t.tableNumber).join(', ')}`);
    } else {
      log.error('No tables available or error occurred');
      log.data(result.data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 4: Create Reservation
  log.test('TEST 4: Create Reservation');
  try {
    const result = await apiRequest('POST', '/customer/reservations', {
      restaurantId: testData.restaurantId,
      reservationDate: futureDate,
      startTime: '19:00',
      guestCount: 4,
      customerName: 'John Doe',
      customerPhone: '1234567890',
      customerEmail: 'john@example.com',
      specialRequests: 'Window seat preferred',
    });
    if (result.data.success) {
      testData.reservationId = result.data.data.id;
      log.success(`Reservation created (ID: ${testData.reservationId})`);
      log.info(`Table: ${result.data.data.table.tableNumber}`);
      log.info(`Time: ${result.data.data.startTime} - ${result.data.data.endTime}`);
    } else {
      log.error('Failed to create reservation');
      log.data(result.data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 5: Get Reservation by ID
  log.test('TEST 5: Get Reservation by ID');
  try {
    const result = await apiRequest('GET', `/customer/reservations/${testData.reservationId}`);
    if (result.data.success) {
      log.success('Reservation retrieved successfully');
      log.info(`Customer: ${result.data.data.customerName}`);
      log.info(`Status: ${result.data.data.status}`);
    } else {
      log.error('Failed to retrieve reservation');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 6: Lookup Reservations by Phone
  log.test('TEST 6: Lookup Reservations by Phone');
  try {
    const result = await apiRequest(
      'GET',
      '/customer/reservations?phone=1234567890'
    );
    if (result.data.success) {
      log.success(`Found ${result.data.data.length} reservation(s)`);
      result.data.data.forEach((r) => {
        console.log(`  - ID: ${r.id}, Date: ${r.reservationDate}, Status: ${r.status}`);
      });
    } else {
      log.error('Failed to lookup reservations');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 7: Update Reservation
  log.test('TEST 7: Update Reservation');
  try {
    const result = await apiRequest('PUT', `/customer/reservations/${testData.reservationId}`, {
      guestCount: 6,
      specialRequests: 'Birthday celebration',
    });
    if (result.data.success) {
      log.success('Reservation updated successfully');
      log.info(`New guest count: ${result.data.data.guestCount}`);
    } else {
      log.error('Failed to update reservation');
      log.data(result.data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 8: Check Availability Again (should show one less table)
  log.test('TEST 8: Check Availability Again (after booking)');
  try {
    const result = await apiRequest('POST', '/customer/availability', {
      restaurantId: testData.restaurantId,
      reservationDate: futureDate,
      startTime: '19:00',
      guestCount: 4,
    });
    if (result.data.success) {
      log.success(`${result.data.data.tables.length} tables available (should be one less)`);
    } else {
      log.error('Availability check failed');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 9: Join Waitlist
  log.test('TEST 9: Join Waitlist');
  try {
    const result = await apiRequest('POST', '/customer/waitlist', {
      restaurantId: testData.restaurantId,
      customerName: 'Jane Smith',
      customerPhone: '0987654321',
      customerEmail: 'jane@example.com',
      requestedDate: futureDate,
      requestedTime: '20:00',
      guestCount: 4,
    });
    if (result.data.success) {
      testData.waitlistId = result.data.data.waitlistEntry.id;
      log.success(`Joined waitlist (ID: ${testData.waitlistId})`);
      log.info(`Position: ${result.data.data.position}`);
    } else {
      log.error('Failed to join waitlist');
      log.data(result.data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 10: Get Waitlist Status
  log.test('TEST 10: Get Waitlist Status');
  try {
    const result = await apiRequest('GET', `/customer/waitlist/${testData.waitlistId}`);
    if (result.data.success) {
      log.success('Waitlist status retrieved');
      log.info(`Status: ${result.data.data.entry.status}`);
      log.info(`Position: ${result.data.data.position}`);
    } else {
      log.error('Failed to get waitlist status');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }
}

// ============================================
// ADMIN API TESTS
// ============================================

async function testAdminAPI() {
  log.header();
  log.section('🔐 ADMIN API TESTS');
  log.header();

  // TEST 1: Admin Login
  log.test('TEST 1: Admin Login');
  try {
    const result = await apiRequest('POST', '/admin/login', {
      username: 'admin_downtown',
      password: 'admin123',
    });
    if (result.data.success) {
      testData.adminId = result.data.data.adminId;
      testData.restaurantId = result.data.data.restaurantId;
      log.success(`Login successful (Admin ID: ${testData.adminId})`);
      log.info(`Restaurant: ${testData.restaurantId}`);
      log.info(`Name: ${result.data.data.fullName}`);
    } else {
      log.error('Login failed');
      log.data(result.data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 2: Get Dashboard Stats
  log.test('TEST 2: Get Dashboard Stats');
  try {
    const result = await apiRequest('GET', `/admin/dashboard?restaurantId=${testData.restaurantId}`);
    if (result.data.success) {
      log.success('Dashboard stats retrieved');
      log.info(`Total Reservations Today: ${result.data.data.today.totalReservations}`);
      log.info(`Confirmed: ${result.data.data.today.confirmed}`);
      log.info(`Total Tables: ${result.data.data.tables.total}`);
      log.info(`Available: ${result.data.data.tables.available}`);
    } else {
      log.error('Failed to get dashboard stats');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 3: Get All Reservations
  log.test('TEST 3: Get All Reservations');
  try {
    const result = await apiRequest('GET', `/admin/reservations?restaurantId=${testData.restaurantId}&date=${futureDate}`);
    if (result.data.success) {
      log.success(`Found ${result.data.data.length} reservation(s)`);
      result.data.data.forEach((r) => {
        console.log(`  - ID: ${r.id}, Customer: ${r.customerName}, Time: ${r.startTime}`);
      });
    } else {
      log.error('Failed to get reservations');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 4: Create Manual Booking (Walk-in)
  log.test('TEST 4: Create Manual Booking (Walk-in)');
  try {
    const result = await apiRequest('POST', '/admin/reservations', {
      restaurantId: testData.restaurantId,
      reservationDate: futureDate,
      startTime: '18:00',
      guestCount: 2,
      customerName: 'Walk-in Customer',
      customerPhone: '5556667777',
      customerEmail: 'walkin@example.com',
      bookingSource: 'WALK_IN',
    });
    if (result.data.success) {
      log.success(`Manual booking created (ID: ${result.data.data.id})`);
      log.info(`Table: ${result.data.data.table.tableNumber}`);
      log.info(`Source: ${result.data.data.bookingSource}`);
    } else {
      log.error('Failed to create manual booking');
      log.data(result.data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 5: Get All Tables
  log.test('TEST 5: Get All Tables');
  try {
    const result = await apiRequest('GET', `/admin/tables?restaurantId=${testData.restaurantId}`);
    if (result.data.success) {
      log.success(`Found ${result.data.data.length} table(s)`);
      testData.tableId = result.data.data[2]?.id; // Get 3rd table for testing
      result.data.data.slice(0, 5).forEach((t) => {
        console.log(`  - ${t.tableNumber}: Capacity ${t.capacity}, Status: ${t.status}`);
      });
    } else {
      log.error('Failed to get tables');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 6: Toggle Table Maintenance
  log.test('TEST 6: Toggle Table to Maintenance');
  try {
    const result = await apiRequest('PATCH', `/admin/tables/${testData.tableId}/status`, {
      status: 'MAINTENANCE',
    });
    if (result.data.success) {
      log.success('Table marked as MAINTENANCE');
    } else {
      log.error('Failed to update table status');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 7: Toggle Table Back to Available
  log.test('TEST 7: Toggle Table Back to Available');
  try {
    const result = await apiRequest('PATCH', `/admin/tables/${testData.tableId}/status`, {
      status: 'AVAILABLE',
    });
    if (result.data.success) {
      log.success('Table marked as AVAILABLE');
    } else {
      log.error('Failed to update table status');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 8: Update Reservation (Admin - No Restrictions)
  log.test('TEST 8: Admin Update Reservation');
  try {
    const result = await apiRequest('PUT', `/admin/reservations/${testData.reservationId}`, {
      specialRequests: 'VIP table - Admin updated',
    });
    if (result.data.success) {
      log.success('Reservation updated by admin');
    } else {
      log.error('Failed to update reservation');
      log.data(result.data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 9: Mark Reservation as Completed
  log.test('TEST 9: Mark Reservation as Completed');
  try {
    const result = await apiRequest('PATCH', `/admin/reservations/${testData.reservationId}/complete`);
    if (result.data.success) {
      log.success('Reservation marked as COMPLETED');
    } else {
      log.error('Failed to mark as completed');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  await delay(500);

  // TEST 10: Admin Logout
  log.test('TEST 10: Admin Logout');
  try {
    const result = await apiRequest('POST', '/admin/logout');
    if (result.data.success) {
      log.success('Logout successful');
    } else {
      log.error('Logout failed');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }
}

// ============================================
// MAIN TEST RUNNER
// ============================================

async function runAllTests() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   🍽️  RESTAURANT RESERVATION API TESTING SUITE          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);

  log.info(`API URL: ${API_URL}`);
  log.info(`Test Date: ${futureDate}`);
  log.info(`Today: ${todayDate}`);

  try {
    await testCustomerAPI();
    await delay(1000);
    await testAdminAPI();

    log.header();
    log.section('🎉 ALL TESTS COMPLETED');
    log.header();
    console.log(`\n${colors.green}${colors.bright}✓ Test Suite Finished Successfully!${colors.reset}\n`);
  } catch (error) {
    log.error(`Test suite failed: ${error.message}`);
    console.error(error);
  }
}

// Run the tests
runAllTests();