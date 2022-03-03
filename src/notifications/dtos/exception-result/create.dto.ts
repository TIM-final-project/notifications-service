import { Result } from 'src/notifications/enum/Result.enum';

export class ExceptionResultCreateDTO {
  managerId: number;
  exceptionId: number;
  comment: string;
  result: Result;
}
