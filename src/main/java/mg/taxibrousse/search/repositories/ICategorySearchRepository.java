package mg.taxibrousse.search.repositories;

import mg.taxibrousse.search.documents.CategorySearchDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICategorySearchRepository extends ElasticsearchRepository<CategorySearchDocument, String> {

    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"title^3\", \"subtitle\", \"searchableText\"], \"fuzziness\": \"AUTO\"}}")
    Page<CategorySearchDocument> search(String query, Pageable pageable);
}
