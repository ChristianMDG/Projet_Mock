package mg.taxibrousse.services;

import mg.taxibrousse.dto.shop.BulkImportResult;
import org.springframework.web.multipart.MultipartFile;

public interface IProductImportService {

    BulkImportResult importCsv(MultipartFile file, boolean dryRun);
}
