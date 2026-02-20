import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { ERROR_MESSAGES } from '../constants/message';

interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export class CustomerAuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async login(credentials: LoginCredentials) {
    const { email, phone, password } = credentials;

    // Find user
    let user;
    if (email) {
      user = await this.userRepo.findByEmail(email);
    } else if (phone) {
      user = await this.userRepo.findByPhone(phone);
    }

    if (!user) {
      throw new Error(ERROR_MESSAGES.CUSTOMER_INVALID_CREDENTIALS);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.CUSTOMER_INVALID_CREDENTIALS);
    }

    // ✅ RETURN FLAT USER OBJECT (no token, no nesting)
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    };
  }
}