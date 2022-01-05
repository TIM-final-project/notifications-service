import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { ExceptionsService } from './services/exceptions.service';

@Module({
  controllers: [NotificationsController],
  providers: [ExceptionsService]
})
export class NotificationsModule {}
