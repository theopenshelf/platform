package dev.theopenshelf.platform.config;

import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TraceIdFilter implements WebFilter {
    private static final String TRACE_ID_HEADER = "X-Trace-ID";
    private static final String TRACE_ID_MDC_KEY = "traceId";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String traceId = UUID.randomUUID().toString();
        exchange.getResponse().getHeaders().add(TRACE_ID_HEADER, traceId);
        MDC.put(TRACE_ID_MDC_KEY, traceId);

        return chain.filter(exchange)
                .doFinally(signalType -> MDC.remove(TRACE_ID_MDC_KEY));
    }
}