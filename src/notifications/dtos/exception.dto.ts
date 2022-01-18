import { States } from '../enum/States.enum';

export class ExceptionDTO {
  id?: number;
  driverId: number;
  vehicleId: number;
  securityId: number;
  state?: States;
}
