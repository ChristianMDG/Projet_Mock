package mg.taxibrousse.services;

import mg.taxibrousse.models.Voyageur;

public interface IVoyageurService extends IBaseService {

    Voyageur save(Voyageur voyageur);

    Voyageur findById(Long id);

    Voyageur findByUsername(String username);

    Voyageur findByPhoneOrIdNumber(String phone, String idNumber);

    /**
     * Save or update voyageur with validation and authentication setup
     *
     * @param model Voyageur model
     * @return Success or error message key
     */
    Voyageur saveVoyageurAccount(Voyageur model);
}
