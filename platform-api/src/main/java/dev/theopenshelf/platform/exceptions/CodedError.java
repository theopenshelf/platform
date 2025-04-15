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

    // Notification errors (2000-2999)
    NOTIFICATION_SETTINGS_NOT_FOUND("NOT001", "Notification settings not found", "notifications/settings-not-found"),

    // Authorization errors (3000-3999)
    INSUFFICIENT_PERMISSIONS("AUTH005", "You don't have sufficient permissions to perform this action",
            "auth/insufficient-permissions"),

    // Resource errors (3000-3999)
    ITEM_NOT_FOUND("RES001", "Item not found", "resources/item-not-found"),
    ITEM_NOT_AVAILABLE("RES002", "Item is not available", "resources/item-not-available"),
    ITEM_ALREADY_RESERVED("RES003", "Item is already reserved", "resources/item-already-reserved"),
    LIBRARY_NOT_FOUND("RES004", "Library not found", "resources/library-not-found"),
    COMMUNITY_NOT_FOUND("RES005", "Community not found", "resources/community-not-found"),
    MEMBER_NOT_FOUND("RES006", "Member not found", "resources/member-not-found"),
    CUSTOM_PAGE_NOT_FOUND("RES007", "Custom page not found", "resources/custom-page-not-found"),
    BORROW_RECORD_NOT_FOUND("RES008", "Borrow record not found", "resources/borrow-record-not-found"),
    HELP_ARTICLE_NOT_FOUND("RES009", "Help article not found", "resources/help-article-not-found"),
    HELP_CATEGORY_NOT_FOUND("RES010", "Help category not found", "resources/help-category-not-found"),
    SETTINGS_NOT_FOUND("RES011", "Settings not found", "resources/settings-not-found"),
    CATEGORY_NOT_FOUND("RES012", "Category not found", "resources/category-not-found"),

    // Validation errors (4000-4999)
    INVALID_INPUT("VAL001", "Invalid input provided", "validation/invalid-input"),
    MISSING_REQUIRED_FIELD("VAL002", "Required field is missing", "validation/missing-field"),
    INVALID_STATUS_TRANSITION("VAL003", "Invalid status transition", "validation/invalid-status-transition"),
    APPROVAL_NOT_REQUIRED("VAL004", "Approval is not required for this operation", "validation/approval-not-required"),
    INVALID_BORROW_STATE("VAL005", "Invalid borrow state for this operation", "validation/invalid-borrow-state"),

    // System errors (5000-5999)
    INTERNAL_ERROR("SYS001", "An internal error occurred", "system/internal-error"),
    EXTERNAL_SERVICE_ERROR("SYS002", "External service error", "system/external-service-error"),
    EMAIL_SENDING_ERROR("SYS003", "Failed to send email", "system/email-sending-error");

    private final String code;
    private final String defaultMessage;
    private final String documentationPath;

    public String getDocumentationUrl() {
        return "https://docs.theopenshelf.dev/errors/" + documentationPath;
    }
}