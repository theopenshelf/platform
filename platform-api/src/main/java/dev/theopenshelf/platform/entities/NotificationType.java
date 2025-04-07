package dev.theopenshelf.platform.entities;

import dev.theopenshelf.platform.services.MailService;

public enum NotificationType {
    ITEM_AVAILABLE("item-available"),
    ITEM_DUE("item-due"),
    ITEM_BORROW_RESERVATION_DATE_START("item-borrow-reservation-date-start"),
    ITEM_RESERVED_NO_LONGER_AVAILABLE("item-reserved-no-longer-available"),
    ITEM_NEW_RESERVATION_TO_CONFIRM("reservation-to-confirm"),
    ITEM_NEW_PICKUP_TO_CONFIRM("pickup-to-confirm"),
    ITEM_NEW_RETURN_TO_CONFIRM("return-to-confirm"),
    ITEM_RESERVATION_APPROVED("reservation-approved"),
    ITEM_PICK_UP_APPROVED("pick-up-approved"),
    ITEM_RETURN_APPROVED("return-approved");

    private String emailTemplate;

    NotificationType(String emailTemplate) {
        this.emailTemplate = emailTemplate;
    }

    public String getEmailTemplate() {
        return "notification-" + emailTemplate;
    }
}