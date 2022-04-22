import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import {
  sendArrivalEmail,
  sendExceptionEmail,
  sendExceptionResultEmail
} from 'src/email';
import { ArrivalDTO } from './dtos/arrival/arrival.dto';
import ExceptionResultDTO from './dtos/exception-result/response.dto';
import { ExceptionDTO } from './dtos/exception/exception.dto';
import { States } from './enum/States.enum';
import { ArrivalQPs } from './qps/arrival.qps';
import { ExceptionQPs } from './qps/exception.qps';
import { ResultQPs } from './qps/result.qps';
import { ArrivalsService } from './services/arrival.service';
import { ExceptionsResultService } from './services/exceptions-results.service';
import { ExceptionsService } from './services/exceptions.service';

@Controller('notifications')
export class NotificationsController {
  private logger = new Logger(NotificationsController.name);

  constructor(
    private exceptionsService: ExceptionsService,
    private exceptionsResultService: ExceptionsResultService,
    private arrivalsService: ArrivalsService
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
    try {
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
    } catch (error) {
      throw new RpcException({
        message: 'Ha ocurrido un error al Actualizar la excepcion.'
      });
    }
  }

  @MessagePattern('notifications_update_exception_result')
  async updateExceptionResult(id: number): Promise<ExceptionResultDTO> {
    return this.exceptionsResultService.update(id);
  }

  // Arrivals
  @MessagePattern('arrivals_find_all')
  async findAllArrivals(arrivalQPs: ArrivalQPs): Promise<ArrivalDTO[]> {
    return this.arrivalsService.findAll(arrivalQPs);
  }

  @MessagePattern('arrivals_create')
  async createArrival(body: any): Promise<ArrivalDTO> {
    const { arrivalDTO, recipients } = body;
    this.logger.debug('Creating Arrival', arrivalDTO);
    const arrival = await this.arrivalsService.create(arrivalDTO);
    this.logger.debug('Sending email to: ', recipients);

    // TODO: Check if its created with exception
    // Send Mail
    sendArrivalEmail(recipients, {
      vehicle: arrivalDTO.vehicle,
      driver: arrivalDTO.driver,
      contractor: arrivalDTO.contractor
    });
    return arrival;
  }

  @MessagePattern('arrival_update')
  async updateArrival(id: number, state: States): Promise<ArrivalDTO> {
    // Este metodo deberia notificar a los seguridad que se permitio el ingreso
    return this.arrivalsService.update(id, state);
  }
}
