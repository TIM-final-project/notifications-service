import { Result } from 'src/notifications/enum/Result.enum';
import { States } from 'src/notifications/enum/States.enum';

export class ArrivalResultDTO {
  expeditorId?: number;
  result?: Result;
  state?: States;
  palletsSalida?: number;
  destiny?: string;
  hasSupply?: boolean;
}
