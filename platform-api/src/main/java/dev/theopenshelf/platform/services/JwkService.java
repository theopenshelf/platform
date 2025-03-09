package dev.theopenshelf.platform.services;

import org.springframework.stereotype.Service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.gen.ECKeyGenerator;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class JwkService {
    private final ECKey ecKey;

    public JwkService() throws JOSEException {
        log.info("Initializing JWK Service - generating EC key pair");
        try {
            this.ecKey = new ECKeyGenerator(com.nimbusds.jose.jwk.Curve.P_256)
                    .keyID("oshelf")
                    .algorithm(JWSAlgorithm.ES256)
                    .generate();
            log.info("EC key pair generated successfully with key ID: {}", ecKey.getKeyID());
        } catch (JOSEException e) {
            log.error("Failed to generate EC key pair", e);
            throw e;
        }
    }

    public ECKey getSigningKey() {
        return ecKey;
    }
}
