package mg.taxibrousse.services;

import mg.taxibrousse.models.Classe;

import java.util.List;

public interface IClasseService {
    List<Classe> findAll();
    List<Classe> findByKoperativeId(Long koperativeId);
    Classe create(Classe classe);
    Classe update(Long id, Classe classe);
    void delete(Long id);
}
