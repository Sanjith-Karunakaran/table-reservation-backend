import jwt from 'jsonwebtoken';

interface JWTPayload {
  adminId: number;
  restaurantId: number;
  username: string;
}

export class JWTUtil {
  private static readonly SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
  private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  /**
   * Generate JWT token
   */
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN,
    });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.SECRET) as JWTPayload;
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}