package mg.taxibrousse.services;

import mg.taxibrousse.models.Gare;
import mg.taxibrousse.params.GareFilter;

import java.util.List;

public interface IGareService {

    Gare save(Gare gare);

    Gare updateGare(Long id, Gare gare);

    List<Gare> findAll();

    Gare findById(Long id);

    void deleteById(Long id);

    List<Gare> findByVilleId(Long villeId);

    List<Gare> findGares(GareFilter filter);
}
