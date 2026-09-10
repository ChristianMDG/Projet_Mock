package mg.taxibrousse.search.repositories;

import mg.taxibrousse.search.documents.VoyageSearchDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IVoyageSearchRepository extends ElasticsearchRepository<VoyageSearchDocument, String> {

    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"title^3\", \"subtitle^2\", \"searchableText\"], \"fuzziness\": \"AUTO\"}}")
    Page<VoyageSearchDocument> search(String query, Pageable pageable);
}
