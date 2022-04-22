import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalEntity } from './entities/arrival.entity';
import { ExceptionResultEntity } from './entities/exception-result.entity';
import { ExceptionEntity } from './entities/exception.entity';
import { NotificationsController } from './notifications.controller';
import { ArrivalsService } from './services/arrival.service';
import { ExceptionsResultService } from './services/exceptions-results.service';
import { ExceptionsService } from './services/exceptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExceptionEntity,
      ExceptionResultEntity,
      ArrivalEntity
    ])
  ],
  controllers: [NotificationsController],
  providers: [ExceptionsService, ExceptionsResultService, ArrivalsService]
})
export class NotificationsModule {}
