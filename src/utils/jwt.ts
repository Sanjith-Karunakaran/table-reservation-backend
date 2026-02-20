import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ─── ADMIN TOKEN FUNCTIONS ───────────────────────────────────────────────────
export const generateToken = (adminId: number, username: string): string => {
  return jwt.sign(
    { adminId, username, type: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ ADD THIS - Alias for generateToken
export const generateAdminToken = generateToken;

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// ─── CUSTOMER TOKEN FUNCTIONS ────────────────────────────────────────────────
export const generateCustomerToken = (userId: number, email: string): string => {
  return jwt.sign(
    { 
      userId, 
      email, 
      type: 'customer' 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyCustomerToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if ((decoded as any).type !== 'customer') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};