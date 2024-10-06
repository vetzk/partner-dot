import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service'; // If using Prisma

describe('Auth E2E Testing (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  let token: string;

  it('/auth/register (POST) - should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'strongpassword',
        confirmPassword: 'strongpassword',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.result).toHaveProperty('token');
  });

  it('/auth/login (POST) - should login a user and return a token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'strongpassword',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.result).toHaveProperty('token');

    token = response.body.result.token;
  });
});
