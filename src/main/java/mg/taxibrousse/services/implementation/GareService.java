package mg.taxibrousse.services.implementation;

import mg.taxibrousse.entities.CloudinaryEntity;
import mg.taxibrousse.entities.GareEntity;
import mg.taxibrousse.models.Cloudinary;
import mg.taxibrousse.models.Gare;
import mg.taxibrousse.params.GareFilter;
import mg.taxibrousse.repositories.ICloudinaryRepository;
import mg.taxibrousse.repositories.IGareRepository;
import mg.taxibrousse.services.IGareService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class GareService implements IGareService {

    private final IGareRepository gareRepository;
    private final ICloudinaryRepository cloudinaryRepository;

    public GareService(IGareRepository gareRepository, ICloudinaryRepository cloudinaryRepository) {
        this.gareRepository = gareRepository;
        this.cloudinaryRepository = cloudinaryRepository;
    }

    @Override
    @Transactional
    @CacheEvict(value = "gares", allEntries = true)
    public Gare save(Gare gare) {
        if (gare == null) {
            throw new IllegalArgumentException("Gare cannot be null");
        }

        GareEntity gareEntity = gare.toEntity();

        List<Cloudinary> cloudinaryEntities = gare.getPhotos();

        if (cloudinaryEntities != null && !cloudinaryEntities.isEmpty()) {
            List<CloudinaryEntity> savedEntity = createCloudinaryEntity(cloudinaryEntities);
            gareEntity.setPhotos(savedEntity);
        }

        GareEntity savedGare = gareRepository.save(gareEntity);
        return Gare.fromEntity(savedGare);
    }

    private List<CloudinaryEntity> createCloudinaryEntity(List<Cloudinary> cloudinaryEntities) {
        return cloudinaryEntities.stream().map(cloudinary -> {
            if (checkCloudinaryEntity(cloudinary.getPublicId())) {
                return cloudinaryRepository.findByPublicId(cloudinary.getPublicId()).orElse(null);
            }
            CloudinaryEntity entity = new CloudinaryEntity();
            entity.setUrl(cloudinary.getUrl());
            entity.setPublicId(cloudinary.getPublicId());
            entity.setFormat(cloudinary.getFormat());
            entity.setResourceType(cloudinary.getResourceType());
            entity.setBytes(cloudinary.getBytes());
            entity.setWidth(cloudinary.getWidth());
            entity.setHeight(cloudinary.getHeight());
            return cloudinaryRepository.save(entity);
        }).filter(Objects::nonNull).toList();
    }

    private Boolean checkCloudinaryEntity(String publicId) {
        return cloudinaryRepository.existsByPublicId(publicId);
    }

    @Override
    @Transactional
    @CacheEvict(value = "gares", allEntries = true)
    public Gare updateGare(Long id, Gare gare) {
        GareEntity existing = gareRepository.findWithDetailsById(id).orElseThrow(() -> new RuntimeException("Gare not found"));

        existing.setName(gare.getName());
        existing.setAddress(gare.getAddress());
        existing.setDescription(gare.getDescription());
        existing.setIsClosed(gare.getIsClosed());

        List<CloudinaryEntity> existingPhotos = existing.getPhotos();
        List<Cloudinary> newPhotos = gare.getPhotos();

        if (existingPhotos != null && !existingPhotos.isEmpty()) {
            List<CloudinaryEntity> photosToRemove = new ArrayList<>();

            for (CloudinaryEntity existingPhoto : existingPhotos) {
                if (newPhotos == null || checkMissingPublicId(existingPhoto.getPublicId(), newPhotos)) {
                    photosToRemove.add(existingPhoto);
                }
            }

            existing.getPhotos().removeAll(photosToRemove);
        }

        if (newPhotos != null && !newPhotos.isEmpty()) {
            List<CloudinaryEntity> photosToAdd = createCloudinaryEntity(newPhotos);

            for (CloudinaryEntity photoToAdd : photosToAdd) {
                if (!existing.getPhotos().contains(photoToAdd)) {
                    existing.getPhotos().add(photoToAdd);
                }
            }
        }

        GareEntity savedGare = gareRepository.save(existing);
        return Gare.fromEntity(savedGare);
    }

    private boolean checkMissingPublicId(String publicId, List<Cloudinary> currentCloudinaryList) {
        for (Cloudinary tempCloudinary : currentCloudinaryList) {
            if (tempCloudinary.getPublicId().equals(publicId)) {
                return false;
            }
        }
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "gares", key = "'all'")
    public List<Gare> findAll() {
        return gareRepository.findAll().stream().map(Gare::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "gares", key = "#id", unless = "#result == null")
    public Gare findById(Long id) {
        GareEntity entity = gareRepository.findWithDetailsById(id).orElse(null);
        return Gare.fromEntity(entity, true);
    }

    @Override
    @CacheEvict(value = "gares", allEntries = true)
    public void deleteById(Long id) {
        gareRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Gare> findByVilleId(Long villeId) {
        return gareRepository.findByVilleId(villeId).stream().map(Gare::fromEntity).toList();
    }

    @Override
    public List<Gare> findGares(GareFilter filter) {
        return gareRepository.findGares(filter.getVilleIds(), filter.getKoperativeName(), filter.getName(), filter.getIsClosed()).stream().map(Gare::fromEntity).toList();
    }
}
