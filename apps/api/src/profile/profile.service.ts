import { Injectable, Next, Res } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NextFunction, Response } from 'express';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async create(
    createProfileDto: CreateProfileDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const { firstName, lastName, address, phone } = createProfileDto;
    if (!res.locals.decrypt.email) {
      return res.status(404).send({
        success: false,
        message: 'Cannot find token',
      });
    }

    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          email: res.locals.decrypt.email,
        },
      });

      if (!findUser) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find user',
        });
      }

      const findManyProfile = await this.prisma.profile.findMany({
        where: {
          userId: findUser.id,
        },
      });

      if (findManyProfile.length >= 1) {
        return res.status(401).send({
          success: false,
          message: 'Cannot create more than one profile',
        });
      }

      const profile = await this.prisma.profile.create({
        data: {
          firstName,
          lastName,
          address,
          phone,
          userId: findUser.id,
        },
      });

      return res.status(200).send({
        success: true,
        message: 'Create profile success',
        result: profile,
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Cannot create profile',
        error,
      });
    }
  }

  async getProfile(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          email: res.locals.decrypt.email,
        },
      });

      if (!findUser) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      const findProfile = await this.prisma.profile.findFirst({
        where: {
          userId: findUser.id,
        },
      });

      return res.status(200).send({
        success: true,
        message: 'Get profile success',
        result: findProfile,
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Cannot get your profile',
        error,
      });
    }
  }

  async update(
    updateProfileDto: UpdateProfileDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const { firstName, lastName, address, phone } = updateProfileDto;
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          email: res.locals.decrypt.email,
        },
      });

      if (!findUser) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find user',
        });
      }

      const findProfile = await this.prisma.profile.findFirst({
        where: {
          userId: findUser.id,
        },
      });

      if (!findProfile) {
        return res.status(401).send({
          success: false,
          message: 'Unauthorized',
        });
      }

      const updateProfile = await this.prisma.profile.update({
        data: {
          firstName: firstName ? firstName : findProfile.firstName,
          lastName: lastName ? lastName : findProfile.lastName,
          address: address ? address : findProfile.address,
          phone: phone ? phone : findProfile.phone,
        },
        where: {
          id: findProfile.id,
        },
      });

      return res.status(200).send({
        success: true,
        message: 'Update profile success',
        result: updateProfile,
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Cannot update profile',
      });
    }
  }
}
