package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.SpringSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISpringSessionRepository extends JpaRepository<SpringSession, String> {}
