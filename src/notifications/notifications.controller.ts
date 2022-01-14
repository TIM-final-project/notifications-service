import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionCreateDTO } from './dtos/exception-create.dto';
import { ExceptionDTO } from './dtos/exception.dto';
import { ExceptionQPs } from './qps/exception.qps';
import { ExceptionsService } from './services/exceptions.service';

@Controller('notifications')
export class NotificationsController {
  private logger = new Logger(NotificationsController.name);

  constructor(private exceptionsService: ExceptionsService) {}

  @MessagePattern('notifications_find_all_exceptions')
  async findAll(exceptionQPs: ExceptionQPs): Promise<ExceptionDTO[]> {
    return this.exceptionsService.findAll(exceptionQPs);
  }

  @MessagePattern('notifications_create_exception')
  async createException(
    exceptionDTO: ExceptionCreateDTO
  ): Promise<ExceptionDTO> {
    this.logger.debug('Creating Exception', exceptionDTO);
    return this.exceptionsService.create(exceptionDTO);
  }

  @MessagePattern('notifications_update_exception')
  async updateException(id: number): Promise<ExceptionDTO> {
    return this.exceptionsService.update(id);
  }
}
