package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.ICommissionController;
import mg.taxibrousse.models.Commission;
import mg.taxibrousse.services.ICommissionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class CommissionController implements ICommissionController {

    private final ICommissionService service;

    @Override
    public ResponseEntity<Page<Commission>> findAll(Long koperativeId, Pageable pageable) {
        return ResponseEntity.ok(service.findAll(koperativeId, pageable));
    }

    @Override
    public ResponseEntity<Commission> findById(Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Commission> create(Commission commission) {
        return ResponseEntity.ok(service.save(commission));
    }

    @Override
    public ResponseEntity<Commission> update(Long id, Commission commission) {
        commission.setId(id);
        return ResponseEntity.ok(service.save(commission));
    }

    @Override
    public ResponseEntity<Void> delete(Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
