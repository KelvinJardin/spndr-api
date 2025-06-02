import { Injectable } from '@nestjs/common';
import { version } from '../package.json';
import { HealthResponse } from './types/healthResponse.type';

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'healthy',
      version,
    };
  }
}
