import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { HobbiesModule } from './modules/hobbies/hobbies.module';

@Module({
  imports: [PrismaModule, UsersModule, HobbiesModule],
  controllers: [AppController],
  providers: [AppService],
})
  
export class AppModule {}
