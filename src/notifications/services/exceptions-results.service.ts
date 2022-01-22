import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionResultCreateDTO } from '../dtos/exception-result/create.dto';
import ExceptionResultDTO from '../dtos/exception-result/response.dto';
import { ExceptionResultEntity } from '../entities/exception-result.entity';
import { States } from '../enum/States.enum';
import { ResultQPs } from '../qps/result.qps';

@Injectable()
export class ExceptionsResultService {
  private readonly logger = new Logger(ExceptionsResultService.name);

  constructor(
    @InjectRepository(ExceptionResultEntity)
    private exceptionsResultRepository: Repository<ExceptionResultEntity>
  ) {}

  async findAll(exceptionQPs: ResultQPs): Promise<ExceptionResultDTO[]> {
    this.logger.debug('Getting Exception', { exceptionQPs });
    const query = {
      where: { ...exceptionQPs }
    };
    this.logger.debug('Query', { query });
    return this.exceptionsResultRepository.find(query);
  }

  async create(
    exceptionDTO: ExceptionResultCreateDTO
  ): Promise<ExceptionResultDTO> {
    try {
      const exceptionEntity: ExceptionResultEntity = exceptionDTO;
      this.logger.debug('Exception Entity ', exceptionEntity);
      return this.exceptionsResultRepository.save(exceptionEntity);
    } catch (error) {
      this.logger.error('Error creating Exception', error);
      throw new RpcException({
        message: 'Ha ocurrido un error al pedir la excepcion.'
      });
    }
  }

  async update(id: number): Promise<ExceptionResultDTO> {
    const exception: ExceptionResultEntity =
      await this.exceptionsResultRepository.findOne(id);
    exception.state = States.HANDLED;
    return this.exceptionsResultRepository.save(exception);
  }
}
