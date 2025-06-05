import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthResponse } from './types';
import { HealthResponseDto } from './dto';

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
