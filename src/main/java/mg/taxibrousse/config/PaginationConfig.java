package mg.taxibrousse.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;

/**
 * Pagination configuration optimized for slow 4G networks.
 * Reduces default page sizes to minimize payload sizes and improve response times.
 */
@Configuration
public class PaginationConfig {

    /**
     * Customize default pagination parameters.
     * Smaller page sizes for better performance on slow connections.
     */
    @Bean
    public PageableHandlerMethodArgumentResolverCustomizer customizer() {
        return pageableResolver -> {
            // Default page size: 15 items (reduced from Spring's default of 20)
            pageableResolver.setFallbackPageable(org.springframework.data.domain.PageRequest.of(0, 15));

            // Maximum allowed page size: 50 items
            // Prevents excessive data transfer on slow networks
            pageableResolver.setMaxPageSize(50);
        };
    }
}
