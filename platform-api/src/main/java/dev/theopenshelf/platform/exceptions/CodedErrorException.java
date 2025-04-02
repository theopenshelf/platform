package dev.theopenshelf.platform.exceptions;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;

@Getter
public class CodedErrorException extends RuntimeException {
    private final CodedError error;
    private final Map<String, Object> variables;
    private final String traceId;

    public CodedErrorException(CodedError error) {
        this(error, new HashMap<>());
    }

    public CodedErrorException(CodedError error, Map<String, Object> variables) {
        super(error.getDefaultMessage());
        this.error = error;
        this.variables = variables;
        this.traceId = generateTraceId();
    }

    public CodedErrorException(CodedError error, String key, Object value) {
        this(error, Map.of(key, value));
    }

    public CodedErrorException(CodedError error, Throwable cause) {
        this(error, new HashMap<>(), cause);
    }

    public CodedErrorException(CodedError error, Map<String, Object> variables, Throwable cause) {
        super(error.getDefaultMessage(), cause);
        this.error = error;
        this.variables = variables;
        this.traceId = generateTraceId();
    }

    private String generateTraceId() {
        return java.util.UUID.randomUUID().toString();
    }
}