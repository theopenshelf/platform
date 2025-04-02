package dev.theopenshelf.platform.exceptions;

import lombok.Getter;

import java.util.Map;

@Getter
public class CodedException extends RuntimeException {
    private final String code;
    private final Map<String, Object> variables;
    private final String documentationUrl;

    public CodedException(String code, String message) {
        this(code, message, null, null);
    }

    public CodedException(String code, String message, Map<String, Object> variables) {
        this(code, message, variables, null);
    }

    public CodedException(String code, String message, Map<String, Object> variables, String documentationUrl) {
        super(message);
        this.code = code;
        this.variables = variables;
        this.documentationUrl = documentationUrl;
    }

    public CodedException(String code, String message, Map<String, Object> variables, String documentationUrl, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.variables = variables;
        this.documentationUrl = documentationUrl;
    }
} 