package dev.theopenshelf.platform.services;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.nimbusds.jose.util.Pair;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import dev.theopenshelf.platform.entities.NotificationEntity;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.exceptions.CodedException;
import dev.theopenshelf.platform.exceptions.CodedError;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final SpringTemplateEngine templateEngine;
    private final MessageSource messageSource;

    @Value("${sendgrid.api-key}")
    private String sendgridApiKey;

    @Value("${sendgrid.from.email}")
    private String sendgridFromEmail;

    @Value("${sendgrid.from.name}")
    private String sendgridFromName;

    @Value("${oshelf.email.template.logo-url}")
    private String logoUrl;

    @Value("${oshelf.email.template.app-name}")
    private String appName;

    public void sendMail(String to, String subject, String text) {
        log.info("Sending email to: {}, subject: {}", to, subject);

        Email from = new Email(sendgridFromEmail, sendgridFromName);
        Email toMail = new Email(to);
        Content content = new Content("text/html", text);
        Mail mail = new Mail(from, subject, toMail, content);

        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Email sent successfully to: {}, status: {}", to, response.getStatusCode());
            } else {
                log.error("Failed to send email to: {}, status: {}, body: {}",
                        to, response.getStatusCode(), response.getBody());
                throw new CodedException(CodedError.EMAIL_SENDING_ERROR.getCode(),
                        "Failed to send email: " + response.getBody(),
                        Map.of("to", to, "status", response.getStatusCode(), "error", response.getBody()),
                        CodedError.EMAIL_SENDING_ERROR.getDocumentationUrl());
            }
        } catch (IOException ex) {
            log.error("IOException while sending email to: {}", to, ex);
            throw new CodedException(CodedError.EMAIL_SENDING_ERROR.getCode(),
                    "Failed to send email due to IO error",
                    Map.of("to", to, "error", ex.getMessage()),
                    CodedError.EMAIL_SENDING_ERROR.getDocumentationUrl(),
                    ex);
        }
    }

    public void sendTemplatedEmail(UserEntity user, String subject, String templateName,
            List<TemplateVariable> variables, Locale locale) {

        variables.add(
                TemplateVariable.builder()
                        .type(TemplateVariableType.RAW)
                        .ref("logoUrl")
                        .value(logoUrl)
                        .build()
        );
        variables.add(
                TemplateVariable.builder()
                        .type(TemplateVariableType.RAW)
                        .ref("appName")
                        .value(appName)
                        .build()
        );

        Map<String, Object> variablesMap = variables.stream()
                .map(v -> {
                    switch (v.type) {
                        case TRANSLATABLE_TEXT -> {
                            return Pair.of(v.ref,
                                    messageSource.getMessage(v.translateKey, v.args, locale));
                        }
                        default -> {
                            return Pair.of(v.ref, v.value == null ? "": v.value);
                        }
                    }
                })
                .collect(Collectors.toMap(
                        Pair::getLeft,
                        Pair::getRight));



        Context context = new Context(locale);
        context.setVariables(variablesMap);

        try {
            String htmlContent = templateEngine.process(templateName, context);
            log.debug("Template processed successfully");
            String translatedSubject = messageSource.getMessage(subject, null, locale);
            sendMail(user.getEmail(), translatedSubject, htmlContent);
        } catch (Exception e) {
            log.error("Failed to process template: {}", templateName, e);
            throw new CodedException(CodedError.EMAIL_SENDING_ERROR.getCode(),
                    "Failed to process email template",
                    Map.of("to", user.getEmail(), "template", templateName, "error", e.getMessage()),
                    CodedError.EMAIL_SENDING_ERROR.getDocumentationUrl(),
                    e);
        }
    }

    @Data
    @Builder
    public static class TemplateVariable {
        public TemplateVariableType type;
        public String ref;
        public String translateKey;
        public Object value;
        public Object[] args;
    }

    public enum TemplateVariableType {
        TRANSLATABLE_TEXT,
        RAW
    }
}
