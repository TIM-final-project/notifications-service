import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import {
  findAndReeplaceTemplate,
  sendGenericEmail
} from '../email';
import { ArrivalDTO } from './dtos/arrival/arrival.dto';
import { ExceptionDTO } from './dtos/exception/exception.dto';
import { GenericEmailDto } from './dtos/genericEmail.dto';
import { ResultTranslate } from './enum/Result.enum';
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
  
  // Exceptions
  @MessagePattern('notifications_find_all_exceptions')
  async findAll(exceptionQPs: ExceptionQPs): Promise<ExceptionDTO[]> {
    return this.exceptionsService.findAll(exceptionQPs);
  }

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

    const vehicle = JSON.parse(exception.arrival.vehicle);
    const driver = JSON.parse(exception.arrival.driver);


    const template = await findAndReeplaceTemplate('exceptionResult', {
      vehicle: vehicle.plate,
      driver: driver.name,
      contractor: exception.arrival.contractor,
      exceptionId: exception.id,
      comment: exception.comment,
      result: ResultTranslate[exception.result],
    });

    const info = await sendGenericEmail(template, 'Resolucion de Excepción', recipients);

    this.logger.debug('Exception result email sent', info);

    return exception;
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

    const vehicle = JSON.parse(arrivalDTO.vehicle);
    const driver = JSON.parse(arrivalDTO.driver);

    if (recipients?.managersEmails?.length) {
      const exceptionTemplate = await findAndReeplaceTemplate('exceptionCreate', {
        vehicle: vehicle.plate,
        driver: driver.name,
        contractor: arrivalDTO.contractor
      });
  
      await sendGenericEmail(exceptionTemplate, 'Nuevo pedido de Excepción', recipients.managersEmails);
  
      this.logger.debug('Exception creation email sent');

    }
    // Send Mail
    const arrivalTemplate = await findAndReeplaceTemplate('arrivalCreate', {
      vehicle: vehicle.plate,
      driver: driver.name,
      contractor: arrivalDTO.contractor
    });

    const info = await sendGenericEmail(arrivalTemplate, 'Nuevo anuncio de Arribo', recipients.expeditorsEmails);

    this.logger.debug('Arrival creation email sent', info);

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

      const template = await findAndReeplaceTemplate('arrivalUpdate', {
        driver: driver.name,
        vehicle: vehicle.plate,
        contractor: arrival.contractor,
        result: ResultTranslate[resultDTO.result]
      });
  
      const info = await sendGenericEmail(template, 'Resolucion de Arribo de transportista', recipients);
  
      this.logger.debug('Arrival update email sent', info);

    }
    return arrival;
  }

  // Notification
  @EventPattern('generic_email')
  async genericEmail(dto: GenericEmailDto){
    this.logger.debug(dto);
    const template = await findAndReeplaceTemplate(dto.template, dto.payload);

    const info = await sendGenericEmail(template, dto.subject ,dto.recipients);

    this.logger.debug("Generic email sent", info);
  }

}
