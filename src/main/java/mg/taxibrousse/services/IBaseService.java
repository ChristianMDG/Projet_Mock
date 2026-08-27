package mg.taxibrousse.services;

import org.springframework.data.repository.CrudRepository;

import java.util.function.Function;

public interface IBaseService {

    default <E, M> M findById(Long id, CrudRepository<E, Long> repo, Function<E, M> mapper) {
        if (id == null || id == 0)
            return null;
        return repo.findById(id).map(mapper).orElse(null);
    }
}
