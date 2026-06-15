import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../database/typeorm/entity/Users/User.entity';
import dataSource from '../database/typeorm/data-source';

export class AuthService {
  private userRepo = dataSource.getRepository(User);

  public generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET || 'access-secret',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '4d' }
    );

    return { accessToken, refreshToken };
  }

  public async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(userId, {
      currentHashedRefreshToken: hashedRefreshToken,
    });
  }

  public async removeRefreshToken(userId: string) {
    await this.userRepo.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
