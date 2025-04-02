package dev.theopenshelf.platform.exceptions;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(Include.NON_NULL)
public class ErrorResponse {
    private String code;
    private String message;
    private String traceId;
    private String documentationUrl;
    private Map<String, Object> variables;
    private String stackTrace;
}