import { Result } from 'src/notifications/enum/Result.enum';
import { States } from 'src/notifications/enum/States.enum';
import { ArrivalDTO } from '../arrival/arrival.dto';

export class ExceptionDTO {
  id?: number;
  comment?: string;
  managerUuid?: string;
  state?: States;
  result?: Result;
  arrival?: ArrivalDTO;
}
