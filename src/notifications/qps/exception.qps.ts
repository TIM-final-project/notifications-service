import { FindOperator } from 'typeorm';
import { Result } from '../enum/Result.enum';
import { States } from '../enum/States.enum';

export class ExceptionQPs {
  driverId?: number;
  vehicleId?: number;
  securityId?: number;
  state?: States;
  result?: Result | 'null' | FindOperator<any>;
}
