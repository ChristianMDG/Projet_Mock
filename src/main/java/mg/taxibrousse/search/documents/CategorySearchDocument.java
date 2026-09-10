package mg.taxibrousse.search.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "taxibrousse_categories")
public class CategorySearchDocument implements Serializable {

    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String type;

    @Field(type = FieldType.Text)
    private String title;

    @Field(type = FieldType.Text)
    private String subtitle;

    @Field(type = FieldType.Keyword)
    private String badge;

    @Field(type = FieldType.Keyword)
    private String slug;

    @Field(type = FieldType.Keyword)
    private String imageUrl;

    @Field(type = FieldType.Text)
    private String searchableText;
}
