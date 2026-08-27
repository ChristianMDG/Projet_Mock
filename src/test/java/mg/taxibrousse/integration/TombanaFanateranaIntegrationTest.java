package mg.taxibrousse.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import mg.taxibrousse.TaxibrousseApplication;
import mg.taxibrousse.config.TestRedisConfig;
import mg.taxibrousse.entities.TombanaFanateranaEntity;
import mg.taxibrousse.entities.VilleEntity;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import mg.taxibrousse.models.TombanaFanaterana;
import mg.taxibrousse.repositories.ITombanaFanateranaRepository;
import mg.taxibrousse.repositories.IVilleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = {TaxibrousseApplication.class, TestRedisConfig.class})
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
public class TombanaFanateranaIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ITombanaFanateranaRepository repository;

    @Autowired
    private IVilleRepository villeRepository;

    private VilleEntity ville;

    @BeforeEach
    void setUp() {
        ville = new VilleEntity();
        ville.setName("Tombana City");
        ville.setIsActive(true);
        ville = villeRepository.save(ville);
    }

    @Test
    void testCreateGetAndDeleteTombana() throws Exception {
        TombanaFanaterana model = TombanaFanaterana.builder()
                .minWeight(BigDecimal.ZERO)
                .maxWeight(BigDecimal.TEN)
                .frais(BigDecimal.valueOf(2500))
                .deliveryMethod(DeliveryMethodEnum.STANDARD)
                .villeId(ville.getId())
                .build();

        // 1. Create
        String content = mockMvc.perform(post("/api/tombana-fanaterana")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(model)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        TombanaFanaterana created = objectMapper.readValue(content, TombanaFanaterana.class);
        assertThat(created.getId()).isNotNull();
        assertThat(created.getFrais()).isEqualByComparingTo(BigDecimal.valueOf(2500));

        // 2. Get by Id
        mockMvc.perform(get("/api/tombana-fanaterana/" + created.getId()))
                .andExpect(status().isOk());

        // 3. Delete
        mockMvc.perform(delete("/api/tombana-fanaterana/" + created.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void testCalculateDeliveryFee() throws Exception {
        TombanaFanateranaEntity entity = new TombanaFanateranaEntity();
        entity.setMinWeight(BigDecimal.ZERO);
        entity.setMaxWeight(BigDecimal.TEN);
        entity.setFrais(BigDecimal.valueOf(5000));
        entity.setDeliveryMethod(DeliveryMethodEnum.STANDARD);
        entity.setVille(ville);
        repository.save(entity);

        mockMvc.perform(get("/api/tombana-fanaterana/calculate")
                        .param("villeId", ville.getId().toString())
                        .param("method", "STANDARD")
                        .param("weight", "5.0"))
                .andExpect(status().isOk());
    }
}
