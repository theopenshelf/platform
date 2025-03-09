package dev.theopenshelf.platform.config;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import dev.theopenshelf.platform.model.ApiError;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<ApiError>> handleException(Exception ex) {
        return Mono.deferContextual(ctx -> {
            String traceId = ctx.getOrDefault("traceId", "no-trace-id");
            log.error("Error occurred: {}, TraceID: {}", ex.getMessage(), traceId, ex);

            ApiError error = ApiError.builder()
                    .message(ex.getMessage())
                    .traceId(traceId)
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .build();

            return Mono.just(new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR));
        });
    }

    @ExceptionHandler(BadCredentialsException.class)
    public Mono<ResponseEntity<ApiError>> handleBadCredentials(BadCredentialsException ex) {
        return Mono.deferContextual(ctx -> {
            String traceId = ctx.getOrDefault("traceId", "no-trace-id");
            log.error("Authentication error: {}, TraceID: {}", ex.getMessage(), traceId, ex);

            ApiError error = ApiError.builder()
                    .message(ex.getMessage())
                    .traceId(traceId)
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build();

            return Mono.just(new ResponseEntity<>(error, HttpStatus.BAD_REQUEST));
        });
    }
}