package dev.theopenshelf.platform.exceptions;

import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ServerWebExchange;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final MessageSource messageSource;
    private final Environment environment;

    @ExceptionHandler(CodedErrorException.class)
    public ResponseEntity<ErrorResponse> handleCodedError(CodedErrorException ex, ServerWebExchange exchange) {
        log.error("Coded error occurred: {}", ex.getError().getCode(), ex);

        String message = messageSource.getMessage(
                "error." + ex.getError().getCode().toLowerCase(),
                ex.getVariables().values().toArray(),
                ex.getError().getDefaultMessage(),
                exchange.getLocaleContext().getLocale());

        ErrorResponse response = buildErrorResponse(ex, message);
        return new ResponseEntity<>(response, determineHttpStatus(ex.getError()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, ServerWebExchange exchange) {
        CodedErrorException codedEx = new CodedErrorException(CodedError.INVALID_CREDENTIALS);
        return handleCodedError(codedEx, exchange);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, ServerWebExchange exchange) {
        CodedErrorException codedEx = new CodedErrorException(CodedError.INSUFFICIENT_PERMISSIONS);
        return handleCodedError(codedEx, exchange);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericError(Exception ex, ServerWebExchange exchange) {
        log.error("Unexpected error occurred", ex);

        CodedErrorException codedEx = new CodedErrorException(CodedError.INTERNAL_ERROR, ex);
        return handleCodedError(codedEx, exchange);
    }

    private ErrorResponse buildErrorResponse(CodedErrorException ex, String message) {
        ErrorResponse.ErrorResponseBuilder builder = ErrorResponse.builder()
                .code(ex.getError().getCode())
                .message(message)
                .traceId(ex.getTraceId())
                .documentationUrl(ex.getError().getDocumentationUrl())
                .variables(ex.getVariables());

        // Include stack trace only in development
        if (isDevelopment()) {
            builder.stackTrace(getStackTrace(ex));
        }

        return builder.build();
    }

    private boolean isDevelopment() {
        for (String profile : environment.getActiveProfiles()) {
            if (profile.equalsIgnoreCase("dev") || profile.equalsIgnoreCase("development")) {
                return true;
            }
        }
        return false;
    }

    private String getStackTrace(Exception ex) {
        java.io.StringWriter sw = new java.io.StringWriter();
        ex.printStackTrace(new java.io.PrintWriter(sw));
        return sw.toString();
    }

    private HttpStatus determineHttpStatus(CodedError error) {
        return switch (error) {
            case USER_NOT_FOUND, ITEM_NOT_FOUND -> HttpStatus.NOT_FOUND;
            case INVALID_CREDENTIALS -> HttpStatus.UNAUTHORIZED;
            case INSUFFICIENT_PERMISSIONS -> HttpStatus.FORBIDDEN;
            case INVALID_INPUT, MISSING_REQUIRED_FIELD -> HttpStatus.BAD_REQUEST;
            case INTERNAL_ERROR, EXTERNAL_SERVICE_ERROR -> HttpStatus.INTERNAL_SERVER_ERROR;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
}