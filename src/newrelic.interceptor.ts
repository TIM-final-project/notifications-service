import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const newrelic = require('newrelic');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');
  
@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return newrelic.startWebTransaction(context.getHandler().name, function () {
            const transaction = newrelic.getTransaction();
            return next.handle().pipe(
            tap(() => {
                return transaction.end();
            }),
            );
        });
    }
}