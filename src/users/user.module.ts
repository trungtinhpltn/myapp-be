import { Module } from '@nestjs/common';
import { UserService } from './users.service.js';
import { UserController } from './user.controller.js';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
