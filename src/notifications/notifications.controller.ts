import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  sendArrivalEmail,
  sendArrivalResultEmail,
  sendExceptionEmail,
  sendExceptionResultEmail
} from 'src/email';
import { ArrivalDTO } from './dtos/arrival/arrival.dto';
import { ExceptionUpdateDTO } from './dtos/exception/exception-update.dto';
import { ExceptionDTO } from './dtos/exception/exception.dto';
import { Result } from './enum/Result.enum';
import { ArrivalQPs } from './qps/arrival.qps';
import { ExceptionQPs } from './qps/exception.qps';
import { ArrivalsService } from './services/arrival.service';
import { ExceptionsService } from './services/exceptions.service';

@Controller('notifications')
export class NotificationsController {
  private logger = new Logger(NotificationsController.name);

  constructor(
    private exceptionsService: ExceptionsService,
    private arrivalsService: ArrivalsService
  ) {}

  @MessagePattern('notifications_find_all_exceptions')
  async findAll(exceptionQPs: ExceptionQPs): Promise<ExceptionDTO[]> {
    return this.exceptionsService.findAll(exceptionQPs);
  }

  // @MessagePattern('notifications_create_exception')
  // async createException(body: any): Promise<ExceptionDTO> {
  //   const { exceptionDTO, recipients } = body;
  //   this.logger.debug('Creating Exception', exceptionDTO);
  //   const exception = await this.exceptionsService.create(exceptionDTO);
  //   this.logger.debug('Sending email to: ', recipients);
  //   // Send Mail
  //   sendExceptionEmail(recipients, {
  //     vehicle: exceptionDTO.vehicle,
  //     driver: exceptionDTO.driver,
  //     contractor: exceptionDTO.contractor
  //   });
  //   return exception;
  // }

  @MessagePattern('notifications_update_exception')
  async updateException({
    exceptionId,
    updateExceptionDTO,
    recipients
  }): Promise<ExceptionDTO> {
    this.logger.debug('Updating exception', {
      exceptionId,
      updateExceptionDTO,
      recipients
    });
    const exception: ExceptionDTO = await this.exceptionsService.update(
      exceptionId,
      updateExceptionDTO
    );

    sendExceptionResultEmail(recipients, {
      exceptionId: exception.id,
      comment: exception.comment,
      result: exception.result,
      managerId: exception.managerId
    });
    return exception;
  }

  // @MessagePattern('notifications_find_all_exception_results')
  // async findAllResult(exceptionQPs: ResultQPs): Promise<ExceptionResultDTO[]> {
  //   return this.exceptionsResultService.findAll(exceptionQPs);
  // }

  // @MessagePattern('notifications_create_exception_result')
  // async createExceptionResult(body: any): Promise<ExceptionResultDTO> {
  //   try {
  //     const { exceptionResultDTO, recipients } = body;
  //     this.logger.debug('Creating Exception Result', body);
  //     const exception = await this.exceptionsService.update(
  //       exceptionResultDTO.exceptionId
  //     );
  //     this.logger.debug('Exception updated: ', { exception });
  //     const exceptionResult = await this.exceptionsResultService.create(
  //       exceptionResultDTO
  //     );
  //     this.logger.debug('Exception Result created: ', { exceptionResult });

  //     this.logger.debug('Sending emails to:', recipients);
  //     Send Mail
  //     sendExceptionResultEmail(recipients, exceptionResultDTO);
  //     return exceptionResult;
  //   } catch (error) {
  //     throw new RpcException({
  //       message: 'Ha ocurrido un error al Actualizar la excepcion.'
  //     });
  //   }
  // }

  // @MessagePattern('notifications_update_exception_result')
  // async updateExceptionResult(id: number): Promise<ExceptionResultDTO> {
  //   return this.exceptionsResultService.update(id);
  // }

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

    if (!recipients?.managersEmails?.length) {
      sendExceptionEmail(recipients.managersEmails, {
        vehicle: arrivalDTO.vehicle,
        driver: arrivalDTO.driver,
        contractor: arrivalDTO.contractor
      });
    }
    // Send Mail
    const vehicle = JSON.parse(arrivalDTO.vehicle);
    const driver = JSON.parse(arrivalDTO.driver);
    sendArrivalEmail(recipients.expeditorsEmails, {
      vehicle: vehicle.plate,
      driver: driver.name,
      contractor: arrivalDTO.contractor
    });
    return arrival;
  }

  @MessagePattern('arrival_update')
  async updateArrival({ id, resultDTO, recipients }): Promise<ArrivalDTO> {
    // Este metodo deberia notificar a los seguridad que se permitio el ingreso
    this.logger.debug('Updating arrival', { id, resultDTO, recipients });
    const arrival: ArrivalDTO = await this.arrivalsService.update(
      id,
      resultDTO
    );
    if (resultDTO.result) {
      const vehicle = JSON.parse(arrival.vehicle);
      const driver = JSON.parse(arrival.driver);
      sendArrivalResultEmail(recipients, {
        driver: driver.name,
        vehicle: vehicle.plate,
        contractor: arrival.contractor,
        result: resultDTO.result
      });
    }
    return arrival;
  }
}
