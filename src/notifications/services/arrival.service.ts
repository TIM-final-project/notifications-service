import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ArrivalCreateDTO } from '../dtos/arrival/arrival-create.dto';
import { ArrivalResultDTO } from '../dtos/arrival/arrival-update.dto';
import { ArrivalDTO } from '../dtos/arrival/arrival.dto';
import { ArrivalWhere } from '../dtos/arrival/arrival.where';
import { ArrivalEntity } from '../entities/arrival.entity';
import { ExceptionEntity } from '../entities/exception.entity';
import { Result } from '../enum/Result.enum';
import { States } from '../enum/States.enum';
import { ArrivalQPs } from '../qps/arrival.qps';

@Injectable()
export class ArrivalsService {
  private readonly logger = new Logger(ArrivalsService.name);

  constructor(
    @InjectRepository(ArrivalEntity)
    private arrivalsRepository: Repository<ArrivalEntity>,
    @InjectRepository(ExceptionEntity)
    private exceptionsRepository: Repository<ExceptionEntity>
  ) {}

  async findAll({
    driverId,
    vehicleId,
    securityId,
    state,
    arrivalTime,
    before,
    after
  }: ArrivalQPs): Promise<ArrivalDTO[]> {
    this.logger.debug('Getting Arrival', {
      driverId,
      vehicleId,
      securityId,
      state,
      arrivalTime,
      before,
      after
    });
    const where: ArrivalWhere = {};

    if (!!driverId) where.driverId = driverId;
    if (!!vehicleId) where.vehicleId = vehicleId;
    if (!!securityId) where.securityId = securityId;
    if (!!state) where.state = state;

    if (!!before && !!after) {
      where.arrivalTime = Between(after, before);
    } else if (!!before) {
      where.arrivalTime = LessThanOrEqual(before);
    } else if (!!after) {
      where.arrivalTime = MoreThanOrEqual(after);
    } else if (!!arrivalTime) {
      where.arrivalTime = arrivalTime;
    }

    this.logger.debug('Where', { where });
    const query = {
      where: { ...where },
      relations: ['exception']
    };
    this.logger.debug('Query', { query });
    return this.arrivalsRepository.find(query);
  }

  async create(arrivalDTO: ArrivalCreateDTO): Promise<ArrivalDTO> {
    const where = {
      driverId: arrivalDTO.driverId,
      vehicleId: arrivalDTO.vehicleId,
      state: States.PENDING.toString()
    };
    const Arrivals = await this.arrivalsRepository.find({ where });
    if (Arrivals?.length) {
      throw new RpcException({
        message:
          'Ya se ha anunciado este conductor y vehiculo. Por favor espere a que esta sea resuelto.'
      });
    }

    try {
      const ArrivalEntity: ArrivalEntity = {
        ...arrivalDTO,
        arrivalTime: new Date(),
      };
      if (!!arrivalDTO.exception) {
        this.logger.debug('Creating Exception');
        const exception = await this.exceptionsRepository.save(
          arrivalDTO.exception
        );
        ArrivalEntity.exception = exception;
      }
      this.logger.debug('Arrival Entity ', ArrivalEntity);
      return await this.arrivalsRepository.save(ArrivalEntity);
    } catch (error) {
      this.logger.error('Error creating Arrival', error);
      throw new RpcException({
        message: 'Ha ocurrido un error al registrar el anuncio.'
      });
    }
  }

  async update(id: number, resultDTO: ArrivalResultDTO): Promise<ArrivalDTO> {
    const arrival: ArrivalEntity = await this.arrivalsRepository.findOne(id, {
      relations: ['exception']
    });
    // Si no llego el state, es decir que tiene expeditorId y result
    this.logger.debug('Arrival before update', { arrival });
    if (!resultDTO.state && !!arrival.exception && !!arrival.exception.result) {
      throw new RpcException({
        message:
          'El anuncio no puede ser procesado porque posee una excepcion pendiente de evaluacion.'
      });
    }
    if (!!arrival.exception) {
      this.logger.debug('Updating Exception');
      arrival.exception.state = States.HANDLED;
      await this.exceptionsRepository.save(arrival.exception);
      this.logger.debug('Exception updated', { exception: arrival.exception });
    }
    this.arrivalsRepository.merge(arrival, resultDTO);
    this.logger.debug('Arrival updated', { arrival });
    return this.arrivalsRepository.save(arrival);
  }
}
