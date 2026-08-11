package mg.taxibrousse.services;

import mg.taxibrousse.models.Contrat;

import java.util.List;

public interface IContratService {
    List<Contrat> getAllContrats();

    Contrat getContratById(Long id);

    Contrat createContrat(Contrat contrat);

    Contrat updateContrat(Long id, Contrat contrat);

    boolean deleteContrat(Long id);
}
