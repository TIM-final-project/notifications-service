import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionCreateDTO } from '../dtos/exception-create.dto';
import { ExceptionDTO } from '../dtos/exception.dto';
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
      where: { ...exceptionQPs }
    };
    this.logger.debug('Query', { query });
    return this.exceptionsRepository.find(query);
  }

  async create(exceptionDTO: ExceptionCreateDTO): Promise<ExceptionDTO> {
    try {
      const exceptionEntity: ExceptionEntity = exceptionDTO;
      this.logger.debug('Exception Entity ', exceptionEntity);
      return this.exceptionsRepository.save(exceptionEntity);
    } catch (error) {
      this.logger.error('Error creating Exception', error);
      throw new RpcException({
        message: 'Ha ocurrido un error al pedir la excepcion.'
      });
    }
  }

  async update(id: number): Promise<ExceptionDTO> {
    const exception: ExceptionEntity = await this.exceptionsRepository.findOne(
      id
    );
    exception.state = States.HANDLED;
    return this.exceptionsRepository.save(exception);
  }
}
