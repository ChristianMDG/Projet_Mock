package mg.taxibrousse.services;

import mg.taxibrousse.models.Gare;
import mg.taxibrousse.models.Guichet;

import java.util.List;

public interface IGuichetService {
    Guichet save(Guichet guichet);

    Guichet findById(Long id);

    void deleteById(Long id);

    List<Guichet> findByKoperativeId(Long koperativeId);

    List<Guichet> findByGareId(Long gareId);

    List<Gare> getGuichetDestinations(Long guichetId);

    Guichet updateGuichetDestinations(Long guichetId, List<Gare> destinations);

    Guichet findByGareAndKoperativeWithOperateurs(Long gareId, Long koperativeId);
}
