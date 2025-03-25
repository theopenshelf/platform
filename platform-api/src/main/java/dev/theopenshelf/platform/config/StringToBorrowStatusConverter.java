package dev.theopenshelf.platform.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import dev.theopenshelf.platform.model.BorrowStatus;

@Component
public class StringToBorrowStatusConverter implements Converter<String, BorrowStatus> {
    @Override
    public BorrowStatus convert(String source) {
        try {
            return BorrowStatus.valueOf(source.toUpperCase().replace('-', '_'));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid borrow status: " + source);
        }
    }
}