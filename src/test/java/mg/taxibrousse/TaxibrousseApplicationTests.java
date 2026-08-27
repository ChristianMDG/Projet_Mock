package mg.taxibrousse;

import mg.taxibrousse.config.TestRedisConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {TaxibrousseApplication.class, TestRedisConfig.class})
@ActiveProfiles("test")
class TaxibrousseApplicationTests {

    @Test
    void contextLoads() {
    }

}

