package mg.taxibrousse;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.AuthorityEntity;
import mg.taxibrousse.entities.enums.AuthorityEnum;
import mg.taxibrousse.repositories.IAuthorityRepository;
import mg.taxibrousse.repositories.IKoperativeRepository;
import mg.taxibrousse.repositories.IVilleRepository;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseInitializer {

    private final ResourceLoader resourceLoader;
    private final IAuthorityRepository authorityRepository;
    private final IVilleRepository villeRepository;
    private final IKoperativeRepository koperativeRepository;
    private final ObjectMapper mapper = new ObjectMapper();
    private final CustomPrettyPrinter prettyPrinter = new CustomPrettyPrinter();

    public record ResourceRecord(String key, String mg, String fr, String en) {
    }

    private static final Map<String, Function<ResourceRecord, String>> LANG_GETTERS = Map.of("mg", ResourceRecord::mg, "fr", ResourceRecord::fr, "en", ResourceRecord::en);

    @PostConstruct
    public void init() {
        var resources = loadResources("classpath:resources.json");
        var rentalResources = loadResources("classpath:rental.resources.json");

        var villes = villeRepository.findAll();
        villes.forEach(ville -> {
            ville.setPublishedAt(LocalDateTime.now());
            ville.setDocumentId(ville.generateStrapiDocumentId());
        });
        villeRepository.saveAll(villes);

        // Generate front translation files and keys
        LANG_GETTERS.forEach((lang, getter) -> writeTranslation(lang, getter, resources, "front/src/locales"));
        writeLabelKeys(resources, "front/src/labelKeys.json");

        // Generate location translation files and keys
        LANG_GETTERS.forEach((lang, getter) -> writeTranslation(lang, getter, rentalResources, "location/src/locales"));
        writeLabelKeys(rentalResources, "location/src/labelKeys.json");

        initAuthorities();
    }

    private List<ResourceRecord> loadResources(String path) {
        try {
            var input = resourceLoader.getResource(path).getInputStream();
            var resources = Set.of(mapper.readValue(input, ResourceRecord[].class));
            return resources.stream().sorted(Comparator.comparing(ResourceRecord::key)).toList();
        } catch (Exception e) {
            log.error("Error loading resources from {}: {}", path, e.getMessage());
            return List.of();
        }
    }

    private void writeTranslation(String lang, Function<ResourceRecord, String> getter, List<ResourceRecord> resources, String destPath) {
        if (resources.isEmpty())
            return;
        try {
            var translations = resources.stream()
                    .collect(Collectors.toMap(ResourceRecord::key, r -> Optional.ofNullable(getter.apply(r)).filter(s -> !s.isBlank()).orElse(r.key()), (a, b) -> a, LinkedHashMap::new));
            var dir = new File(MessageFormat.format("{0}/{1}/{2}", System.getProperty("user.dir"), destPath, lang));
            dir.mkdirs();

            writeJsonFile(new File(dir, "translation.json"), translations);
            log.info("Written {}/{}/translation.json ({} keys)", destPath, lang, translations.size());
        } catch (Exception e) {
            log.error("Error writing {}/{} translations: {}", destPath, lang, e.getMessage());
        }
    }

    private void writeLabelKeys(List<ResourceRecord> resources, String destFile) {
        if (resources.isEmpty())
            return;
        try {
            var labelKeys = resources.stream().collect(Collectors.toMap(ResourceRecord::key, ResourceRecord::key, (a, b) -> a, LinkedHashMap::new));
            var file = new File(MessageFormat.format("{0}/{1}", System.getProperty("user.dir"), destFile));

            writeJsonFile(file, labelKeys);
            log.info("Written {} ({} keys)", destFile, labelKeys.size());
        } catch (Exception e) {
            log.error("Error writing labelKeys to {}: {}", destFile, e.getMessage());
        }
    }

    private void writeJsonFile(File file, Object data) throws IOException {
        String json = mapper.writer(prettyPrinter).writeValueAsString(data);
        Files.write(file.toPath(), List.of(json.stripTrailing()));
    }

    private void initAuthorities() {
        if (authorityRepository.existsByName(AuthorityEnum.ADMIN.getName()))
            return;

        authorityRepository.saveAll(Arrays.stream(AuthorityEnum.values()).map(a -> {
            var e = new AuthorityEntity();
            e.setName(a.getName());
            return e;
        }).toList());
    }

    private static class CustomPrettyPrinter extends DefaultPrettyPrinter {

        public CustomPrettyPrinter() {
            super();
        }

        public CustomPrettyPrinter(CustomPrettyPrinter base) {
            super(base);
        }

        @Override
        public void writeObjectFieldValueSeparator(JsonGenerator jg) throws IOException {
            jg.writeRaw(": ");
        }

        @Override
        public CustomPrettyPrinter createInstance() {
            return new CustomPrettyPrinter(this);
        }
    }
}
