import { Injectable, Next, Res } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NextFunction, Response } from 'express';
import { hashPassword } from '../utils/hash';
import { createToken } from '../utils/jwt';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async create(
    createAuthDto: CreateAuthDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const { email, password, confirmPassword } = createAuthDto;
    try {
      const findEmailExist = await this.prisma.user.findUnique({
        where: { email },
      });

      if (findEmailExist) {
        return res.status(401).send({
          success: false,
          message: 'Email already exist. Choose another one',
        });
      }

      if (password !== confirmPassword) {
        return res.status(401).send({
          success: false,
          message: "Password doesn't match",
        });
      }

      const user = await this.prisma.user.create({
        data: {
          email,
          password: await hashPassword(password),
        },
      });

      const token = createToken({ email: user.email }, '24h');

      return res.status(200).send({
        success: true,
        message: 'Register success',
        result: { user, token },
      });
    } catch (error) {
      console.log(error);
      next({ success: false, message: 'Cannot register', error });
    }
  }

  async login(
    loginDto: LoginDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const { email, password } = loginDto;
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        return res.status(404).send({
          success: false,
          message: "Email doesn't exist",
        });
      }

      const comparePassword = compareSync(password, findUser.password);

      if (!comparePassword) {
        return res.status(401).send({
          success: false,
          message: 'Wrong password',
        });
      }

      const token = createToken({ email: findUser.email }, '24h');
      console.log(token);

      return res.status(200).send({
        success: true,
        message: 'Login success',
        result: { email: findUser.email, token },
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Failed to login',
        error,
      });
    }
  }
}
