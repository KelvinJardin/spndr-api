import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HobbyResponse } from '../src/types/hobby.type';
import { UserResponse } from '../src/types/user.type';

describe('HobbiesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUser: UserResponse;
  let testHobby: HobbyResponse;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Create test user
    testUser = await prisma.user.create({
      data: {
        name: 'Hobby Test User',
        email: 'hobby-test@example.com',
        type: 'user',
        provider: 'email',
        providerAccountId: 'hobby-test@example.com',
      },
    });

    // Create test hobby
    testHobby = await prisma.hobby.create({
      data: {
        name: 'Test Hobby',
        description: 'Test Description',
        isActive: true,
        userId: testUser.id,
      },
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.hobby.delete({
      where: { id: testHobby.id },
    });
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    await prisma.$disconnect();
    await app.close();
  });

  describe('/users/:userId/hobbies (GET)', () => {
    it('should return an array of hobbies', () => {
      return request(app.getHttpServer())
        .get(`/users/${testUser.id}/hobbies`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                userId: testUser.id,
              }),
            ]),
          );
        });
    });
  });

  describe('/users/:userId/hobbies/:id (GET)', () => {
    it('should return a hobby by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${testUser.id}/hobbies/${testHobby.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining({
            id: testHobby.id,
            name: testHobby.name,
            userId: testUser.id,
          }));
        });
    });

    it('should return 404 for non-existent hobby', () => {
      return request(app.getHttpServer())
        .get(`/users/${testUser.id}/hobbies/non-existent-id`)
        .expect(404);
    });
  });
});