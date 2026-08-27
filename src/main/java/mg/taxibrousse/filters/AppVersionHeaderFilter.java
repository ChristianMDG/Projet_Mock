package mg.taxibrousse.filters;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.services.AppVersionService;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Adds X-App-Version header to all responses for frontend cache invalidation.
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class AppVersionHeaderFilter extends OncePerRequestFilter {

    private static final String VERSION_HEADER = "X-App-Version";

    private final AppVersionService appVersionService;

    @PostConstruct
    public void init() {
        appVersionService.initVersionIfAbsent();
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String version = appVersionService.getVersion();
        if (version != null) {
            response.setHeader(VERSION_HEADER, version);
        }
        filterChain.doFilter(request, response);
    }
}
