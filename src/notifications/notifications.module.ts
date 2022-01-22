import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExceptionResultEntity } from './entities/exception-result.entity';
import { ExceptionEntity } from './entities/exception.entity';
import { NotificationsController } from './notifications.controller';
import { ExceptionsResultService } from './services/exceptions-results.service';
import { ExceptionsService } from './services/exceptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExceptionEntity, ExceptionResultEntity])],
  controllers: [NotificationsController],
  providers: [ExceptionsService, ExceptionsResultService]
})
export class NotificationsModule {}
