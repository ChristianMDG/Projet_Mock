package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.HttpRequest.WhatsAppApiClient;
import mg.taxibrousse.config.WhatsAppApiConfig;
import mg.taxibrousse.dto.whatsapp.WhatsAppMessageRequest;
import mg.taxibrousse.dto.whatsapp.WhatsAppMessageResponse;
import mg.taxibrousse.services.IWhatsAppService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppService implements IWhatsAppService {

    private final WhatsAppApiClient whatsAppApiClient;
    private final WhatsAppApiConfig config;

    @Override
    public WhatsAppMessageResponse sendTextMessage(String phoneNumber, String message) {
        log.info("Sending text message to: {}", phoneNumber);
        return sendRequest(phoneNumber, "text", req -> req.text(WhatsAppMessageRequest.WhatsAppTextMessage.builder().previewUrl(false).body(message).build()));
    }

    @Override
    public WhatsAppMessageResponse sendTemplateMessage(String phoneNumber, String templateName, String languageCode, String... parameters) {
        log.info("Sending template '{}' to: {}", templateName, phoneNumber);

        var templateParams = List.of(parameters).stream().map(param -> WhatsAppMessageRequest.WhatsAppTemplateParameter.builder().type("text").text(param).build()).toList();

        var components = templateParams.isEmpty()
                ? List.<WhatsAppMessageRequest.WhatsAppTemplateComponent>of()
                : List.of(WhatsAppMessageRequest.WhatsAppTemplateComponent.builder().type("body").parameters(templateParams).build());

        return sendRequest(phoneNumber,
                "template",
                req -> req.template(WhatsAppMessageRequest.WhatsAppTemplateMessage.builder()
                        .name(templateName)
                        .language(WhatsAppMessageRequest.WhatsAppLanguage.builder().code(languageCode).build())
                        .components(components)
                        .build()));
    }

    @Override
    public WhatsAppMessageResponse sendButtonMessage(String phoneNumber, String bodyText, List<WhatsAppMessageRequest.WhatsAppButton> buttons) {
        log.info("Sending button message to: {}", phoneNumber);
        return sendInteractive(phoneNumber, "button", bodyText, action -> action.buttons(buttons));
    }

    @Override
    public WhatsAppMessageResponse sendListMessage(String phoneNumber, String bodyText, String buttonText, List<WhatsAppMessageRequest.WhatsAppSection> sections) {
        log.info("Sending list message to: {}", phoneNumber);
        return sendInteractive(phoneNumber, "list", bodyText, action -> action.button(buttonText).sections(sections));
    }

    @Override
    public WhatsAppMessageResponse sendImageMessage(String phoneNumber, String imageUrl, String caption) {
        log.info("Sending image to: {}", phoneNumber);
        return sendRequest(phoneNumber, "image", req -> req.image(WhatsAppMessageRequest.WhatsAppMediaMessage.builder().link(imageUrl).caption(caption).build()));
    }

    @Override
    public WhatsAppMessageResponse sendDocumentMessage(String phoneNumber, String documentUrl, String filename, String caption) {
        log.info("Sending document to: {}", phoneNumber);
        return sendRequest(phoneNumber, "document", req -> req.document(WhatsAppMessageRequest.WhatsAppMediaMessage.builder().link(documentUrl).filename(filename).caption(caption).build()));
    }

    @Override
    public WhatsAppMessageResponse sendLocationMessage(String phoneNumber, Double latitude, Double longitude, String name, String address) {
        log.info("Sending location to: {}", phoneNumber);
        return sendRequest(phoneNumber,
                "location",
                req -> req.location(WhatsAppMessageRequest.WhatsAppLocationMessage.builder().latitude(latitude).longitude(longitude).name(name).address(address).build()));
    }

    @Override
    public WhatsAppMessageResponse sendCustomMessage(WhatsAppMessageRequest messageRequest) {
        log.info("Sending custom message to: {}", messageRequest.getTo());
        return whatsAppApiClient.post(config.getMessagesUrl(), messageRequest, WhatsAppMessageResponse.class);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private WhatsAppMessageResponse sendRequest(String phoneNumber, String type, RequestConfigurer configurer) {
        var builder = baseRequest(phoneNumber, type);
        configurer.configure(builder);
        return sendCustomMessage(builder.build());
    }

    private WhatsAppMessageResponse sendInteractive(String phoneNumber, String interactiveType, String bodyText, ActionConfigurer configurer) {
        return sendRequest(phoneNumber, "interactive", req -> {
            var actionBuilder = WhatsAppMessageRequest.WhatsAppInteractiveAction.builder();
            configurer.configure(actionBuilder);

            req.interactive(WhatsAppMessageRequest.WhatsAppInteractiveMessage.builder()
                    .type(interactiveType)
                    .body(WhatsAppMessageRequest.WhatsAppInteractiveBody.builder().text(bodyText).build())
                    .action(actionBuilder.build())
                    .build());
        });
    }

    private WhatsAppMessageRequest.WhatsAppMessageRequestBuilder baseRequest(String phoneNumber, String type) {
        return WhatsAppMessageRequest.builder().messagingProduct("whatsapp").recipientType("individual").to(formatPhoneNumber(phoneNumber)).type(type);
    }

    private String formatPhoneNumber(String phoneNumber) {
        String formatted = phoneNumber.replaceAll("[\\s-]", "");
        return formatted.startsWith("+") ? formatted : "+" + formatted;
    }

    @FunctionalInterface
    private interface RequestConfigurer {

        void configure(WhatsAppMessageRequest.WhatsAppMessageRequestBuilder builder);
    }

    @FunctionalInterface
    private interface ActionConfigurer {

        void configure(WhatsAppMessageRequest.WhatsAppInteractiveAction.WhatsAppInteractiveActionBuilder builder);
    }
}
