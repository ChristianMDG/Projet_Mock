package mg.taxibrousse;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.AuthorityEntity;
import mg.taxibrousse.entities.enums.AuthorityEnum;
import mg.taxibrousse.models.Resource;
import mg.taxibrousse.repositories.IAuthorityRepository;
import mg.taxibrousse.repositories.IVilleRepository;
import mg.taxibrousse.services.IResourceService;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.File;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseInitializer {

    private final ResourceLoader resourceLoader;
    private final IResourceService resourceService;
    private final IAuthorityRepository authorityRepository;
    private final IVilleRepository villeRepository;
    private final CacheManager cacheManager;
    private final ObjectMapper mapper = new ObjectMapper();

    private static final Map<String, Function<Resource, String>> LANG_GETTERS = Map.of(
            "mg", Resource::getMg, "fr", Resource::getFr, "en", Resource::getEn
    );

    @PostConstruct
    public void init() {
        var resources = loadResources();
        var villes = villeRepository.findAll();
        villes.forEach(ville -> {
            ville.setPublishedAt(LocalDateTime.now());
            ville.setDocumentId(ville.generateStrapiDocumentId());
        });
        villeRepository.saveAll(villes);

        LANG_GETTERS.forEach((lang, getter) -> writeTranslation(lang, getter, resources));
        writeLabelKeys(resources);
        initAuthorities();
    }

    private List<Resource> loadResources() {
        try {
            var input = resourceLoader.getResource("classpath:resources.json").getInputStream();
            var resources = Set.of(mapper.readValue(input, Resource[].class));
            Optional.ofNullable(cacheManager.getCache("resources")).ifPresent(Cache::clear);
            resourceService.deleteAll();
            return resourceService.saveAll(resources.stream().sorted(Comparator.comparing(Resource::getKey)).toList());
        } catch (Exception e) {
            log.error("Error loading resources: {}", e.getMessage());
            return List.of();
        }
    }

    private void writeTranslation(String lang, Function<Resource, String> getter, List<Resource> resources) {
        if (resources.isEmpty())
            return;
        try {
            var translations = resources.stream().collect(Collectors.toMap(
                    Resource::getKey,
                    r -> Optional.ofNullable(getter.apply(r)).filter(s -> !s.isBlank()).orElse(r.getKey()),
                    (a, b) -> a, LinkedHashMap::new
            ));
            var dir = new File(MessageFormat.format("{0}/front/src/locales/{1}", System.getProperty("user.dir"), lang));
            dir.mkdirs();
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(dir, "translation.json"), translations);
            log.info("Written {}/translation.json ({} keys)", lang, translations.size());
        } catch (Exception e) {
            log.error("Error writing {} translations: {}", lang, e.getMessage());
        }
    }

    private void writeLabelKeys(List<Resource> resources) {
        if (resources.isEmpty())
            return;
        try {
            var labelKeys = resources.stream().collect(Collectors.toMap(
                    Resource::getKey,
                    Resource::getKey,
                    (a, b) -> a, LinkedHashMap::new
            ));
            var file = new File(MessageFormat.format("{0}/front/src/labelKeys.json", System.getProperty("user.dir")));
            mapper.writerWithDefaultPrettyPrinter().writeValue(file, labelKeys);
            log.info("Written labelKeys.json ({} keys)", labelKeys.size());
        } catch (Exception e) {
            log.error("Error writing labelKeys.json: {}", e.getMessage());
        }
    }

    private void initAuthorities() {
        if (authorityRepository.existsByName(AuthorityEnum.ADMIN.getName()))
            return;

        authorityRepository
                .saveAll(Arrays.stream(AuthorityEnum.values())
                        .map(a -> {
                            var e = new AuthorityEntity();
                            e.setName(a.getName());
                            return e;
                        })
                        .toList());
    }
}
