import { ExceptionCreateDTO } from '../exception/exception-create.dto';

export class ArrivalCreateDTO {
  driverId: number;
  vehicleId: number;
  userUUID: string;
  driver?: string;
  vehicle?: string;
  contractor?: string;
  exception?: ExceptionCreateDTO;
  palletsEntrada?: number;
  hasSupply?: boolean;
  plant: number;
}
