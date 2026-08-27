package mg.taxibrousse.dto.orange;

import com.fasterxml.jackson.annotation.JsonProperty;

public record OrangeSmsRequest(@JsonProperty("outboundSMSMessageRequest") OutboundSMSMessageRequest outboundSMSMessageRequest) {

    public record OutboundSMSMessageRequest(String address, String senderAddress, String senderName, @JsonProperty("outboundSMSTextMessage") OutboundSMSTextMessage outboundSMSTextMessage) {
    }

    public record OutboundSMSTextMessage(String message) {
    }

    public static OrangeSmsRequest create(String senderAddress, String senderName, String receiverAddress, String message) {
        return new OrangeSmsRequest(new OutboundSMSMessageRequest("tel:" + receiverAddress, "tel:" + senderAddress, senderName, new OutboundSMSTextMessage(message)));
    }
}
