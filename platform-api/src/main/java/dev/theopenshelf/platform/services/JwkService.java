package dev.theopenshelf.platform.services;

import org.springframework.stereotype.Service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.gen.ECKeyGenerator;

@Service
public class JwkService {
    private final ECKey ecKey;

    public JwkService() throws JOSEException {
        // Generate EC key pair with P-256 curve
        this.ecKey = new ECKeyGenerator(com.nimbusds.jose.jwk.Curve.P_256)
                .keyID("oshelf") // Give your key a unique ID
                .algorithm(JWSAlgorithm.ES256) // Specify the algorithm
                .generate();
    }

    public ECKey getSigningKey() {
        return ecKey;
    }
}
