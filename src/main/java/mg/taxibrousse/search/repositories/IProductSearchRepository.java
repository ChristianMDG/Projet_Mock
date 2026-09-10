package mg.taxibrousse.search.repositories;

import mg.taxibrousse.search.documents.ProductSearchDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IProductSearchRepository extends ElasticsearchRepository<ProductSearchDocument, String> {

    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"title^3\", \"subtitle^2\", \"extraInfo\", \"searchableText\"], \"fuzziness\": \"AUTO\"}}")
    Page<ProductSearchDocument> search(String query, Pageable pageable);
}
