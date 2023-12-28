import { Result } from 'src/notifications/enum/Result.enum';
import { States } from 'src/notifications/enum/States.enum';
import { ExceptionDTO } from '../exception/exception.dto';

export class ArrivalDTO {
  id?: number;
  driverId: number;
  vehicleId: number;
  userUUID: string;
  expeditorId?: number;
  driver?: string;
  vehicle?: string;
  contractor?: string;
  state?: States;
  result?: Result;
  exception?: ExceptionDTO;
  arrivalTime: Date;
  palletsEntrada?: number;
  palletsSalida?: number;
  destiny?: string;
  hasSupply?: boolean;
  plant: number;
}
