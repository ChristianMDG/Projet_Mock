package mg.taxibrousse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.TimeZone;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@EnableAsync
@EnableCaching
@SpringBootApplication(exclude = {JdbcRepositoriesAutoConfiguration.class, RedisRepositoriesAutoConfiguration.class})
@EntityScan(basePackages = {"mg.taxibrousse.entities", "mg.taxibrousse.batch.model"})
@EnableJpaRepositories(basePackages = {"mg.taxibrousse.repositories"})
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class TaxibrousseApplication {

    private static final Logger logger = LoggerFactory.getLogger(TaxibrousseApplication.class);

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Indian/Antananarivo"));
        SpringApplication.run(TaxibrousseApplication.class, args);
    }

    @Bean
    public CommandLineRunner logApiUrl(Environment env) {
        return args -> {
            String port = env.getProperty("server.port", "8080");
            String host = env.getProperty("server.address", "localhost");
            String protocol = env.getProperty("server.ssl.enabled", "false").equals("true") ? "https" : "http";
            logger.info("API is running at: {}://{}:{}", protocol, host, port);
        };
    }
}
