package mg.taxibrousse.services.implementation;

import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.models.Koperative;
import mg.taxibrousse.repositories.IKoperativeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class KoperativeServiceTest {

    @Mock
    private IKoperativeRepository koperativeRepository;

    @InjectMocks
    private KoperativeService koperativeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldFindKoperativeBySlugifiedName() {
        KoperativeEntity entity = new KoperativeEntity();
        entity.setId(42L);
        entity.setName("Mada Express");
        when(koperativeRepository.findBySlug("mada-express")).thenReturn(Optional.of(entity));

        Optional<Koperative> result = koperativeService.findBySlug("mada-express");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(42L);
    }
}
