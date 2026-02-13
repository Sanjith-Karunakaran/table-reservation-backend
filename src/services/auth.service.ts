import { AdminRepository } from '../repositories/admin.repository';
import { PasswordUtil } from '../utils/password';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ERROR_MESSAGES } from '../constants/message';

interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthService {
  private adminRepo: AdminRepository;

  constructor() {
    this.adminRepo = new AdminRepository();
  }

  async login(credentials: LoginCredentials) {
    const { username, password } = credentials;

    // 1. Find admin by username
    const admin = await this.adminRepo.findByUsername(username);
    
    if (!admin) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // 2. Check if admin is active
    if (admin.status !== 'ACTIVE') {
      throw new UnauthorizedError('Admin account is inactive');
    }

    // 3. Verify password
    const isPasswordValid = await PasswordUtil.compare(password, admin.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // 4. Update last login
    await this.adminRepo.updateLastLogin(admin.id);

    // 5. Return admin info (without password)
    return {
      adminId: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      email: admin.email,
      restaurantId: admin.restaurantId,
      role: admin.role,
    };
  }

  async getAdminById(adminId: number) {
    const admin = await this.adminRepo.findById(adminId);
    
    if (!admin) {
      throw new UnauthorizedError('Admin not found');
    }

    return {
      adminId: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      email: admin.email,
      restaurantId: admin.restaurantId,
      role: admin.role,
    };
  }
}