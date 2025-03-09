package dev.theopenshelf.platform.services;

import java.text.ParseException;
import java.util.Date;

import org.springframework.stereotype.Service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.ECDSASigner;
import com.nimbusds.jose.crypto.ECDSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class JwtService {
    private final JwkService jwkService;
    private final JWSSigner signer;
    private final JWSVerifier verifier;

    public JwtService(JwkService jwkService) throws JOSEException {
        this.jwkService = jwkService;
        this.signer = new ECDSASigner(jwkService.getSigningKey());
        this.verifier = new ECDSAVerifier(jwkService.getSigningKey());
    }

    public String createToken(JWTClaimsSet.Builder claimsBuilder) throws JOSEException {
        log.debug("Creating JWT token with claims: {}", claimsBuilder.build().toJSONObject());

        try {
            JWTClaimsSet claimsSet = claimsBuilder
                    .audience("oshelf")
                    .issueTime(new Date())
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader.Builder(JWSAlgorithm.ES256)
                            .keyID(jwkService.getSigningKey().getKeyID())
                            .build(),
                    claimsSet);

            signedJWT.sign(signer);
            log.info("JWT token created successfully");
            return signedJWT.serialize();
        } catch (JOSEException e) {
            log.error("Failed to create JWT token", e);
            throw e;
        }
    }

    public JWTClaimsSet verifyToken(String token) throws JOSEException, ParseException {
        log.debug("Verifying JWT token");
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            if (!signedJWT.verify(verifier)) {
                log.warn("JWT signature verification failed");
                throw new JOSEException("Signature verification failed");
            }

            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            if (claims.getExpirationTime().before(new Date())) {
                log.warn("JWT token expired. Expiration: {}", claims.getExpirationTime());
                throw new JOSEException("Token expired");
            }

            log.info("JWT token verified successfully");
            return claims;
        } catch (ParseException e) {
            log.error("Failed to parse JWT token", e);
            throw e;
        } catch (JOSEException e) {
            log.error("Failed to verify JWT token", e);
            throw e;
        }
    }
}
