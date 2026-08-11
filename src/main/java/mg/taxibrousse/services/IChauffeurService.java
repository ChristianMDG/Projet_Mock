package mg.taxibrousse.services;

import mg.taxibrousse.models.Chauffeur;

import java.util.List;

public interface IChauffeurService {
    Chauffeur save(Chauffeur chauffeur);

    Chauffeur findById(Long id);

    List<Chauffeur> findAll();

    void deleteById(Long id);

    List<Chauffeur> findByIsAvailable(Boolean isAvailable);

    List<Chauffeur> findByKoperativeId(Long koperativeId);
}
