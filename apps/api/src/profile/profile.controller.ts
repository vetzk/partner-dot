import { Controller, Post, Body, Patch, Res, Next, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NextFunction, Response } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(
    @Body() createProfileDto: CreateProfileDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.profileService.create(createProfileDto, res, next);
  }

  @Get()
  getProfile(@Res() res: Response, @Next() next: NextFunction) {
    return this.profileService.getProfile(res, next);
  }

  @Patch()
  update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.profileService.update(updateProfileDto, res, next);
  }
}
