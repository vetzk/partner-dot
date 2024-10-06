import { Controller, Get, Post, Body, Param, Res, Next } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { NextFunction, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(
    @Body() createAuthDto: CreateAuthDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.authService.create(createAuthDto, res, next);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.authService.login(loginDto, res, next);
  }
}
