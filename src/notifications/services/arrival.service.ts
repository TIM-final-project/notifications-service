import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArrivalCreateDTO } from '../dtos/arrival/arrival-create.dto';
import { ArrivalDTO } from '../dtos/arrival/arrival.dto';
import { ArrivalEntity } from '../entities/arrival.entity';
import { States } from '../enum/States.enum';
import { ArrivalQPs } from '../qps/arrival.qps';

@Injectable()
export class ArrivalsService {
  private readonly logger = new Logger(ArrivalsService.name);

  constructor(
    @InjectRepository(ArrivalEntity)
    private arrivalsRepository: Repository<ArrivalEntity>
  ) {}

  async findAll(arrivalQPs: ArrivalQPs): Promise<ArrivalDTO[]> {
    this.logger.debug('Getting Arrival', { arrivalQPs });
    const query = {
      where: { ...arrivalQPs }
    };
    this.logger.debug('Query', { query });
    return this.arrivalsRepository.find(query);
  }

  async create(arrivalDTO: ArrivalCreateDTO): Promise<ArrivalDTO> {
    const where = {
      driverId: arrivalDTO.driverId,
      vehicleId: arrivalDTO.vehicleId,
      state: arrivalDTO.state
    };
    const Arrivals = await this.arrivalsRepository.find({ where });
    if (Arrivals?.length) {
      throw new RpcException({
        message:
          'Ya se ha anunciado este conductor y vehiculo. Por favor espere a que esta sea resuelto.'
      });
    }

    try {
      const ArrivalEntity: ArrivalEntity = arrivalDTO;
      this.logger.debug('Arrival Entity ', ArrivalEntity);
      return this.arrivalsRepository.save(ArrivalEntity);
    } catch (error) {
      this.logger.error('Error creating Arrival', error);
      throw new RpcException({
        message: 'Ha ocurrido un error al registrar el anuncio.'
      });
    }
  }

  async update(id: number, state: States): Promise<ArrivalDTO> {
    const Arrival: ArrivalEntity = await this.arrivalsRepository.findOne(id);
    Arrival.state = state;
    return this.arrivalsRepository.save(Arrival);
  }
}
