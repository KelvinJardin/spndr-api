import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  hello(@Param('id') id: string): string {
    return this.appService.getHello();
  }

  @Get()
  helloAll(): string {
    return this.appService.getHello();
  }

  @Post()
  createHello(): string {
    return this.appService.getHello();
  }
}
