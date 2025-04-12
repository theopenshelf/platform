import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TuiAlertService } from '@taiga-ui/core';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CodedError } from '../api-client/model/codedError';

interface ErrorTranslation {
    title: string;
    message: string;
    action?: string;
}

// Keep track of the last 401 error shown
let lastUnauthorizedError = 0;
const UNAUTHORIZED_ERROR_DEBOUNCE = 2000; // 2 seconds debounce

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const alertService = inject(TuiAlertService);
    const translate = inject(TranslateService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Only show error and redirect if not already on login page
                if (router.url !== '/login' && router.url !== '/') {
                    const now = Date.now();
                    if (now - lastUnauthorizedError > UNAUTHORIZED_ERROR_DEBOUNCE) {
                        lastUnauthorizedError = now;
                        showError(alertService, translate, {
                            code: 'UNAUTHORIZED',
                            message: translate.instant('errors.unauthorized')
                        } as CodedError);
                    }
                    router.navigate(['/login']);
                    return EMPTY; // Don't propagate the error when redirecting
                }
            } else if (error.error instanceof ErrorEvent) {
                // Client-side error
                showError(alertService, translate, {
                    code: 'CLIENT_ERROR',
                    message: error.error.message
                } as CodedError);
            } else if (isApiError(error.error)) {
                // API error with our custom format
                showError(alertService, translate, error.error);
            } else {
                // Unexpected server error
                showError(alertService, translate, {
                    code: 'UNKNOWN_ERROR',
                    message: translate.instant('errors.unexpected')
                } as CodedError);
            }

            return throwError(() => error);
        })
    );
};

function isApiError(error: any): error is CodedError {
    return error && error.code && error.message;
}

function showError(alertService: TuiAlertService, translate: TranslateService, error: CodedError): void {
    // Try to get a translation for this error code
    const translationKey = `errors.${error.code.toLowerCase()}`;

    translate.get(translationKey, error.variables).subscribe(
        (translation: any) => {
            const errorTranslation: ErrorTranslation = {
                title: translation.title || translate.instant('errors.title'),
                message: translation.message || error.message,
                action: translation.action
            };

            let message = errorTranslation.message;

            // Add documentation link if available
            if (error.documentationUrl) {
                message += `<a href="${error.documentationUrl}" target="_blank">${translate.instant('errors.learnMore')}</a><br><br>`;
            }

            // Add trace ID if available
            if (error.traceId) {
                message += `\n\n${translate.instant('errors.supportReference', { traceId: error.traceId })}`;
            }

            // Add action if available
            if (errorTranslation.action) {
                message += `\n\n${errorTranslation.action}`;
            }

            alertService.open(message, {
                label: errorTranslation.title,
                appearance: 'error',
                autoClose: 0,
            }).subscribe();
        }
    );
} 