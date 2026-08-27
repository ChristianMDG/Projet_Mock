package mg.taxibrousse.dto.mvola;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.util.List;

/**
 * Custom serializers for MVola API format.
 * MVola expects arrays of key-value objects like: [{"key": "msisdn", "value": "0343500003"}]
 */
public class MVolaApiSerializer {

    public static class PartyListSerializer extends JsonSerializer<List<Party>> {

        @Override
        public void serialize(List<Party> parties, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeStartArray();
            for (Party party : parties) {
                gen.writeStartObject();
                gen.writeStringField("key", party.key());
                gen.writeStringField("value", party.value());
                gen.writeEndObject();
            }
            gen.writeEndArray();
        }
    }

    public static class MetadataListSerializer extends JsonSerializer<List<Metadata>> {

        @Override
        public void serialize(List<Metadata> metadata, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeStartArray();
            for (Metadata meta : metadata) {
                gen.writeStartObject();
                gen.writeStringField("key", meta.key());
                gen.writeStringField("value", meta.value());
                gen.writeEndObject();
            }
            gen.writeEndArray();
        }
    }
}
