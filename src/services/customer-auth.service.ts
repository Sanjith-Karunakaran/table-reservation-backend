import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { generateCustomerToken } from '../utils/jwt';

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

    // Find user by email or phone
    let user;
    if (email) {
      user = await this.userRepo.findByEmail(email);
    } else if (phone) {
      user = await this.userRepo.findByPhone(phone);
    }

    if (!user) {
      throw new UnauthorizedError('Invalid email/phone or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email/phone or password');
    }

    // Generate JWT token (expires in 7 days)
    const token = generateCustomerToken(user.id, user.email);

    // Return user data (without password) and token
    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      token,
    };
  }

  async getUserById(userId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return user;
  }
}