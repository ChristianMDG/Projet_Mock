package mg.taxibrousse.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.services.implementation.TokenBlacklistService;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Filter to check JWT tokens against the blacklist. Runs before Spring Security
 * authentication for performance.
 * <p>
 * For 100,000+ users: - Redis lookup is O(1) and fast (< 1ms typically) -
 * Stateless validation maintains horizontal scalability - No session storage
 * needed per request
 */
@Component
@RequiredArgsConstructor
public class JwtTokenBlacklistFilter extends OncePerRequestFilter {

    private final TokenBlacklistService tokenBlacklistService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // List of patterns that should be excluded from JWT blacklist checking
    // These are truly public endpoints that don't require JWT processing
    private static final List<String> excludedPatterns = Arrays.asList(
            "/",
            "/api/users/token",
            "/api/users/account",
            "/api/auth/google/**",
            "/api/payments/mvola/callback", // TODO: configure from callback url of MVola
            "/api/payments/orangemoney/callback", // TODO: configure from callback url of Orange
            "/api/payments/airtelmoney/callback", // TODO: configure from callback url of Airtel
            "/ws/**"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            unauthorized(response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void unauthorized(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("Token has been invalidated");
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String requestPath = request.getRequestURI();
        for (String pattern : excludedPatterns) {
            if (pathMatcher.match(pattern, requestPath)) {
                return true;
            }
        }

        return super.shouldNotFilter(request);
    }
}
