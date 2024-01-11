import { States } from 'src/notifications/enum/States.enum';
import { FindOperator } from 'typeorm';

export class ArrivalWhere {
  driverId?: number;
  vehicleId?: number;
  securityId?: number;
  state?: States;
  arrivalTime?: Date | FindOperator<any>;
  plant?: number;
}
