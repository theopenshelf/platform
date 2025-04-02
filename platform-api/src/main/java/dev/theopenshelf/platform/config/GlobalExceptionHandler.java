package dev.theopenshelf.platform.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;

import dev.theopenshelf.platform.exceptions.CodedException;
import dev.theopenshelf.platform.model.CodedError;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(CodedException.class)
    public Mono<ResponseEntity<CodedError>> handleCodedException(CodedException ex) {
        return Mono.deferContextual(ctx -> {
            String traceId = ctx.getOrDefault("traceId", generateTraceId());
            logError(traceId, ex);

            CodedError error = new CodedError()
                    .code(ex.getCode())
                    .message(ex.getMessage())
                    .traceId(traceId)
                    .documentationUrl(ex.getDocumentationUrl())
                    .variables(ex.getVariables());

            return Mono.just(new ResponseEntity<>(error, HttpStatus.BAD_REQUEST));
        });
    }

    @ExceptionHandler(BadCredentialsException.class)
    public Mono<ResponseEntity<CodedError>> handleBadCredentials(BadCredentialsException ex) {
        return Mono.deferContextual(ctx -> {
            String traceId = ctx.getOrDefault("traceId", generateTraceId());
            logError(traceId, ex);

            CodedError error = new CodedError()
                    .code("AUTH002")
                    .message("Invalid credentials provided")
                    .traceId(traceId);

            return Mono.just(new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED));
        });
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Mono<ResponseEntity<CodedError>> handleAccessDeniedException(AccessDeniedException ex) {
        return Mono.deferContextual(ctx -> {
            String traceId = ctx.getOrDefault("traceId", generateTraceId());
            logError(traceId, ex);

            CodedError error = new CodedError()
                    .code("AUTH005")
                    .message("You don't have sufficient permissions to perform this action")
                    .traceId(traceId);

            return Mono.just(new ResponseEntity<>(error, HttpStatus.FORBIDDEN));
        });
    }

    @ExceptionHandler(WebExchangeBindException.class)
    public Mono<ResponseEntity<CodedError>> handleValidationException(WebExchangeBindException ex) {
        return Mono.deferContextual(ctx -> {
            String traceId = ctx.getOrDefault("traceId", generateTraceId());
            logError(traceId, ex);

            Map<String, Object> variables = new HashMap<>();
            variables.put("fields", ex.getBindingResult().getFieldErrors().stream()
                    .map(error -> Map.of(
                            "field", error.getField(),
                            "message", error.getDefaultMessage()
                    ))
                    .toList());

            CodedError error = new CodedError()
                    .code("VAL001")
                    .message("Validation failed")
                    .traceId(traceId)
                    .variables(variables);

            return Mono.just(new ResponseEntity<>(error, HttpStatus.UNPROCESSABLE_ENTITY));
        });
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<CodedError>> handleException(Exception ex) {
        return Mono.deferContextual(ctx -> {
            String traceId = ctx.getOrDefault("traceId", generateTraceId());
            logError(traceId, ex);

            CodedError error = new CodedError()
                    .code("SYS001")
                    .message("An unexpected error occurred")
                    .traceId(traceId);

            return Mono.just(new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR));
        });
    }

    private String generateTraceId() {
        return UUID.randomUUID().toString();
    }

    private void logError(String traceId, Exception ex) {
        log.error("Error occurred - TraceId: {} - Message: {}", traceId, ex.getMessage(), ex);
    }
}