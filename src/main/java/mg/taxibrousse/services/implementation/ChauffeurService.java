package mg.taxibrousse.services.implementation;

import lombok.AllArgsConstructor;
import mg.taxibrousse.entities.ChauffeurEntity;
import mg.taxibrousse.entities.ContratEntity;
import mg.taxibrousse.entities.enums.ContratStatusEnum;
import mg.taxibrousse.entities.enums.ContratTypeEnum;
import mg.taxibrousse.models.Chauffeur;
import mg.taxibrousse.repositories.*;
import mg.taxibrousse.services.IChauffeurService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ChauffeurService implements IChauffeurService {

    private final IChauffeurRepository chauffeurRepository;
    private final IUserOperatorRepository userRepository;
    private final ICloudinaryRepository cloudinaryRepository;
    private final IContratRepository contratRepository;
    private final IKoperativeRepository koperativeRepository;

    @Override
    @Transactional
    @CacheEvict(value = "chauffeurs", allEntries = true)
    public Chauffeur save(Chauffeur chauffeur) {
        var entity = chauffeur.toEntity();
        var koperative = koperativeRepository
            .findById(chauffeur.getKoperativeId())
            .orElseThrow(() -> new RuntimeException("Koperative not found"));

        entity.setKoperative(koperative);
        entity.getUser().setKoperative(koperative);
        entity.setUser(userRepository.save(entity.getUser()));

        if (entity.getPhoto() != null) entity.setPhoto(cloudinaryRepository.save(entity.getPhoto()));

        ChauffeurEntity saved = chauffeurRepository.save(entity);
        if (chauffeur.getId() <= 0 && chauffeur.getKoperativeId() != null && chauffeur.getKoperativeId() > 0) {
            ContratEntity contratEntity = new ContratEntity();
            contratEntity.setTitle(String.format("%s (Koperative Contract)", saved.getFullName()));
            contratEntity.setType(ContratTypeEnum.EMPLOYMENT);
            contratEntity.setChauffeur(saved);
            contratEntity.setKoperative(koperative);
            contratEntity.setStartDate(LocalDate.now());
            contratEntity.setEndDate(LocalDate.now().plusYears(2));
            contratEntity.setStatus(ContratStatusEnum.ACTIVE);
            contratEntity.setTerms(
                """
                (OHATRA) TERMES D’EMPLOI HO AN’NY CHAUFFEUR KOPERATIVE
                    1. Fotoana iasana: 8 ora isan’andro, 5 andro isan-kerinandro.
                    2. Karama: Araka ny fifanarahana sy ny fitsipiky ny koperative.
                    3. Fialan-tsasatra: 2 herinandro isan-taona.
                    4. Asa: Mitondra sy mikarakara ny fiara amin’ny fahamatorana sy fahitsiana.
                    5. Fanafoanana: Afaka manafoana fifanarahana amin’ny fanomezam-baovao mialoha 1 volana.
                    6. Fitondran-tena: Tokony hanaja ny fitsipika sy ny mpikambana rehetra ao amin’ny koperative.
                    7. Fisorohana loza: Tsy maintsy manaraka ny lalàna sy ny fepetra momba ny fifamoivoizana.
                """
            );
            contratRepository.save(contratEntity);
        }

        return Chauffeur.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "chauffeurs", key = "#id", unless = "#result == null")
    public Chauffeur findById(Long id) {
        return Chauffeur.fromEntity(chauffeurRepository.findById(id).orElse(null));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "chauffeurs", key = "'all'")
    public List<Chauffeur> findAll() {
        return chauffeurRepository.findAll().stream().map(Chauffeur::fromEntity).toList();
    }

    @Override
    @CacheEvict(value = "chauffeurs", allEntries = true)
    public void deleteById(Long id) {
        chauffeurRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "chauffeurs", key = "'available-' + #isAvailable")
    public List<Chauffeur> findByIsAvailable(Boolean isAvailable) {
        return chauffeurRepository.findByIsAvailable(isAvailable).stream().map(Chauffeur::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "chauffeurs", key = "'koperative-' + #koperativeId")
    public List<Chauffeur> findByKoperativeId(Long koperativeId) {
        return chauffeurRepository.findByKoperativeId(koperativeId).stream().map(Chauffeur::fromEntity).toList();
    }
}
