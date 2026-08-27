package mg.taxibrousse.services;

import mg.taxibrousse.dto.VoyageDescriptionDto;
import mg.taxibrousse.dto.FacebookScheduleRequestDto;

import java.time.LocalDate;
import java.util.List;

public interface IFacebookPostService {

    /**
     * Returns voyage descriptions for a given departure date, gare, and departure ville.
     * Only includes voyages where fb_scheduled = false.
     */
    List<VoyageDescriptionDto> getVoyageDescriptions(LocalDate departureDate, Long gareId, String departureVille);

    /**
     * Marks the specified voyages (by ID) as fb_scheduled = true.
     * Optionally uploads the image and schedules a Facebook post.
     * If the Facebook API call fails, the schedule is still saved in DB.
     *
     * @param request Facebook Schedule Request data containing voyageIds
     */
    void schedulePost(FacebookScheduleRequestDto request);
}
