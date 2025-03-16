import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TuiAlertService } from '@taiga-ui/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const alertService = inject(TuiAlertService);
    const translate = inject(TranslateService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Only show alert for 5xx errors
            if (error.status >= 500) {
                const traceId = error.headers.get('X-Trace-ID');
                const errorMessage = error.error?.message || translate.instant('errors.unexpected');

                alertService.open(
                    `${errorMessage}\n\n${translate.instant('errors.supportReference', { traceId })}`,
                    {
                        label: translate.instant('errors.title'),
                        appearance: 'error',
                        autoClose: 0,
                    }
                ).subscribe();
            }

            return throwError(() => error);
        })
    );
}; 