package dev.theopenshelf.platform.model;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiError {
    private String message;
    private String traceId;
    private LocalDateTime timestamp;
    private String path;
    private int status;
}