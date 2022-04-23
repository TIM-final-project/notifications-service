import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArrivalCreateDTO } from '../dtos/arrival/arrival-create.dto';
import { ArrivalResultDTO } from '../dtos/arrival/arrival-update.dto';
import { ArrivalDTO } from '../dtos/arrival/arrival.dto';
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

  async findAll(arrivalQPs: ArrivalQPs): Promise<ArrivalDTO[]> {
    this.logger.debug('Getting Arrival', { arrivalQPs });
    const query = {
      where: { ...arrivalQPs },
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
        arrivalTime: new Date()
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
    const Arrival: ArrivalEntity = await this.arrivalsRepository.findOne(id);
    this.logger.debug('Arrival before update', { Arrival });
    this.arrivalsRepository.merge(Arrival, resultDTO);
    this.logger.debug('Arrival updated', { Arrival });
    // Arrival.state = States.HANDLED; Deberia ser actualizado por el endpoint de Ingreso
    return this.arrivalsRepository.save(Arrival);
  }
}
