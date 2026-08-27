package mg.taxibrousse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.WebContentInterceptor;

import java.time.Duration;

/**
 * Web configuration for HTTP optimizations including cache control headers.
 * Optimized for slow 4G networks.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        WebContentInterceptor interceptor = new WebContentInterceptor();

        // Cache static resources and immutable data for longer periods
        // This reduces network requests on slow connections
        interceptor.addCacheMapping(CacheControl.maxAge(Duration.ofDays(30)).cachePublic().immutable(), "/api/authorities/**", "/api/classes/**", "/api/villes/**");

        // Cache product catalog and categories with moderate duration
        // Allow revalidation to ensure freshness
        interceptor.addCacheMapping(CacheControl.maxAge(Duration.ofMinutes(30)).cachePublic().mustRevalidate(), "/api/products/public/**", "/api/categories/**", "/api/routes/public/**");

        // Short cache for dynamic but frequently accessed data
        interceptor.addCacheMapping(CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic().mustRevalidate(),
                "/api/voyages/available/**",
                "/api/voyages/weekly/**",
                "/api/voyages/monthly/**",
                "/api/gares/**");

        // No cache for user-specific or sensitive data
        interceptor.addCacheMapping(CacheControl.noCache().noStore().mustRevalidate(),
                "/api/cart/**",
                "/api/orders/**",
                "/api/reservations/**",
                "/api/payments/**",
                "/api/auth/**",
                "/api/users/**",
                "/api/dashboard/**");

        registry.addInterceptor(interceptor);
    }
}
