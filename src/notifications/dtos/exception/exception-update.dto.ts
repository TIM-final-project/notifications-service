import { Result } from 'src/notifications/enum/Result.enum';

export class ExceptionUpdateDTO {
  comment: string;
  managerId: number;
  result: Result;
}
