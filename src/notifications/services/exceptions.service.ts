import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ExceptionUpdateDTO } from '../dtos/exception/exception-update.dto';
import { ExceptionDTO } from '../dtos/exception/exception.dto';
import { ExceptionEntity } from '../entities/exception.entity';
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

  async update(
    id: number,
    updateExceptionDTO: ExceptionUpdateDTO
  ): Promise<ExceptionDTO> {
    const exception: ExceptionEntity = await this.exceptionsRepository.findOne(
      id,
      { relations: ['arrival'] }
    );
    this.logger.debug('Exception', { exception });
    this.exceptionsRepository.merge(exception, updateExceptionDTO);
    // exception.state = States.HANDLED;
    return this.exceptionsRepository.save(exception);
  }
}
