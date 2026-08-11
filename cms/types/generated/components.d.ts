import type { Schema, Struct } from '@strapi/strapi';

export interface PageAboutUsSection extends Struct.ComponentSchema {
  collectionName: 'components_page_about_us_sections';
  info: {
    description: 'Section de contenu \u00E0 propos de nous';
    displayName: 'Section \u00C0 Propos';
    icon: 'information';
  };
  attributes: {
    paragraphs: Schema.Attribute.Component<'page.text-paragraph', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'\u00C0 propos de nous'>;
  };
}

export interface PageAccidentInstructionItem extends Struct.ComponentSchema {
  collectionName: 'components_page_accident_instruction_items';
  info: {
    description: "Une \u00E9tape d'instruction en cas d'accident";
    displayName: 'Accident Instruction Item';
    icon: 'list-ol';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    details: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'CheckCircle'>;
    priority: Schema.Attribute.Enumeration<
      ['critical', 'high', 'medium', 'low']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    step: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PageAccidentInstructions extends Struct.ComponentSchema {
  collectionName: 'components_page_accident_instructions';
  info: {
    description: "Instructions \u00E0 suivre en cas d'accident de v\u00E9hicule";
    displayName: 'Accident Instructions';
    icon: 'exclamation-triangle';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#fff3e0'>;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'lg'>;
    emergencyNumber: Schema.Attribute.String & Schema.Attribute.Required;
    instructions: Schema.Attribute.Component<
      'page.accident-instruction-item',
      true
    > &
      Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PageAdditionalInfo extends Struct.ComponentSchema {
  collectionName: 'components_page_additional_infos';
  info: {
    description: "Section d'informations compl\u00E9mentaires avec alerte";
    displayName: 'Additional Info';
    icon: 'information';
  };
  attributes: {
    alertMessage: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    alertType: Schema.Attribute.Enumeration<
      ['info', 'success', 'warning', 'error']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'warning'>;
    items: Schema.Attribute.Component<'page.additional-info-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Informations compl\u00E9mentaires'>;
  };
}

export interface PageAdditionalInfoItem extends Struct.ComponentSchema {
  collectionName: 'components_page_additional_info_items';
  info: {
    description: "\u00C9l\u00E9ment d'information compl\u00E9mentaire";
    displayName: 'Additional Info Item';
    icon: 'info';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      [
        'ChildCare',
        'Luggage',
        'Pets',
        'Security',
        'Info',
        'Help',
        'CheckCircle',
        'Warning',
        'LocalOffer',
        'Payment',
        'AccessTime',
        'EventSeat',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Info'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface PageAdditionalServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_page_additional_service_items';
  info: {
    description: 'Un service suppl\u00E9mentaire';
    displayName: 'Additional Service Item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Star'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageAdditionalServices extends Struct.ComponentSchema {
  collectionName: 'components_page_additional_services';
  info: {
    description: 'Section services suppl\u00E9mentaires';
    displayName: 'Additional Services';
    icon: 'plus';
  };
  attributes: {
    services: Schema.Attribute.Component<'page.additional-service-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageAttractionItem extends Struct.ComponentSchema {
  collectionName: 'components_page_attraction_items';
  info: {
    description: 'Attraction individuelle pour les destinations';
    displayName: '\u00C9l\u00E9ment Attraction';
    icon: 'star';
  };
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Sources thermales'>;
  };
}

export interface PageBenefitItem extends Struct.ComponentSchema {
  collectionName: 'components_page_benefit_items';
  info: {
    description: 'Un avantage individuel';
    displayName: 'Benefit Item';
    icon: 'check-circle';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'success', 'warning', 'info']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    highlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'CheckCircle'>;
    link: Schema.Attribute.String;
    linkText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PageBenefitsShowcase extends Struct.ComponentSchema {
  collectionName: 'components_page_benefits_showcases';
  info: {
    description: 'Pr\u00E9sentation des avantages cl\u00E9s du service';
    displayName: 'Benefits Showcase';
    icon: 'star';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#ffffff'>;
    benefits: Schema.Attribute.Component<'page.benefit-item', true> &
      Schema.Attribute.Required;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'lg'>;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel', 'list']> &
      Schema.Attribute.DefaultTo<'grid'>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PageBookingRuleItem extends Struct.ComponentSchema {
  collectionName: 'components_page_booking_rule_items';
  info: {
    description: 'Un \u00E9l\u00E9ment de r\u00E8gle de r\u00E9servation avec ic\u00F4ne, titre et description';
    displayName: '\u00C9l\u00E9ment de R\u00E8gle de R\u00E9servation';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    icon: Schema.Attribute.Enumeration<
      [
        'Schedule',
        'EventSeat',
        'Security',
        'Payment',
        'CreditCard',
        'LocalOffer',
        'Info',
        'Help',
        'Verified',
        'CheckCircle',
        'Luggage',
        'Person',
        'Groups',
        'AccessTime',
        'CalendarMonth',
        'EditCalendar',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Info'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageBookingRules extends Struct.ComponentSchema {
  collectionName: 'components_page_booking_rules';
  info: {
    description: 'Section des conditions et r\u00E8gles de r\u00E9servation';
    displayName: 'Conditions de R\u00E9servation';
    icon: 'clipboard';
  };
  attributes: {
    rules: Schema.Attribute.Component<'page.booking-rule-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Conditions de r\u00E9servation'>;
  };
}

export interface PageCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_page_call_to_actions';
  info: {
    description: "Section d'appel \u00E0 l'action pour les pages dynamiques";
    displayName: "Appel \u00E0 l'Action";
    icon: 'cursor';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'background.paper'>;
    buttonColor: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'success', 'error', 'warning', 'info']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    buttonIcon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'DirectionsBus'>;
    buttonText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'R\u00E9server maintenant'>;
    buttonUrl: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'/'>;
    buttonVariant: Schema.Attribute.Enumeration<
      ['contained', 'outlined', 'text']
    > &
      Schema.Attribute.DefaultTo<'contained'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'R\u00E9servez d\u00E8s maintenant et profitez de nos services de transport fiables \u00E0 travers Madagascar.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Pr\u00EAt \u00E0 r\u00E9server votre voyage ?'>;
  };
}

export interface PageContactItem extends Struct.ComponentSchema {
  collectionName: 'components_page_contact_items';
  info: {
    description: "\u00C9l\u00E9ment de contact d'urgence individuel";
    displayName: '\u00C9l\u00E9ment Contact';
    icon: 'user';
  };
  attributes: {
    available: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'24h/24'>;
    icon: Schema.Attribute.Enumeration<
      [
        'Phone',
        'LocalPolice',
        'FireTruck',
        'LocalHospital',
        'Help',
        'PermPhoneMsg',
        'Emergency',
        'Security',
        'MedicalServices',
        'SupportAgent',
      ]
    > &
      Schema.Attribute.DefaultTo<'Phone'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Police'>;
    number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'117'>;
  };
}

export interface PageContactMethod extends Struct.ComponentSchema {
  collectionName: 'components_page_contact_methods';
  info: {
    description: 'M\u00E9thode de contact individuelle';
    displayName: 'M\u00E9thode de Contact';
    icon: 'phone';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Email'>;
    type: Schema.Attribute.Enumeration<
      ['email', 'phone', 'address', 'hours', 'other']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'email'>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'info@taxibrousse.mg'>;
  };
}

export interface PageContactSection extends Struct.ComponentSchema {
  collectionName: 'components_page_contact_sections';
  info: {
    description: "Section d'informations de contact";
    displayName: 'Section Contact';
    icon: 'envelop';
  };
  attributes: {
    contactMethods: Schema.Attribute.Component<'page.contact-method', true>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<"Nous sommes l\u00E0 pour vous aider ! Contactez-nous par l'un des moyens suivants :">;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Contactez-nous'>;
  };
}

export interface PageCurrentPromotions extends Struct.ComponentSchema {
  collectionName: 'components_page_current_promotions';
  info: {
    description: 'Section des promotions actuelles avec cartes';
    displayName: 'Promotions Actuelles';
    icon: 'priceTag';
  };
  attributes: {
    promotions: Schema.Attribute.Component<'page.promotion-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Promotions Actuelles'>;
  };
}

export interface PageCustomerTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_page_customer_testimonials';
  info: {
    description: 'Section affichant les avis et t\u00E9moignages clients avec notes';
    displayName: 'T\u00E9moignages Clients';
    icon: 'quote';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'background.paper'>;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'lg'>;
    overallRating: Schema.Attribute.Component<'page.overall-rating', false>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'Des milliers de Malgaches nous font confiance chaque jour'>;
    testimonials: Schema.Attribute.Component<'page.testimonial-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Ce que disent nos voyageurs'>;
  };
}

export interface PageDestinationItem extends Struct.ComponentSchema {
  collectionName: 'components_page_destination_items';
  info: {
    description: 'Destination individuelle avec d\u00E9tails';
    displayName: '\u00C9l\u00E9ment Destination';
    icon: 'globe';
  };
  attributes: {
    attractions: Schema.Attribute.Component<'page.attraction-item', true>;
    category: Schema.Attribute.Enumeration<
      ['Coastal', 'Nature', 'Cultural', 'Thermal', 'Urban', 'Adventure']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Cultural'>;
    city: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Antsirabe'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<"Ville thermale situ\u00E9e dans les hautes terres centrales, connue pour ses sources d'eau chaude et son climat frais.">;
    duration: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'3h de route'>;
    frequency: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'D\u00E9parts toutes les jours'>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    popularity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
    price: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'\u00C0 partir de 25 000 Ar'>;
    region: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'R\u00E9gion du Vakinankaratra'>;
    route: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Antananarivo - Antsirabe'>;
  };
}

export interface PageDestinationsGrid extends Struct.ComponentSchema {
  collectionName: 'components_page_destinations_grids';
  info: {
    description: 'Grille de destinations avec d\u00E9tails';
    displayName: 'Grille de Destinations';
    icon: 'pinMap';
  };
  attributes: {
    destinations: Schema.Attribute.Component<'page.destination-item', true>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'D\u00E9couvrez toutes nos destinations \u00E0 travers Madagascar avec plus de 50 villes desservies quotidiennement'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Destinations populaires'>;
  };
}

export interface PageEmergencyContacts extends Struct.ComponentSchema {
  collectionName: 'components_page_emergency_contacts';
  info: {
    description: "Section des contacts d'urgence";
    displayName: "Contacts d'Urgence";
    icon: 'phone';
  };
  attributes: {
    alertMessage: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<"En cas d'urgence, composez le 117 (police) ou le 118 (pompiers)">;
    alertTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<"Important information en cas d'urgence">;
    alertType: Schema.Attribute.Enumeration<
      ['info', 'success', 'warning', 'error']
    > &
      Schema.Attribute.DefaultTo<'warning'>;
    contacts: Schema.Attribute.Component<'page.contact-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<"Contacts d'urgence">;
  };
}

export interface PageFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_page_faq_items';
  info: {
    description: '\u00C9l\u00E9ment FAQ individuel avec question et r\u00E9ponse';
    displayName: '\u00C9l\u00E9ment FAQ';
    icon: 'message';
  };
  attributes: {
    answer: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }> &
      Schema.Attribute.DefaultTo<"Vous pouvez r\u00E9server un voyage en s\u00E9lectionnant vos villes de d\u00E9part et de destination, en choisissant une date et en s\u00E9lectionnant parmi les itin\u00E9raires disponibles sur notre page d'accueil.">;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'Comment puis-je r\u00E9server un voyage ?'>;
  };
}

export interface PageFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_page_faqs';
  info: {
    description: 'Section FAQ avec questions et r\u00E9ponses';
    displayName: 'Section FAQ';
    icon: 'question';
  };
  attributes: {
    faqs: Schema.Attribute.Component<'page.faq-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Questions Fr\u00E9quemment Pos\u00E9es'>;
  };
}

export interface PageFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_page_feature_items';
  info: {
    description: 'Fonctionnalit\u00E9 individuelle avec ic\u00F4ne, titre et description';
    displayName: '\u00C9l\u00E9ment Fonctionnalit\u00E9';
    icon: 'check';
  };
  attributes: {
    color: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'primary.main'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'Voyagez en toute tranquillit\u00E9 avec nos v\u00E9hicules contr\u00F4l\u00E9s et nos chauffeurs exp\u00E9riment\u00E9s'>;
    icon: Schema.Attribute.Enumeration<
      [
        'Security',
        'Schedule',
        'Payment',
        'SupportAgent',
        'Nature',
        'Star',
        'VerifiedUser',
        'Speed',
        'LocalOffer',
        'Wifi',
        'AcUnit',
        'Build',
        'Shield',
        'Eco',
        'Group',
        'TrendingUp',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Security'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'S\u00E9curit\u00E9 garantie'>;
  };
}

export interface PageHelpArticle extends Struct.ComponentSchema {
  collectionName: 'components_page_help_articles';
  info: {
    description: "Article d'aide individuel";
    displayName: "Article d'Aide";
    icon: 'file';
  };
  attributes: {
    content: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }> &
      Schema.Attribute.DefaultTo<"Pour r\u00E9server un voyage, suivez ces \u00E9tapes simples : 1) S\u00E9lectionnez votre ville de d\u00E9part et de destination 2) Choisissez la date de voyage 3) S\u00E9lectionnez l'horaire qui vous convient 4) Proc\u00E9dez au paiement s\u00E9curis\u00E9.">;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Comment r\u00E9server un voyage'>;
    url: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'/help/comment-reserver'>;
  };
}

export interface PageHelpCategory extends Struct.ComponentSchema {
  collectionName: 'components_page_help_categories';
  info: {
    description: "Cat\u00E9gorie du centre d'aide avec articles";
    displayName: "Cat\u00E9gorie d'Aide";
    icon: 'folder';
  };
  attributes: {
    articles: Schema.Attribute.Component<'page.help-article', true>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'Tout ce que vous devez savoir sur la r\u00E9servation de vos voyages'>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'DirectionsBus'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'R\u00E9servation'>;
  };
}

export interface PageHelpCenterSection extends Struct.ComponentSchema {
  collectionName: 'components_page_help_center_sections';
  info: {
    description: "Contenu du centre d'aide avec cat\u00E9gories";
    displayName: "Section Centre d'Aide";
    icon: 'question';
  };
  attributes: {
    categories: Schema.Attribute.Component<'page.help-category', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<"Centre d'aide">;
  };
}

export interface PageInsuranceCoverage extends Struct.ComponentSchema {
  collectionName: 'components_page_insurance_coverages';
  info: {
    description: "Section de couverture d'assurance avec diff\u00E9rents types";
    displayName: "Couverture d'Assurance";
    icon: 'car';
  };
  attributes: {
    insuranceTypes: Schema.Attribute.Component<'page.insurance-type', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<"Couverture d'assurance">;
  };
}

export interface PageInsuranceType extends Struct.ComponentSchema {
  collectionName: 'components_page_insurance_types';
  info: {
    description: "\u00C9l\u00E9ment de type d'assurance individuel";
    displayName: "Type d'Assurance";
    icon: 'file';
  };
  attributes: {
    coverage: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<"Jusqu'\u00E0 5 000 000 Ar">;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<"Couverture compl\u00E8te en cas d'accident ou de blessure pendant le voyage.">;
    included: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Assurance passager'>;
    price: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Inclus'>;
  };
}

export interface PageLegalContent extends Struct.ComponentSchema {
  collectionName: 'components_page_legal_contents';
  info: {
    description: 'Contenu l\u00E9gal pour confidentialit\u00E9, conditions, etc.';
    displayName: 'Contenu L\u00E9gal';
    icon: 'file';
  };
  attributes: {
    sections: Schema.Attribute.Component<'page.legal-section', true>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<"Informations juridiques et conditions d'utilisation pour la plateforme de r\u00E9servation de Taxibrousse Madagascar. Consultez nos mentions l\u00E9gales, politique de confidentialit\u00E9 et conditions g\u00E9n\u00E9rales d'utilisation.">;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<"Conditions d'utilisation">;
  };
}

export interface PageLegalSection extends Struct.ComponentSchema {
  collectionName: 'components_page_legal_sections';
  info: {
    description: 'Section l\u00E9gale individuelle avec titre et contenu';
    displayName: 'Section L\u00E9gale';
    icon: 'bulletList';
  };
  attributes: {
    content: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }> &
      Schema.Attribute.DefaultTo<"En utilisant notre service de r\u00E9servation de taxi-brousse, vous acceptez de respecter les pr\u00E9sentes conditions d'utilisation. Ces conditions r\u00E9gissent votre utilisation de notre plateforme et de nos services.">;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Acceptation des conditions'>;
  };
}

export interface PageLoyaltyBenefit extends Struct.ComponentSchema {
  collectionName: 'components_page_loyalty_benefits';
  info: {
    description: 'Un avantage du programme de fid\u00E9lit\u00E9';
    displayName: 'Loyalty Benefit';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageLoyaltyLevel extends Struct.ComponentSchema {
  collectionName: 'components_page_loyalty_levels';
  info: {
    description: 'Un niveau du programme de fid\u00E9lit\u00E9';
    displayName: 'Loyalty Level';
    icon: 'medal';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'page.loyalty-benefit', true>;
    color: Schema.Attribute.Enumeration<
      ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'default'>;
    highlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    trips: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface PageLoyaltyProgram extends Struct.ComponentSchema {
  collectionName: 'components_page_loyalty_programs';
  info: {
    description: 'Section programme de fid\u00E9lit\u00E9';
    displayName: 'Loyalty Program';
    icon: 'gift';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    levels: Schema.Attribute.Component<'page.loyalty-level', true>;
    programName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageMeasureItem extends Struct.ComponentSchema {
  collectionName: 'components_page_measure_items';
  info: {
    description: '\u00C9l\u00E9ment de mesure de s\u00E9curit\u00E9 individuel';
    displayName: '\u00C9l\u00E9ment Mesure';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'Tous nos v\u00E9hicules subissent des contr\u00F4les techniques r\u00E9guliers pour garantir votre s\u00E9curit\u00E9.'>;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'Shield'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'V\u00E9hicules contr\u00F4l\u00E9s'>;
  };
}

export interface PageMissionSection extends Struct.ComponentSchema {
  collectionName: 'components_page_mission_sections';
  info: {
    description: "Affichage de la d\u00E9claration de mission de l'entreprise";
    displayName: 'Section Mission';
    icon: 'rocket';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"Faciliter les d\u00E9placements des Malgaches et des visiteurs en offrant un service de transport de qualit\u00E9, accessible et respectueux de l'environnement. Nous nous engageons \u00E0 connecter les communaut\u00E9s et \u00E0 contribuer au d\u00E9veloppement \u00E9conomique et social de Madagascar.">;
    tagline: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Connecter Madagascar, une ville \u00E0 la fois'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Notre Mission'>;
  };
}

export interface PageNetworkSection extends Struct.ComponentSchema {
  collectionName: 'components_page_network_sections';
  info: {
    description: "Affichage du r\u00E9seau de l'entreprise par r\u00E9gions";
    displayName: 'Section R\u00E9seau';
    icon: 'manyWays';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"Avec plus de 50 destinations desservies quotidiennement, Taxibrousse relie Antananarivo aux principales villes de Madagascar et dessert les r\u00E9gions les plus recul\u00E9es de l'\u00EEle.">;
    regions: Schema.Attribute.Component<'page.region-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Notre R\u00E9seau'>;
  };
}

export interface PageNewsItem extends Struct.ComponentSchema {
  collectionName: 'components_page_news_items';
  info: {
    description: "Un article d'actualit\u00E9 individuel";
    displayName: 'News Item';
    icon: 'fileText';
  };
  attributes: {
    buttonText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'En savoir plus'>;
    category: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageNewsSection extends Struct.ComponentSchema {
  collectionName: 'components_page_news_sections';
  info: {
    description: "Section d'actualit\u00E9s avec cartes d'articles";
    displayName: 'News Section';
    icon: 'newspaper';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'background.default'>;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'lg'>;
    newsItems: Schema.Attribute.Component<'page.news-item', true>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Actualit\u00E9s'>;
  };
}

export interface PageOverallRating extends Struct.ComponentSchema {
  collectionName: 'components_page_overall_ratings';
  info: {
    description: 'Affichage de la note moyenne avec statistiques';
    displayName: 'Note Globale';
    icon: 'star';
  };
  attributes: {
    averageRating: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4.8>;
    recommendation: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<96>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Note moyenne de nos voyageurs'>;
    totalReviews: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<12847>;
  };
}

export interface PagePageHeader extends Struct.ComponentSchema {
  collectionName: 'components_page_page_headers';
  info: {
    description: "Section d'en-t\u00EAte pour les pages dynamiques";
    displayName: 'En-t\u00EAte de Page';
    icon: 'write';
  };
  attributes: {
    alertMessage: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'Nous vous rappelons de respecter les consignes de s\u00E9curit\u00E9 durant votre voyage.'>;
    alertTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Information importante'>;
    alertType: Schema.Attribute.Enumeration<
      ['info', 'success', 'warning', 'error']
    > &
      Schema.Attribute.DefaultTo<'info'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 10;
      }> &
      Schema.Attribute.DefaultTo<'D\u00E9couvrez notre plateforme de r\u00E9servation en ligne pour tous vos d\u00E9placements \u00E0 travers Madagascar.'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'Votre plateforme de transport fiable \u00E0 Madagascar'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Bienvenue chez Taxibrousse'>;
  };
}

export interface PagePaymentSection extends Struct.ComponentSchema {
  collectionName: 'components_page_payment_sections';
  info: {
    description: "Section d'information sur les m\u00E9thodes de paiement";
    displayName: 'Section Paiement';
    icon: 'store';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'background.paper'>;
    buttonText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'R\u00E9server maintenant'>;
    buttonUrl: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'/'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'D\u00E9couvrez les diff\u00E9rentes m\u00E9thodes de paiement accept\u00E9es pour vos r\u00E9servations.'>;
    paymentMethods: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-method.payment-method'
    >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'M\u00E9thodes de paiement disponibles'>;
  };
}

export interface PagePopularDestinations extends Struct.ComponentSchema {
  collectionName: 'components_page_popular_destinations';
  info: {
    description: 'Section pr\u00E9sentant les destinations les plus populaires avec cartes visuelles';
    displayName: 'Destinations Populaires';
    icon: 'pinMap';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'background.default'>;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'lg'>;
    destinations: Schema.Attribute.Component<'page.destination-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'D\u00E9couvrez les destinations les plus demand\u00E9es par nos voyageurs'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Destinations populaires'>;
  };
}

export interface PagePopularRoutes extends Struct.ComponentSchema {
  collectionName: 'components_page_popular_routes';
  info: {
    description: 'Section tableau des routes populaires';
    displayName: 'Routes Populaires';
    icon: 'pinMap';
  };
  attributes: {
    disclaimer: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<"Les prix peuvent varier selon la p\u00E9riode et la disponibilit\u00E9. R\u00E9servez \u00E0 l'avance pour b\u00E9n\u00E9ficier des meilleurs tarifs.">;
    routes: Schema.Attribute.Component<'page.route-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Routes populaires'>;
  };
}

export interface PagePromotionItem extends Struct.ComponentSchema {
  collectionName: 'components_page_promotion_items';
  info: {
    description: 'Carte promotionnelle avec image, titre et description';
    displayName: '\u00C9l\u00E9ment Promotion';
    icon: 'priceTag';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'earlybird',
        'seasonal',
        'route-specific',
        'volume',
        'student',
        'senior',
        'family',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'student'>;
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'ETUDIANT20'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'B\u00E9n\u00E9ficiez de 20% de r\u00E9duction sur tous vos voyages avec votre carte \u00E9tudiante valide.'>;
    discount: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<20>;
    discountedPrice: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<8000>;
    gridSize: Schema.Attribute.Enumeration<['small', 'large']> &
      Schema.Attribute.DefaultTo<'small'>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    imageUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop'>;
    isLimited: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isVIP: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    originalPrice: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<10000>;
    progress: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<65>;
    remaining: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<100>;
    route: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Antananarivo - Antsirabe'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'-20% sur tous vos voyages'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Promotion \u00C9tudiante'>;
    validUntil: Schema.Attribute.DateTime & Schema.Attribute.Required;
  };
}

export interface PagePromotionalContent extends Struct.ComponentSchema {
  collectionName: 'components_page_promotional_content';
  info: {
    description: 'Section pour afficher le contenu promotionnel avec images et descriptions';
    displayName: 'Contenu Promotionnel';
    icon: 'gift';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'background.default'>;
    callToAction: Schema.Attribute.Component<'page.call-to-action', false>;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'lg'>;
    promotions: Schema.Attribute.Component<'page.promotion-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Actualit\u00E9s et promotions'>;
  };
}

export interface PageRegionItem extends Struct.ComponentSchema {
  collectionName: 'components_page_region_items';
  info: {
    description: 'R\u00E9gion g\u00E9ographique avec villes';
    displayName: '\u00C9l\u00E9ment R\u00E9gion';
    icon: 'pinMap';
  };
  attributes: {
    cities: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<
        [
          {
            code: 'TMM';
            isActive: true;
            name: 'Toamasina';
            region: 'Atsinanana';
          },
          {
            code: 'FEN';
            isActive: true;
            name: 'F\u00E9n\u00E9rive-Est';
            region: 'Analanjirofo';
          },
          {
            code: 'WMR';
            isActive: true;
            name: 'Maroantsetra';
            region: 'Analanjirofo';
          },
        ]
      >;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'C\u00F4te Est'>;
    province: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Toamasina'>;
  };
}

export interface PageRouteItem extends Struct.ComponentSchema {
  collectionName: 'components_page_route_items';
  info: {
    description: '\u00C9l\u00E9ment de route individuel';
    displayName: '\u00C9l\u00E9ment Route';
    icon: 'car';
  };
  attributes: {
    comfort: Schema.Attribute.Enumeration<['Standard', 'Confort', 'VIP']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Standard'>;
    duration: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'3h'>;
    from: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Antananarivo'>;
    price: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<8000>;
    to: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Antsirabe'>;
  };
}

export interface PageSafetyMeasures extends Struct.ComponentSchema {
  collectionName: 'components_page_safety_measures';
  info: {
    description: 'Section des mesures de s\u00E9curit\u00E9 avec ic\u00F4ne, titre et description';
    displayName: 'Mesures de S\u00E9curit\u00E9';
    icon: 'shield';
  };
  attributes: {
    measures: Schema.Attribute.Component<'page.measure-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Nos mesures de s\u00E9curit\u00E9'>;
  };
}

export interface PageSafetyTips extends Struct.ComponentSchema {
  collectionName: 'components_page_safety_tips';
  info: {
    description: 'Section des conseils de s\u00E9curit\u00E9 avec liste de conseils';
    displayName: 'Conseils de S\u00E9curit\u00E9';
    icon: 'lightbulb';
  };
  attributes: {
    tips: Schema.Attribute.Component<'page.tip-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Conseils de s\u00E9curit\u00E9'>;
  };
}

export interface PageSectionReference extends Struct.ComponentSchema {
  collectionName: 'components_page_section_references';
  info: {
    description: 'R\u00E9f\u00E9rence vers des sections r\u00E9utilisables';
    displayName: 'R\u00E9f\u00E9rence de Section';
    icon: 'link';
  };
  options: {
    mainField: 'sectionTitle';
  };
  attributes: {
    sectionTitle: Schema.Attribute.Enumeration<
      [
        'Safety Measures',
        'Insurance Coverage',
        'Safety Tips',
        'Emergency Contacts',
        'FAQ Section',
        'About Us Section',
        'Popular Routes',
        'Current Promotions',
        'Help Center Section',
        'Service Types',
        'Contact Section',
        'Legal Content',
        'Destinations Grid',
        'Popular Destinations',
        'Customer Testimonials',
        'Why Choose Us',
        'Promotional Content',
        'Statistics Section',
        'Network Section',
        'Mission Section',
        'Values Section',
        'Booking Rules',
        'Additional Info',
        'Service Categories',
        'Loyalty Program',
        'Additional Services',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Statistics Section'>;
    sectionType: Schema.Attribute.Enumeration<
      [
        'page.safety-measures',
        'page.insurance-coverage',
        'page.safety-tips',
        'page.emergency-contacts',
        'page.faq-section',
        'page.about-us-section',
        'page.popular-routes',
        'page.current-promotions',
        'page.help-center-section',
        'page.service-types',
        'page.contact-section',
        'page.legal-content',
        'page.destinations-grid',
        'page.popular-destinations',
        'page.customer-testimonials',
        'page.why-choose-us',
        'page.promotional-content',
        'page.statistics-section',
        'page.network-section',
        'page.mission-section',
        'page.values-section',
        'page.booking-rules',
        'page.additional-info',
        'page.service-categories',
        'page.loyalty-program',
        'page.additional-services',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'page.statistics-section'>;
  };
}

export interface PageServiceCategories extends Struct.ComponentSchema {
  collectionName: 'components_page_service_categories';
  info: {
    description: 'Section affichant les cat\u00E9gories de services';
    displayName: 'Service Categories';
    icon: 'grid';
  };
  attributes: {
    categories: Schema.Attribute.Component<'page.service-category-info', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageServiceCategoryInfo extends Struct.ComponentSchema {
  collectionName: 'components_page_service_category_infos';
  info: {
    description: 'Une cat\u00E9gorie de services avec ic\u00F4ne et liste';
    displayName: 'Service Category Info';
    icon: 'apps';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Star'>;
    services: Schema.Attribute.Component<'page.service-category-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageServiceCategoryItem extends Struct.ComponentSchema {
  collectionName: 'components_page_service_category_items';
  info: {
    description: 'Un \u00E9l\u00E9ment de cat\u00E9gorie de service';
    displayName: 'Service Category Item';
    icon: 'star';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PageServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_page_service_items';
  info: {
    description: 'Service individuel avec tarification et fonctionnalit\u00E9s';
    displayName: '\u00C9l\u00E9ment Service';
    icon: 'briefcase';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
    features: Schema.Attribute.Component<'page.feature-item', true>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Transport Standard'>;
    price: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'\u00C0 partir de 8 000 Ar'>;
  };
}

export interface PageServiceTypes extends Struct.ComponentSchema {
  collectionName: 'components_page_service_types';
  info: {
    description: 'Cat\u00E9gories de services avec tarification et fonctionnalit\u00E9s';
    displayName: 'Types de Services';
    icon: 'server';
  };
  attributes: {
    services: Schema.Attribute.Component<'page.service-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Nos types de services'>;
  };
}

export interface PageStatisticItem extends Struct.ComponentSchema {
  collectionName: 'components_page_statistic_items';
  info: {
    description: 'Un \u00E9l\u00E9ment statistique avec valeur et libell\u00E9';
    displayName: '\u00C9l\u00E9ment Statistique';
    icon: 'chartBubble';
  };
  attributes: {
    color: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'white'>;
    icon: Schema.Attribute.Enumeration<
      [
        'Groups',
        'LocationOn',
        'DirectionsBus',
        'TrendingUp',
        'Star',
        'CheckCircle',
        'Security',
        'Speed',
      ]
    > &
      Schema.Attribute.DefaultTo<'Groups'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Voyageurs satisfaits'>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }> &
      Schema.Attribute.DefaultTo<'2M+'>;
  };
}

export interface PageStatisticsSection extends Struct.ComponentSchema {
  collectionName: 'components_page_statistics_sections';
  info: {
    description: "Affichage des statistiques de l'entreprise avec ic\u00F4nes";
    displayName: 'Section Statistiques';
    icon: 'chartBubble';
  };
  attributes: {
    statistics: Schema.Attribute.Component<'page.statistic-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Taxibrousse en chiffres'>;
  };
}

export interface PageTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_page_testimonial_items';
  info: {
    description: 'Un t\u00E9moignage individuel avec nom, localisation, note et commentaire';
    displayName: '\u00C9l\u00E9ment T\u00E9moignage';
    icon: 'message';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    avatarUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face'>;
    comment: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<"Excellent service ! J'ai voyag\u00E9 d'Antananarivo \u00E0 Antsirabe en toute s\u00E9curit\u00E9. Les si\u00E8ges sont confortables et le chauffeur tr\u00E8s professionnel.">;
    location: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Antananarivo'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Mialy Rakotoson'>;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
  };
}

export interface PageTextParagraph extends Struct.ComponentSchema {
  collectionName: 'components_page_text_paragraphs';
  info: {
    description: 'Composant paragraphe de texte';
    displayName: 'Paragraphe de Texte';
    icon: 'write';
  };
  attributes: {
    text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }> &
      Schema.Attribute.DefaultTo<"Taxibrousse est la plateforme de transport leader \u00E0 Madagascar, connectant les passagers avec des services de taxi-brousse fiables \u00E0 travers l'\u00EEle. Notre mission est de rendre le transport accessible, s\u00FBr et pratique pour tous les Malgaches.">;
  };
}

export interface PageTipItem extends Struct.ComponentSchema {
  collectionName: 'components_page_tip_items';
  info: {
    description: '\u00C9l\u00E9ment de conseil de s\u00E9curit\u00E9 individuel';
    displayName: '\u00C9l\u00E9ment Conseil';
    icon: 'check';
  };
  attributes: {
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'CheckCircle'>;
    text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'Arrivez \u00E0 la gare au moins 30 minutes avant le d\u00E9part'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Pr\u00E9parez votre trajet'>;
  };
}

export interface PageTravelDestinationItem extends Struct.ComponentSchema {
  collectionName: 'components_page_travel_destination_items';
  info: {
    description: 'Une destination de voyage avec image et informations';
    displayName: 'Travel Destination Item';
    icon: 'plane';
  };
  attributes: {
    city: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    country: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    gridSize: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.DefaultTo<'medium'>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface PageTravelDestinations extends Struct.ComponentSchema {
  collectionName: 'components_page_travel_destinations';
  info: {
    description: "Section de destinations de voyage avec grille d'images";
    displayName: 'Travel Destinations';
    icon: 'globe';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#f5f5f5'>;
    buttonText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    buttonUrl: Schema.Attribute.String;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'xl'>;
    destinations: Schema.Attribute.Component<
      'page.travel-destination-item',
      true
    > &
      Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PageTrustIndicatorItem extends Struct.ComponentSchema {
  collectionName: 'components_page_trust_indicator_items';
  info: {
    description: 'Un indicateur de confiance';
    displayName: 'Trust Indicator Item';
    icon: 'check-shield';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'VerifiedUser'>;
    link: Schema.Attribute.String;
    linkText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PageTrustIndicators extends Struct.ComponentSchema {
  collectionName: 'components_page_trust_indicators';
  info: {
    description: 'Indicateurs de confiance et garanties';
    displayName: 'Trust Indicators';
    icon: 'shield-check';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'lg'>;
    indicators: Schema.Attribute.Component<'page.trust-indicator-item', true> &
      Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['horizontal', 'vertical', 'grid']> &
      Schema.Attribute.DefaultTo<'horizontal'>;
    showBorder: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PageValueItem extends Struct.ComponentSchema {
  collectionName: 'components_page_value_items';
  info: {
    description: "Valeur de l'entreprise avec ic\u00F4ne et description";
    displayName: '\u00C9l\u00E9ment Valeur';
    icon: 'heart';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'La s\u00E9curit\u00E9 de nos passagers est notre priorit\u00E9 absolue'>;
    icon: Schema.Attribute.Enumeration<
      [
        'Security',
        'Speed',
        'Favorite',
        'LocationOn',
        'Groups',
        'DirectionsBus',
        'TrendingUp',
        'Star',
        'CheckCircle',
        'Verified',
      ]
    > &
      Schema.Attribute.DefaultTo<'Security'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'S\u00E9curit\u00E9'>;
  };
}

export interface PageValuesSection extends Struct.ComponentSchema {
  collectionName: 'components_page_values_sections';
  info: {
    description: "Affichage des valeurs de l'entreprise";
    displayName: 'Section Valeurs';
    icon: 'star';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Nos Valeurs'>;
    values: Schema.Attribute.Component<'page.value-item', true>;
  };
}

export interface PageWhyChooseUs extends Struct.ComponentSchema {
  collectionName: 'components_page_why_choose_us';
  info: {
    description: 'Section pr\u00E9sentant les avantages et caract\u00E9ristiques uniques du service';
    displayName: 'Pourquoi Nous Choisir';
    icon: 'crown';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'background.default'>;
    containerMaxWidth: Schema.Attribute.Enumeration<
      ['xs', 'sm', 'md', 'lg', 'xl']
    > &
      Schema.Attribute.DefaultTo<'lg'>;
    features: Schema.Attribute.Component<'page.feature-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      >;
    showStatistics: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    statistics: Schema.Attribute.Component<'page.statistic-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<"Plus de 25 ans d'exp\u00E9rience au service des voyageurs malgaches">;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Pourquoi choisir Taxibrousse ?'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'page.about-us-section': PageAboutUsSection;
      'page.accident-instruction-item': PageAccidentInstructionItem;
      'page.accident-instructions': PageAccidentInstructions;
      'page.additional-info': PageAdditionalInfo;
      'page.additional-info-item': PageAdditionalInfoItem;
      'page.additional-service-item': PageAdditionalServiceItem;
      'page.additional-services': PageAdditionalServices;
      'page.attraction-item': PageAttractionItem;
      'page.benefit-item': PageBenefitItem;
      'page.benefits-showcase': PageBenefitsShowcase;
      'page.booking-rule-item': PageBookingRuleItem;
      'page.booking-rules': PageBookingRules;
      'page.call-to-action': PageCallToAction;
      'page.contact-item': PageContactItem;
      'page.contact-method': PageContactMethod;
      'page.contact-section': PageContactSection;
      'page.current-promotions': PageCurrentPromotions;
      'page.customer-testimonials': PageCustomerTestimonials;
      'page.destination-item': PageDestinationItem;
      'page.destinations-grid': PageDestinationsGrid;
      'page.emergency-contacts': PageEmergencyContacts;
      'page.faq-item': PageFaqItem;
      'page.faq-section': PageFaqSection;
      'page.feature-item': PageFeatureItem;
      'page.help-article': PageHelpArticle;
      'page.help-category': PageHelpCategory;
      'page.help-center-section': PageHelpCenterSection;
      'page.insurance-coverage': PageInsuranceCoverage;
      'page.insurance-type': PageInsuranceType;
      'page.legal-content': PageLegalContent;
      'page.legal-section': PageLegalSection;
      'page.loyalty-benefit': PageLoyaltyBenefit;
      'page.loyalty-level': PageLoyaltyLevel;
      'page.loyalty-program': PageLoyaltyProgram;
      'page.measure-item': PageMeasureItem;
      'page.mission-section': PageMissionSection;
      'page.network-section': PageNetworkSection;
      'page.news-item': PageNewsItem;
      'page.news-section': PageNewsSection;
      'page.overall-rating': PageOverallRating;
      'page.page-header': PagePageHeader;
      'page.payment-section': PagePaymentSection;
      'page.popular-destinations': PagePopularDestinations;
      'page.popular-routes': PagePopularRoutes;
      'page.promotion-item': PagePromotionItem;
      'page.promotional-content': PagePromotionalContent;
      'page.region-item': PageRegionItem;
      'page.route-item': PageRouteItem;
      'page.safety-measures': PageSafetyMeasures;
      'page.safety-tips': PageSafetyTips;
      'page.section-reference': PageSectionReference;
      'page.service-categories': PageServiceCategories;
      'page.service-category-info': PageServiceCategoryInfo;
      'page.service-category-item': PageServiceCategoryItem;
      'page.service-item': PageServiceItem;
      'page.service-types': PageServiceTypes;
      'page.statistic-item': PageStatisticItem;
      'page.statistics-section': PageStatisticsSection;
      'page.testimonial-item': PageTestimonialItem;
      'page.text-paragraph': PageTextParagraph;
      'page.tip-item': PageTipItem;
      'page.travel-destination-item': PageTravelDestinationItem;
      'page.travel-destinations': PageTravelDestinations;
      'page.trust-indicator-item': PageTrustIndicatorItem;
      'page.trust-indicators': PageTrustIndicators;
      'page.value-item': PageValueItem;
      'page.values-section': PageValuesSection;
      'page.why-choose-us': PageWhyChooseUs;
    }
  }
}
