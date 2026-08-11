package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.Resource;
import mg.taxibrousse.services.IResourceService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final IResourceService resourceService;

    @GetMapping
    @Cacheable(value = "resources", key = "'all'")
    public List<Resource> listResources() {
        return resourceService.findAll();
    }

    @PostMapping("/batch")
    @CacheEvict(value = "resources", allEntries = true)
    public List<Resource> saveOrUpdateResources(@RequestBody List<Resource> resources) {
        return resourceService.saveAll(resources);
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "resources", allEntries = true)
    public void deleteResource(@PathVariable Long id) {
        resourceService.deleteById(id);
    }

    @PostMapping
    @CacheEvict(value = "resources", allEntries = true)
    public Resource saveResource(@RequestBody Resource resource) {
        return resourceService.save(resource);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "resources", allEntries = true)
    public Resource updateResource(@PathVariable Long id, @RequestBody Resource resource) {
        resource.setId(id);
        return resourceService.save(resource);
    }

    @GetMapping("/{id}")
    @Cacheable(value = "resources", key = "#id")
    public Resource getResource(@PathVariable Long id) {
        return resourceService.findById(id);
    }
}
