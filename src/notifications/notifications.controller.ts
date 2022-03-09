import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { sendExceptionEmail, sendExceptionResultEmail } from 'src/email';
import { ExceptionResultCreateDTO } from './dtos/exception-result/create.dto';
import ExceptionResultDTO from './dtos/exception-result/response.dto';
import { ExceptionCreateDTO } from './dtos/exception/exception-create.dto';
import { ExceptionDTO } from './dtos/exception/exception.dto';
import { ExceptionQPs } from './qps/exception.qps';
import { ResultQPs } from './qps/result.qps';
import { ExceptionsResultService } from './services/exceptions-results.service';
import { ExceptionsService } from './services/exceptions.service';

@Controller('notifications')
export class NotificationsController {
  private logger = new Logger(NotificationsController.name);

  constructor(
    private exceptionsService: ExceptionsService,
    private exceptionsResultService: ExceptionsResultService
  ) {}

  @MessagePattern('notifications_find_all_exceptions')
  async findAll(exceptionQPs: ExceptionQPs): Promise<ExceptionDTO[]> {
    return this.exceptionsService.findAll(exceptionQPs);
  }

  @MessagePattern('notifications_create_exception')
  async createException(body: any): Promise<ExceptionDTO> {
    const { exceptionDTO, recipients } = body;
    this.logger.debug('Creating Exception', exceptionDTO);
    const exception = await this.exceptionsService.create(exceptionDTO);
    this.logger.debug('Sending email to: ', recipients);
    // Send Mail
    sendExceptionEmail(recipients, {
      vehicle: exceptionDTO.vehicle,
      driver: exceptionDTO.driver,
      contractor: exceptionDTO.contractor
    });
    return exception;
  }

  @MessagePattern('notifications_update_exception')
  async updateException(id: number): Promise<ExceptionDTO> {
    return this.exceptionsService.update(id);
  }

  @MessagePattern('notifications_find_all_exception_results')
  async findAllResult(exceptionQPs: ResultQPs): Promise<ExceptionResultDTO[]> {
    return this.exceptionsResultService.findAll(exceptionQPs);
  }

  @MessagePattern('notifications_create_exception_result')
  async createExceptionResult(body: any): Promise<ExceptionResultDTO> {
    const { exceptionResultDTO, recipients } = body;
    this.logger.debug('Creating Exception Result', body);
    const exception = await this.exceptionsService.update(
      exceptionResultDTO.exceptionId
    );
    this.logger.debug('Exception updated: ', { exception });
    const exceptionResult = await this.exceptionsResultService.create(
      exceptionResultDTO
    );
    this.logger.debug('Exception Result created: ', { exceptionResult });

    this.logger.debug('Sending emails to:', recipients);
    // Send Mail
    sendExceptionResultEmail(recipients, exceptionResultDTO);
    return exceptionResult;
  }

  @MessagePattern('notifications_update_exception_result')
  async updateExceptionResult(id: number): Promise<ExceptionResultDTO> {
    return this.exceptionsResultService.update(id);
  }
}
