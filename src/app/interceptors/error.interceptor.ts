import { inject } from '@angular/core';
import { 
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, mergeMap } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const errorHandler = inject(ErrorHandlerService);
  const RETRY_DELAY = 2000;

  return next(req).pipe(
    retryWhen(errors => 
      errors.pipe(
        mergeMap((error: HttpErrorResponse) => {
          if (shouldRetry(error)) {
            if (errorHandler.incrementRetry()) {
              console.log(`Retrying request after ${RETRY_DELAY}ms...`);
              return timer(RETRY_DELAY);
            }
          }
          return throwError(() => error);
        })
      )
    ),
    catchError((error: HttpErrorResponse) => {
      errorHandler.handleError(error, req.url);
      return throwError(() => error);
    })
  );
};

const shouldRetry = (error: HttpErrorResponse): boolean => {
  const retriableStatuses = [0, 503, 504];
  return retriableStatuses.includes(error.status);
};