package mg.taxibrousse.services;

import mg.taxibrousse.models.Koperative;
import mg.taxibrousse.models.Ville;
import mg.taxibrousse.params.KoperativeFilter;

import java.util.List;
import java.util.Optional;

public interface IKoperativeService {

    void saveAll(List<Koperative> koperatives);

    Koperative save(Koperative koperative);

    List<Koperative> findAll();

    List<Koperative> findKoperatives(KoperativeFilter filter);

    Long countKoperatives();

    Koperative findById(Long id);

    Optional<Koperative> findBySlug(String slug);

    List<Ville> getVilles(Long koperativeId);

    Koperative setVilles(Long koperativeId, List<Ville> villes);

    void deleteById(Long id);

    List<Koperative> findFavoriteKoperatives(Long voyageurId);
}
