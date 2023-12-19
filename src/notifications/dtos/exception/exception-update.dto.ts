import { Result } from 'src/notifications/enum/Result.enum';

export class ExceptionUpdateDTO {
  comment: string;
  managerUuid: string;
  result: Result;
}
