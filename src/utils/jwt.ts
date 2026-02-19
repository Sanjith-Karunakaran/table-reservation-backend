import jwt from 'jsonwebtoken';

// ✅ FIXED: Get JWT_SECRET directly from process.env
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ─── ADMIN TOKEN FUNCTIONS ───────────────────────────────────────────────────
export const generateToken = (adminId: number, username: string): string => {
  return jwt.sign(
    { adminId, username, type: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// ─── CUSTOMER TOKEN FUNCTIONS ────────────────────────────────────────────────
// ✅ NEW: Generate customer JWT token (expires in 7 days)
export const generateCustomerToken = (userId: number, email: string): string => {
  return jwt.sign(
    { 
      userId, 
      email, 
      type: 'customer' 
    },
    JWT_SECRET,
    { expiresIn: '7d' }  // 7 days = 604800 seconds
  );
};

// ✅ NEW: Verify customer JWT token
export const verifyCustomerToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ensure it's a customer token
    if ((decoded as any).type !== 'customer') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};