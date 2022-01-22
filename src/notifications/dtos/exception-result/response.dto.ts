import { Result } from 'src/notifications/enum/Result.enum';
import { States } from 'src/notifications/enum/States.enum';

export default class ExceptionResultDTO {
  id?: number;
  managerId: number;
  exceptionId: number;
  comment: string;
  result: Result;
  state?: States;
}
