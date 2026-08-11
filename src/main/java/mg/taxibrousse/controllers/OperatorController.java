package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IOperatorController;
import mg.taxibrousse.entities.UserOperatorEntity;
import mg.taxibrousse.models.UserOperator;
import mg.taxibrousse.repositories.IGareRepository;
import mg.taxibrousse.repositories.IKoperativeRepository;
import mg.taxibrousse.repositories.IOperatorRepository;
import mg.taxibrousse.services.IOperatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OperatorController implements IOperatorController {

    private final IOperatorService operatorService;
    private final IOperatorRepository operatorRepository;
    private final IGareRepository gareRepository;
    private final IKoperativeRepository koperativeRepository;

    @Override
    public ResponseEntity<List<UserOperator>> getOperators(
            String search, Long koperativeId, Boolean isActive, Long gareId) {
        return ResponseEntity.ok(operatorService.searchOperators(search, koperativeId, isActive, gareId));
    }

    @Override
    public ResponseEntity<UserOperator> getOperatorById(Long id) {
        UserOperator operator = operatorService.findById(id);
        if (operator == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(operator);
    }

    @Override
    @Transactional
    public ResponseEntity<UserOperator> assignGare(Long id, Map<String, Long> body) {
        Long gareId = body.get("gareId");
        if (gareId == null) return ResponseEntity.badRequest().build();

        UserOperatorEntity operator = operatorRepository.findById(id).orElse(null);
        if (operator == null) return ResponseEntity.notFound().build();

        operator.setDepartureGare(gareRepository.getReferenceById(gareId));

        Long koperativeId = body.get("koperativeId");
        if (koperativeId != null) {
            operator.setKoperative(koperativeRepository.getReferenceById(koperativeId));
        }

        operatorRepository.save(operator);

        return ResponseEntity.ok(operatorService.findById(id));
    }

    @Override
    @Transactional
    public ResponseEntity<UserOperator> assignKoperatives(Long id, Map<String, List<Long>> body) {
        List<Long> koperativeIds = body.get("koperativeIds");
        if (koperativeIds == null) return ResponseEntity.badRequest().build();

        UserOperatorEntity operator = operatorRepository.findById(id).orElse(null);
        if (operator == null) return ResponseEntity.notFound().build();

        operator.setAssignedKoperatives(new HashSet<>(koperativeRepository.findAllById(koperativeIds)));
        operatorRepository.save(operator);

        return ResponseEntity.ok(operatorService.findById(id));
    }
}
