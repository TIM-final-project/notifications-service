import { States } from '../enum/States.enum';
import { DocumentTypeDTO } from './document-type.dto';

export class ExceptionDTO {
  id?: number;
  driverId: number;
  vehicleId: number;
  securityId: number;
  state?: States;
  documentTypeIds: DocumentTypeDTO[];
}
