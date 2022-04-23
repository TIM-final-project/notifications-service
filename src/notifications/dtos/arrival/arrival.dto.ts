import { Result } from 'src/notifications/enum/Result.enum';
import { States } from 'src/notifications/enum/States.enum';
import { ExceptionDTO } from '../exception/exception.dto';

export class ArrivalDTO {
  id?: number;
  driverId: number;
  vehicleId: number;
  securityId: number;
  expeditorId?: number;
  driver?: string;
  vehicle?: string;
  contractor?: string;
  state?: States;
  result?: Result;
  exception: ExceptionDTO;
  arrivalTime: Date;
}
