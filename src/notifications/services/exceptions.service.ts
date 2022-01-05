import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionCreateDTO } from '../dtos/exception-create.dto';
import { ExceptionDTO } from '../dtos/exception.dto';
import { ExceptionEntity } from '../entities/exception.entity';
import { States } from '../enum/States.enum';

@Injectable()
export class ExceptionsService {
  private readonly logger = new Logger(ExceptionsService.name);

  constructor(
    @InjectRepository(ExceptionEntity)
    private exceptionsRepository: Repository<ExceptionEntity>
  ) {}

  async findAll(): Promise<ExceptionDTO[]> {
    return this.exceptionsRepository.find();
  }

  async create(exceptionDTO: ExceptionCreateDTO): Promise<ExceptionDTO> {
    return this.exceptionsRepository.create(exceptionDTO);
  }

  async update(id: number): Promise<ExceptionDTO> {
    const exception: ExceptionEntity = await this.exceptionsRepository.findOne(
      id
    );
    exception.state = States.HANDLED;
    return this.exceptionsRepository.save(exception);
  }
}
