import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserResponse } from '../src/types/user.type';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUser: UserResponse;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: 'E2E Test User',
        email: 'e2e-test@example.com',
        type: 'user',
        provider: 'email',
        providerAccountId: 'e2e-test@example.com',
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        provider: true,
        providerAccountId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    testUser = user;
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    await prisma.$disconnect();
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return an array of users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                email: expect.any(String),
              }),
            ]),
          );
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${testUser.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining({
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
          }));
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/non-existent-id')
        .expect(404);
    });
  });
});