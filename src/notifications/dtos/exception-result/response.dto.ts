import { Result } from 'src/notifications/enum/Result.enum';
import { States } from 'src/notifications/enum/States.enum';
import { ExceptionDTO } from '../exception/exception.dto';

export default class ExceptionResultDTO {
  id?: number;
  managerId: number;
  exception: ExceptionDTO;
  comment: string;
  result: Result;
  state?: States;
}
