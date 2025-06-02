import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { HealthResponse } from './types/healthResponse.type';
import { HealthResponseDto } from './dtos/healthResponse.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health
   *
   * @remarks Get the app status
   *
   * @returns The app status
   */
  @Get('health')
  @ApiResponse({ status: 200, type: HealthResponseDto })
  health(): HealthResponse {
    return this.appService.getHealth();
  }
}
