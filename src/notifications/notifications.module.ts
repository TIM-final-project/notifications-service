import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExceptionEntity } from './entities/exception.entity';
import { NotificationsController } from './notifications.controller';
import { ExceptionsService } from './services/exceptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExceptionEntity])],
  controllers: [NotificationsController],
  providers: [ExceptionsService]
})
export class NotificationsModule {}
