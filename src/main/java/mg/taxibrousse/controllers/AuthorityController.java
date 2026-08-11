package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.AuthorityEntity;
import mg.taxibrousse.services.implementation.AuthorityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authorities")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AuthorityController {

    private final AuthorityService authorityService;

    @GetMapping
    public ResponseEntity<List<AuthorityEntity>> getAllAuthorities() {
        return ResponseEntity.ok(authorityService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorityEntity> getAuthorityById(@PathVariable Long id) {
        return authorityService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AuthorityEntity> createAuthority(@RequestBody AuthorityEntity authority) {
        return ResponseEntity.ok(authorityService.save(authority));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthorityEntity> updateAuthority(
        @PathVariable Long id,
        @RequestBody AuthorityEntity authority
    ) {
        authority.setId(id);
        return ResponseEntity.ok(authorityService.save(authority));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthority(@PathVariable Long id) {
        authorityService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
