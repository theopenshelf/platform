package dev.theopenshelf.platform.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CodedError {
    // Authentication errors (1000-1999)
    USER_NOT_FOUND("AUTH001", "User not found", "auth/user-not-found"),
    INVALID_CREDENTIALS("AUTH002", "Invalid username or password", "auth/invalid-credentials"),
    EMAIL_ALREADY_VERIFIED("AUTH003", "Email is already verified", "auth/email-already-verified"),
    INVALID_VERIFICATION_TOKEN("AUTH004", "Invalid or expired verification token", "auth/invalid-verification-token"),

    // Authorization errors (2000-2999)
    INSUFFICIENT_PERMISSIONS("AUTH005", "You don't have sufficient permissions to perform this action",
            "auth/insufficient-permissions"),

    // Resource errors (3000-3999)
    ITEM_NOT_FOUND("RES001", "Item not found", "resources/item-not-found"),
    ITEM_NOT_AVAILABLE("RES002", "Item is not available", "resources/item-not-available"),
    ITEM_ALREADY_RESERVED("RES003", "Item is already reserved", "resources/item-already-reserved"),

    // Validation errors (4000-4999)
    INVALID_INPUT("VAL001", "Invalid input provided", "validation/invalid-input"),
    MISSING_REQUIRED_FIELD("VAL002", "Required field is missing", "validation/missing-field"),

    // System errors (5000-5999)
    INTERNAL_ERROR("SYS001", "An internal error occurred", "system/internal-error"),
    EXTERNAL_SERVICE_ERROR("SYS002", "External service error", "system/external-service-error");

    private final String code;
    private final String defaultMessage;
    private final String documentationPath;

    public String getDocumentationUrl() {
        return "https://docs.theopenshelf.dev/errors/" + documentationPath;
    }
}