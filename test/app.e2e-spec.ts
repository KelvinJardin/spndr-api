import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { HealthResponse } from '../src/types/healthResponse.type';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/app/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/app/health')
      .expect(200)
      .expect(({text}) => {
        const {status, version}: HealthResponse = JSON.parse(text);
        
        expect(status).toBe('healthy');
        expect(version).toMatch(/\d+\.\d+\.\d+/);
      });

  });
});
