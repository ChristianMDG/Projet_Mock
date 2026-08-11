package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.entities.AuthorityEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authorities")
@PreAuthorize("hasAuthority('ADMIN')")
public interface IAuthorityController {

    @GetMapping
    ResponseEntity<List<AuthorityEntity>> getAllAuthorities();

    @GetMapping("/{id}")
    ResponseEntity<AuthorityEntity> getAuthorityById(@PathVariable Long id);

    @PostMapping
    ResponseEntity<AuthorityEntity> createAuthority(@RequestBody AuthorityEntity authority);

    @PutMapping("/{id}")
    ResponseEntity<AuthorityEntity> updateAuthority(@PathVariable Long id, @RequestBody AuthorityEntity authority);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteAuthority(@PathVariable Long id);
}
