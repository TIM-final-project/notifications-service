import { States } from '../enum/States.enum';

export class ArrivalQPs {
  driverId?: number;
  vehicleId?: number;
  securityId?: number;
  state?: States;
  arrivalTime?: Date;
  before?: Date;
  after?: Date;
}
