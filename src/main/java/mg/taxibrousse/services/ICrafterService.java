package mg.taxibrousse.services;

import mg.taxibrousse.models.Crafter;

import java.util.List;

public interface ICrafterService {

    Crafter save(Crafter crafter);

    Crafter findById(Long id);

    List<Crafter> findAll();

    void deleteById(Long id);

    List<Crafter> findByKoperativeId(Long koperativeId);

    List<Crafter> findByIsActive(Boolean isActive);

    Object getSeatConfigById(Long id);
}
