import { Request, Response } from 'express';
import dataSource from '../database/typeorm/data-source';
import { User } from '../database/typeorm/entity/Users/User.entity';
import { AuthService } from '../services/auth.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 4 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
};

export class AuthController {
  private userRepo = dataSource.getRepository(User);
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();

      if (!user || !user.password) {
        return res.status(401).json({ message: 'Неверный логин или пароль' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Неверный логин или пароль' });
      }

      const tokens = this.authService.generateTokens(user.id);
      await this.authService.saveRefreshToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Ошибка при входе' });
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Token required' });
      }

      const secret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
      const payload: any = jwt.verify(refreshToken, secret);

      const user = await this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.currentHashedRefreshToken')
        .where('user.id = :id', { id: payload.userId })
        .getOne();

      if (!user || !user.currentHashedRefreshToken) {
        return res.status(401).json({ message: 'Доступ запрещен' });
      }

      const isTokenMatching = await bcrypt.compare(
        refreshToken,
        user.currentHashedRefreshToken
      );
      if (!isTokenMatching) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const tokens = this.authService.generateTokens(user.id);
      await this.authService.saveRefreshToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);

      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (userId) {
        await this.authService.removeRefreshToken(userId);
      }

      res.clearCookie('refreshToken');

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json({ message: 'Logout error' });
    }
  };

  getMe = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (!user) return res.status(404).json({ message: 'User not found' });

      return res.json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching profile' });
    }
  };
}
