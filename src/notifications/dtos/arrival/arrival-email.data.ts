import { Result } from 'src/notifications/enum/Result.enum';

export class ArrivalEmailData {
  driver: string;
  vehicle: string;
  contractor: string;
  result: Result;
}
