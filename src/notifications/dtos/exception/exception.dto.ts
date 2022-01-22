import { States } from 'src/notifications/enum/States.enum';

export class ExceptionDTO {
  id?: number;
  driverId: number;
  vehicleId: number;
  securityId: number;
  state?: States;
}
