package mg.taxibrousse.services;

import mg.taxibrousse.entities.FokotanyEntity;

import java.util.List;

public interface IFokotanyService {
    void saveAll(List<FokotanyEntity> fokotanies);
}
