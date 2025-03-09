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

@Service
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
        // Create JWT claims
        JWTClaimsSet claimsSet = claimsBuilder
                .audience("oshelf")
                .issueTime(new Date())
                .build();

        // Create signed JWT
        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader.Builder(JWSAlgorithm.ES256)
                        .keyID(jwkService.getSigningKey().getKeyID())
                        .build(),
                claimsSet);

        // Sign the JWT
        signedJWT.sign(signer);

        // Serialize to string
        return signedJWT.serialize();
    }

    public JWTClaimsSet verifyToken(String token) throws JOSEException, ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        if (!signedJWT.verify(verifier)) {
            throw new JOSEException("Signature verification failed");
        }
        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
        if (claims.getExpirationTime().before(new Date())) {
            throw new JOSEException("Token expired");
        }
        return claims;
    }
}
