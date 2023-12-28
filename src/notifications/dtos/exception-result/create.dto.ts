import { Result } from 'src/notifications/enum/Result.enum';

export class ExceptionResultData {
  vehicle: string;
  driver: string;
  contractor: string;
  managerId: number;
  exceptionId: number;
  comment: string;
  result: Result;
  plant: number;
}
