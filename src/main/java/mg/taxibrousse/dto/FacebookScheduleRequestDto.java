package mg.taxibrousse.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
public class FacebookScheduleRequestDto {

    private String voyageIds;

    private String description;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime scheduledTime;

    private String hashtags;

    private MultipartFile image;
}
