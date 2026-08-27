package mg.taxibrousse.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private String error;
    private String message;
    private int status;
    private String path;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
