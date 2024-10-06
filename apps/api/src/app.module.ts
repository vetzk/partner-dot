import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';

@Module({
  imports: [AuthModule, ProfileModule, PrismaModule],
  controllers: [AppController, AuthController, ProfileController],
  providers: [AppService, AuthService, ProfileService, PrismaService],
})
export class AppModule {}
