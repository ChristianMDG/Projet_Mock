package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.Commission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/commissions")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface ICommissionController {

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATEUR')")
    ResponseEntity<Page<Commission>> findAll(@RequestParam(required = false) Long koperativeId, @PageableDefault(size = 15, sort = "id", direction = Sort.Direction.ASC) Pageable pageable);

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATEUR')")
    ResponseEntity<Commission> findById(@PathVariable Long id);

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATEUR')")
    ResponseEntity<Commission> create(@RequestBody Commission commission);

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATEUR')")
    ResponseEntity<Commission> update(@PathVariable Long id, @RequestBody Commission commission);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATEUR')")
    ResponseEntity<Void> delete(@PathVariable Long id);
}
