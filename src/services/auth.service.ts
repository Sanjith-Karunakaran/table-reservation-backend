import bcrypt from 'bcrypt';
import { AdminRepository } from '../repositories/admin.repository';
import { generateAdminToken } from '../utils/jwt';

export class AuthService {
  private adminRepo: AdminRepository;

  constructor() {
    this.adminRepo = new AdminRepository();
  }

  async login(username: string, password: string) {
    const admin = await this.adminRepo.findByUsername(username);
    
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateAdminToken(admin.id, admin.username);

    return {
      admin: {
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        restaurantId: admin.restaurantId,
        role: admin.role,
      },
      token,
    };
  }
}