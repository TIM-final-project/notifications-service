import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ExceptionCreateDTO } from '../dtos/exception/exception-create.dto';
import { ExceptionUpdateDTO } from '../dtos/exception/exception-update.dto';
import { ExceptionDTO } from '../dtos/exception/exception.dto';
import { ExceptionEntity } from '../entities/exception.entity';
import { States } from '../enum/States.enum';
import { ExceptionQPs } from '../qps/exception.qps';

@Injectable()
export class ExceptionsService {
  private readonly logger = new Logger(ExceptionsService.name);

  constructor(
    @InjectRepository(ExceptionEntity)
    private exceptionsRepository: Repository<ExceptionEntity>
  ) {}

  async findAll(exceptionQPs: ExceptionQPs): Promise<ExceptionDTO[]> {
    this.logger.debug('Getting Exception', { exceptionQPs });

    const query = {
      where: { ...exceptionQPs },
      relations: ['arrival']
    };

    if (exceptionQPs.result === 'null') {
      delete exceptionQPs.result;
      query.where.result = IsNull();
    }
    this.logger.debug('Query', { query });
    return this.exceptionsRepository.find(query);
  }

  // async create(exceptionDTO: ExceptionCreateDTO): Promise<ExceptionDTO> {
  //   const where = {
  //     driverId: exceptionDTO.driverId,
  //     vehicleId: exceptionDTO.vehicleId,
  //     state: States.PENDING.toString()
  //   };
  //   const exceptions = await this.exceptionsRepository.find({ where });
  //   if (exceptions?.length) {
  //     throw new RpcException({
  //       message:
  //         'Ya se solicito una excepcion para este conductor y vehiculo. Por favor espere a que esta sea resuelta.'
  //     });
  //   }

  //   try {
  //     const exceptionEntity: ExceptionEntity = exceptionDTO;
  //     this.logger.debug('Exception Entity ', exceptionEntity);
  //     return this.exceptionsRepository.save(exceptionEntity);
  //   } catch (error) {
  //     this.logger.error('Error creating Exception', error);
  //     throw new RpcException({
  //       message: 'Ha ocurrido un error al pedir la excepcion.'
  //     });
  //   }
  // }

  async update(
    id: number,
    updateExceptionDTO: ExceptionUpdateDTO
  ): Promise<ExceptionDTO> {
    const exception: ExceptionEntity = await this.exceptionsRepository.findOne(
      id,
      {relations: ['arrival']}
    );
    this.logger.debug('Exception', { exception });
    this.exceptionsRepository.merge(exception, updateExceptionDTO);
    // exception.state = States.HANDLED;
    return this.exceptionsRepository.save(exception);
  }
}
