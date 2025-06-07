import { Injectable } from '@nestjs/common';
import { version } from '../package.json';
import { type HealthResponse } from './types';

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'healthy',
      version,
    };
  }
}
