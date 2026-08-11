package mg.taxibrousse.services;

import mg.taxibrousse.models.Ville;

import java.util.List;

public interface IVilleService {
    void saveAll(List<Ville> villes);

    Ville save(Ville ville);

    List<Ville> findAll();

    Ville findById(Long id);

    void deleteById(Long id);

    List<Ville> getTop20Villes();

    List<Ville> findByKeyword(String keyword);
}

