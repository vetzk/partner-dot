import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createToken } from '../src/utils/jwt';

describe('Profile E2E Testing', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

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

  it('should create a new profile', async () => {
    const response = await request(app.getHttpServer())
      .post('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        address: '1234 Test Street',
        phone: '1234567890',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Create profile success');
    expect(response.body.result).toHaveProperty('firstName', 'John');
    expect(response.body.result).toHaveProperty('lastName', 'Doe');
    expect(response.body.result).toHaveProperty('address', '1234 Test Street');
    expect(response.body.result).toHaveProperty('phone', '1234567890');
  });

  it('should return 404 if the user is not found', async () => {
    const nonExistentToken = createToken(
      { email: 'nonexistent@example.com' },
      '24h',
    );

    const response = await request(app.getHttpServer())
      .post('/profile')
      .set('Authorization', `Bearer ${nonExistentToken}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        address: '1234 Test Street',
        phone: '1234567890',
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Cannot find user');
  });

  it('should return 401 if token is not provided', async () => {
    const response = await request(app.getHttpServer()).post('/profile').send({
      firstName: 'John',
      lastName: 'Doe',
      address: '1234 Test Street',
      phone: '1234567890',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Token does not exist');
  });

  it('/profile (GET) - should get the profile of the logged-in user', async () => {
    const response = await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Get profile success');
    expect(response.body.result).toHaveProperty('firstName');
  });

  it('/profile - should update the profile', async () => {
    const response = await request(app.getHttpServer())
      .patch('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'UpdatedName',
        lastName: 'UpdatedLastName',
        address: 'UpdatedAddress',
        phone: '987654321',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Update profile success');
    expect(response.body.result).toHaveProperty('firstName', 'UpdatedName');
    expect(response.body.result).toHaveProperty('lastName', 'UpdatedLastName');
  });

  it('should return 401 if token is not provided when getting profile', async () => {
    const response = await request(app.getHttpServer()).get('/profile');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Token does not exist');
  });

  it('should return 401 if token is not provided when updating profile', async () => {
    const response = await request(app.getHttpServer()).patch('/profile').send({
      firstName: 'John',
      lastName: 'Doe',
      address: '1234 Test Street',
      phone: '1234567890',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Token does not exist');
  });
});
