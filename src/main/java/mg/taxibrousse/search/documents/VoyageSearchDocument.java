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
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "taxibrousse_voyages")
public class VoyageSearchDocument implements Serializable {

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

    @Field(type = FieldType.Text)
    private String extraInfo;

    @Field(type = FieldType.Keyword)
    private String imageUrl;

    @Field(type = FieldType.Keyword)
    private String departureVilleName;

    @Field(type = FieldType.Keyword)
    private String arrivalVilleName;

    @Field(type = FieldType.Keyword)
    private String departureDate;

    @Field(type = FieldType.Keyword)
    private String slug;

    @Field(type = FieldType.Double)
    private BigDecimal price;

    @Field(type = FieldType.Integer)
    private Integer availableSeats;

    @Field(type = FieldType.Text)
    private String searchableText;
}
