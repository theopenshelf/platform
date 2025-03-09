package dev.theopenshelf.platform.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import dev.theopenshelf.platform.exceptions.MailException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final SpringTemplateEngine templateEngine;

    @Value("${sendgrid.api-key}")
    private String sendgridApiKey;

    @Value("${sendgrid.from.email}")
    private String sendgridFromEmail;

    @Value("${sendgrid.from.name}")
    private String sendgridFromName;

    public void sendMail(String to, String subject, String text) throws MailException {
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
                throw new MailException("Failed to send email: " + response.getBody());
            }
        } catch (IOException ex) {
            log.error("IOException while sending email to: {}", to, ex);
            throw new MailException("Failed to send email", ex);
        }
    }

    public void sendTemplatedEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        log.debug("Preparing templated email. Template: {}, To: {}, Variables: {}", templateName, to, variables);
        Context context = new Context();
        context.setVariables(variables);

        try {
            String htmlContent = templateEngine.process(templateName, context);
            log.debug("Template processed successfully");
            sendMail(to, subject, htmlContent);
        } catch (Exception e) {
            log.error("Failed to process template: {}", templateName, e);
            throw new MailException("Failed to process email template", e);
        }
    }
}
