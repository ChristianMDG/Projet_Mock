package mg.taxibrousse.services;

import mg.taxibrousse.dto.search.GlobalSearchResponse;

public interface IGlobalSearchService {

    GlobalSearchResponse search(String query, String categoryFilter, int limit);

    void rebuildIndex();

    void reindexVoyages();

    void cleanIndex();
}
