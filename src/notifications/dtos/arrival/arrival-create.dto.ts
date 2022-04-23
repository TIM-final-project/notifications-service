import { ExceptionCreateDTO } from '../exception/exception-create.dto';

export class ArrivalCreateDTO {
  driverId: number;
  vehicleId: number;
  securityId: number;
  driver?: string;
  vehicle?: string;
  contractor?: string;
  exception: ExceptionCreateDTO;
}
