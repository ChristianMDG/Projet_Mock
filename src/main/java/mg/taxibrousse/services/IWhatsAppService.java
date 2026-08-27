package mg.taxibrousse.services;

import mg.taxibrousse.dto.whatsapp.WhatsAppMessageRequest;
import mg.taxibrousse.dto.whatsapp.WhatsAppMessageResponse;

import java.util.List;

public interface IWhatsAppService {

    /**
     * Send a text message via WhatsApp.
     *
     * @param phoneNumber recipient phone number (with country code, e.g., "+261340000000")
     * @param message text message to send
     * @return WhatsAppMessageResponse containing message ID and status
     * @throws mg.taxibrousse.exceptions.WhatsAppException if the API call fails
     */
    WhatsAppMessageResponse sendTextMessage(String phoneNumber, String message);

    /**
     * Send a template message via WhatsApp.
     *
     * @param phoneNumber recipient phone number (with country code)
     * @param templateName name of the approved template
     * @param languageCode language code (e.g., "en", "fr", "mg")
     * @param parameters template parameters
     * @return WhatsAppMessageResponse containing message ID and status
     * @throws mg.taxibrousse.exceptions.WhatsAppException if the API call fails
     */
    WhatsAppMessageResponse sendTemplateMessage(String phoneNumber, String templateName, String languageCode, String... parameters);

    /**
     * Send a message with buttons (interactive message).
     *
     * @param phoneNumber recipient phone number (with country code)
     * @param bodyText message body
     * @param buttons list of button objects
     * @return WhatsAppMessageResponse containing message ID and status
     * @throws mg.taxibrousse.exceptions.WhatsAppException if the API call fails
     */
    WhatsAppMessageResponse sendButtonMessage(String phoneNumber, String bodyText, List<WhatsAppMessageRequest.WhatsAppButton> buttons);

    /**
     * Send a message with a list (interactive message).
     *
     * @param phoneNumber recipient phone number (with country code)
     * @param bodyText message body
     * @param buttonText text for the list button
     * @param sections list of sections with rows
     * @return WhatsAppMessageResponse containing message ID and status
     * @throws mg.taxibrousse.exceptions.WhatsAppException if the API call fails
     */
    WhatsAppMessageResponse sendListMessage(String phoneNumber, String bodyText, String buttonText, List<WhatsAppMessageRequest.WhatsAppSection> sections);

    /**
     * Send an image via WhatsApp.
     *
     * @param phoneNumber recipient phone number (with country code)
     * @param imageUrl URL of the image
     * @param caption optional caption for the image
     * @return WhatsAppMessageResponse containing message ID and status
     * @throws mg.taxibrousse.exceptions.WhatsAppException if the API call fails
     */
    WhatsAppMessageResponse sendImageMessage(String phoneNumber, String imageUrl, String caption);

    /**
     * Send a document via WhatsApp.
     *
     * @param phoneNumber recipient phone number (with country code)
     * @param documentUrl URL of the document
     * @param filename name of the file
     * @param caption optional caption
     * @return WhatsAppMessageResponse containing message ID and status
     * @throws mg.taxibrousse.exceptions.WhatsAppException if the API call fails
     */
    WhatsAppMessageResponse sendDocumentMessage(String phoneNumber, String documentUrl, String filename, String caption);

    /**
     * Send a location via WhatsApp.
     *
     * @param phoneNumber recipient phone number (with country code)
     * @param latitude location latitude
     * @param longitude location longitude
     * @param name location name
     * @param address location address
     * @return WhatsAppMessageResponse containing message ID and status
     * @throws mg.taxibrousse.exceptions.WhatsAppException if the API call fails
     */
    WhatsAppMessageResponse sendLocationMessage(String phoneNumber, Double latitude, Double longitude, String name, String address);

    /**
     * Send a custom message (full control over message structure).
     *
     * @param messageRequest custom WhatsApp message request
     * @return WhatsAppMessageResponse containing message ID and status
     * @throws mg.taxibrousse.exceptions.WhatsAppException if the API call fails
     */
    WhatsAppMessageResponse sendCustomMessage(WhatsAppMessageRequest messageRequest);
}
