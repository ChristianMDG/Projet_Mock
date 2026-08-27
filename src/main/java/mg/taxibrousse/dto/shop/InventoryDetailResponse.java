package mg.taxibrousse.dto.shop;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import mg.taxibrousse.models.Inventory;
import mg.taxibrousse.models.InventoryLog;
import org.springframework.data.domain.Page;

@Getter
@Setter
@Builder
public class InventoryDetailResponse {

    private Inventory inventory;
    private Page<InventoryLog> recentLogs;

    public static InventoryDetailResponse of(Inventory inv, Page<InventoryLog> logs) {
        return InventoryDetailResponse.builder().inventory(inv).recentLogs(logs).build();
    }
}
