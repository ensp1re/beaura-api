import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth/auth.module';

import { UsersModule } from '../users/users.module';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
