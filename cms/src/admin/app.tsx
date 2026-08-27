import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'fr',
      'en',
    ],
    app: {
      name: 'Taxibrousse',
    },
    translations: {
      fr: {
        // Page Header
        'content-manager.components.page.page-header.title': 'Titre',
        'content-manager.components.page.page-header.subtitle': 'Sous-titre',
        'content-manager.components.page.page-header.alertType': 'Type d\'alerte',
        'content-manager.components.page.page-header.alertTitle': 'Titre de l\'alerte',
        'content-manager.components.page.page-header.alertMessage': 'Message d\'alerte',

        // Call to Action
        'content-manager.components.page.call-to-action.title': 'Titre',
        'content-manager.components.page.call-to-action.description': 'Description',
        'content-manager.components.page.call-to-action.buttonText': 'Texte du bouton',
        'content-manager.components.page.call-to-action.buttonUrl': 'URL du bouton',
        'content-manager.components.page.call-to-action.buttonVariant': 'Variante du bouton',
        'content-manager.components.page.call-to-action.buttonColor': 'Couleur du bouton',
        'content-manager.components.page.call-to-action.buttonIcon': 'Icône du bouton',
        'content-manager.components.page.call-to-action.backgroundColor': 'Couleur de fond',

        // About Us Section
        'content-manager.components.page.about-us-section.title': 'Titre',
        'content-manager.components.page.about-us-section.paragraphs': 'Paragraphes',

        // Text Paragraph
        'content-manager.components.page.text-paragraph.text': 'Texte',

        // Attraction Item
        'content-manager.components.page.attraction-item.name': 'Nom',

        // Contact Item
        'content-manager.components.page.contact-item.name': 'Nom',
        'content-manager.components.page.contact-item.number': 'Numéro',
        'content-manager.components.page.contact-item.available': 'Disponibilité',

        // Contact Method
        'content-manager.components.page.contact-method.label': 'Libellé',
        'content-manager.components.page.contact-method.value': 'Valeur',
        'content-manager.components.page.contact-method.type': 'Type',

        // Contact Section
        'content-manager.components.page.contact-section.title': 'Titre',
        'content-manager.components.page.contact-section.description': 'Description',
        'content-manager.components.page.contact-section.contactMethods': 'Méthodes de contact',

        // Current Promotions
        'content-manager.components.page.current-promotions.title': 'Titre',
        'content-manager.components.page.current-promotions.promotions': 'Promotions',

        // Promotion Item
        'content-manager.components.page.promotion-item.title': 'Titre',
        'content-manager.components.page.promotion-item.subtitle': 'Sous-titre',
        'content-manager.components.page.promotion-item.description': 'Description',
        'content-manager.components.page.promotion-item.discount': 'Réduction',
        'content-manager.components.page.promotion-item.originalPrice': 'Prix original',
        'content-manager.components.page.promotion-item.discountedPrice': 'Prix réduit',
        'content-manager.components.page.promotion-item.validUntil': 'Valide jusqu\'au',
        'content-manager.components.page.promotion-item.image': 'Image',
        'content-manager.components.page.promotion-item.code': 'Code promo',
        'content-manager.components.page.promotion-item.route': 'Itinéraire',
        'content-manager.components.page.promotion-item.isLimited': 'Offre limitée',
        'content-manager.components.page.promotion-item.remaining': 'Places restantes',
        'content-manager.components.page.promotion-item.category': 'Catégorie',
        'content-manager.components.page.promotion-item.isVIP': 'Offre VIP',
        'content-manager.components.page.promotion-item.progress': 'Progression',
        'content-manager.components.page.promotion-item.imageUrl': 'URL de l\'image',
        'content-manager.components.page.promotion-item.gridSize': 'Taille de la grille',
        'content-manager.components.page.promotion-item.order': 'Ordre d\'affichage',

        // Destination Item
        'content-manager.components.page.destination-item.route': 'Itinéraire',
        'content-manager.components.page.destination-item.region': 'Région',
        'content-manager.components.page.destination-item.description': 'Description',
        'content-manager.components.page.destination-item.image': 'Image',
        'content-manager.components.page.destination-item.duration': 'Durée',
        'content-manager.components.page.destination-item.attractions': 'Attractions',
        'content-manager.components.page.destination-item.category': 'Catégorie',
        'content-manager.components.page.destination-item.popularity': 'Popularité',
        'content-manager.components.page.destination-item.frequency': 'Fréquence',
        'content-manager.components.page.destination-item.price': 'Prix',
        'content-manager.components.page.destination-item.imageUrl': 'URL de l\'image',

        // Customer Testimonials
        'content-manager.components.page.customer-testimonials.title': 'Titre',
        'content-manager.components.page.customer-testimonials.subtitle': 'Sous-titre',
        'content-manager.components.page.customer-testimonials.testimonials': 'Témoignages',
        'content-manager.components.page.customer-testimonials.overallRating': 'Note globale',
        'content-manager.components.page.customer-testimonials.backgroundColor': 'Couleur de fond',
        'content-manager.components.page.customer-testimonials.containerMaxWidth': 'Largeur maximale',

        // Testimonial Item
        'content-manager.components.page.testimonial-item.name': 'Nom',
        'content-manager.components.page.testimonial-item.location': 'Localisation',
        'content-manager.components.page.testimonial-item.rating': 'Note',
        'content-manager.components.page.testimonial-item.comment': 'Commentaire',
        'content-manager.components.page.testimonial-item.avatar': 'Avatar',
        'content-manager.components.page.testimonial-item.avatarUrl': 'URL de l\'avatar',

        // Overall Rating
        'content-manager.components.page.overall-rating.title': 'Titre',
        'content-manager.components.page.overall-rating.averageRating': 'Note moyenne',
        'content-manager.components.page.overall-rating.totalReviews': 'Nombre total d\'avis',
        'content-manager.components.page.overall-rating.recommendation': 'Recommandation (%)',

        // Popular Destinations
        'content-manager.components.page.popular-destinations.title': 'Titre',
        'content-manager.components.page.popular-destinations.subtitle': 'Sous-titre',
        'content-manager.components.page.popular-destinations.destinations': 'Destinations',
        'content-manager.components.page.popular-destinations.backgroundColor': 'Couleur de fond',
        'content-manager.components.page.popular-destinations.containerMaxWidth': 'Largeur maximale',

        // Promotional Content
        'content-manager.components.page.promotional-content.title': 'Titre',
        'content-manager.components.page.promotional-content.promotions': 'Promotions',
        'content-manager.components.page.promotional-content.callToAction': 'Appel à l\'action',
        'content-manager.components.page.promotional-content.backgroundColor': 'Couleur de fond',
        'content-manager.components.page.promotional-content.containerMaxWidth': 'Largeur maximale',

        // Why Choose Us
        'content-manager.components.page.why-choose-us.title': 'Titre',
        'content-manager.components.page.why-choose-us.subtitle': 'Sous-titre',
        'content-manager.components.page.why-choose-us.features': 'Fonctionnalités',
        'content-manager.components.page.why-choose-us.statistics': 'Statistiques',
        'content-manager.components.page.why-choose-us.showStatistics': 'Afficher les statistiques',
        'content-manager.components.page.why-choose-us.backgroundColor': 'Couleur de fond',
        'content-manager.components.page.why-choose-us.containerMaxWidth': 'Largeur maximale',

        // Statistic Item
        'content-manager.components.page.statistic-item.value': 'Valeur',
        'content-manager.components.page.statistic-item.label': 'Libellé',
        'content-manager.components.page.statistic-item.color': 'Couleur',

        // Page Header (nouveaux champs)
        'content-manager.components.page.page-header.description': 'Description',

        // Destinations Grid
        'content-manager.components.page.destinations-grid.title': 'Titre',
        'content-manager.components.page.destinations-grid.destinations': 'Destinations',

        // Emergency Contacts
        'content-manager.components.page.emergency-contacts.title': 'Titre',
        'content-manager.components.page.emergency-contacts.contacts': 'Contacts',

        // FAQ Item
        'content-manager.components.page.faq-item.question': 'Question',
        'content-manager.components.page.faq-item.answer': 'Réponse',

        // FAQ Section
        'content-manager.components.page.faq-section.title': 'Titre',
        'content-manager.components.page.faq-section.faqs': 'Questions fréquentes',

        // Feature Item
        'content-manager.components.page.feature-item.title': 'Titre',
        'content-manager.components.page.feature-item.description': 'Description',
        'content-manager.components.page.feature-item.icon': 'Icône',
        'content-manager.components.page.feature-item.color': 'Couleur',

        // Help Article
        'content-manager.components.page.help-article.title': 'Titre',
        'content-manager.components.page.help-article.content': 'Contenu',
        'content-manager.components.page.help-article.url': 'URL',

        // Help Category
        'content-manager.components.page.help-category.name': 'Nom',
        'content-manager.components.page.help-category.description': 'Description',
        'content-manager.components.page.help-category.icon': 'Icône',
        'content-manager.components.page.help-category.articles': 'Articles',

        // Help Center Section
        'content-manager.components.page.help-center-section.title': 'Titre',
        'content-manager.components.page.help-center-section.categories': 'Catégories',

        // Insurance Type
        'content-manager.components.page.insurance-type.name': 'Nom',
        'content-manager.components.page.insurance-type.description': 'Description',
        'content-manager.components.page.insurance-type.coverage': 'Couverture',
        'content-manager.components.page.insurance-type.included': 'Inclus',
        'content-manager.components.page.insurance-type.price': 'Prix',

        // Insurance Coverage
        'content-manager.components.page.insurance-coverage.title': 'Titre',
        'content-manager.components.page.insurance-coverage.insuranceTypes': 'Types d\'assurance',

        // Legal Section
        'content-manager.components.page.legal-section.title': 'Titre',
        'content-manager.components.page.legal-section.content': 'Contenu',

        // Legal Content
        'content-manager.components.page.legal-content.title': 'Titre',
        'content-manager.components.page.legal-content.sections': 'Sections',

        // Measure Item
        'content-manager.components.page.measure-item.icon': 'Icône',
        'content-manager.components.page.measure-item.title': 'Titre',
        'content-manager.components.page.measure-item.description': 'Description',

        // Popular Routes
        'content-manager.components.page.popular-routes.title': 'Titre',
        'content-manager.components.page.popular-routes.routes': 'Itinéraires',
        'content-manager.components.page.popular-routes.disclaimer': 'Avertissement',

        // Route Item
        'content-manager.components.page.route-item.from': 'De',
        'content-manager.components.page.route-item.to': 'À',
        'content-manager.components.page.route-item.price': 'Prix',
        'content-manager.components.page.route-item.duration': 'Durée',
        'content-manager.components.page.route-item.comfort': 'Confort',

        // Safety Measures
        'content-manager.components.page.safety-measures.title': 'Titre',
        'content-manager.components.page.safety-measures.measures': 'Mesures',

        // Safety Tips
        'content-manager.components.page.safety-tips.title': 'Titre',
        'content-manager.components.page.safety-tips.tips': 'Conseils',

        // Tip Item
        'content-manager.components.page.tip-item.title': 'Titre',
        'content-manager.components.page.tip-item.text': 'Texte',

        // Service Item
        'content-manager.components.page.service-item.name': 'Nom',
        'content-manager.components.page.service-item.price': 'Prix',
        'content-manager.components.page.service-item.features': 'Caractéristiques',
        'content-manager.components.page.service-item.color': 'Couleur',

        // Service Types
        'content-manager.components.page.service-types.title': 'Titre',
        'content-manager.components.page.service-types.services': 'Services',

        // Region Item
        'content-manager.components.page.region-item.name': 'Nom',
        'content-manager.components.page.region-item.province': 'Province',
        'content-manager.components.page.region-item.cities': 'Villes',

        // Network Section
        'content-manager.components.page.network-section.title': 'Titre',
        'content-manager.components.page.network-section.description': 'Description',
        'content-manager.components.page.network-section.regions': 'Régions',

        // Mission Section
        'content-manager.components.page.mission-section.title': 'Titre',
        'content-manager.components.page.mission-section.tagline': 'Slogan',
        'content-manager.components.page.mission-section.description': 'Description',

        // Values Section
        'content-manager.components.page.values-section.title': 'Titre',
        'content-manager.components.page.values-section.values': 'Valeurs',

        // Value Item
        'content-manager.components.page.value-item.title': 'Titre',
        'content-manager.components.page.value-item.description': 'Description',
        'content-manager.components.page.value-item.icon': 'Icône',

        // Statistics Section
        'content-manager.components.page.statistics-section.title': 'Titre',
        'content-manager.components.page.statistics-section.statistics': 'Statistiques',

        // Section Reference
        'content-manager.components.page.section-reference.sectionTitle': 'Titre de la section',
        'content-manager.components.page.section-reference.sectionType': 'Type de section',

        // Payment Section
        'content-manager.components.page.payment-section.title': 'Titre',
        'content-manager.components.page.payment-section.description': 'Description',
        'content-manager.components.page.payment-section.buttonText': 'Texte du bouton',
        'content-manager.components.page.payment-section.buttonUrl': 'URL du bouton',
        'content-manager.components.page.payment-section.backgroundColor': 'Couleur de fond',
        'content-manager.components.page.payment-section.paymentMethods': 'Méthodes de paiement',

        // Booking Rules
        'content-manager.components.page.booking-rules.title': 'Titre',
        'content-manager.components.page.booking-rules.rules': 'Règles',

        // Booking Rule Item
        'content-manager.components.page.booking-rule-item.icon': 'Icône',
        'content-manager.components.page.booking-rule-item.title': 'Titre',
        'content-manager.components.page.booking-rule-item.description': 'Description',

        // Additional Info
        'content-manager.components.page.additional-info.title': 'Titre',
        'content-manager.components.page.additional-info.alertType': 'Type d\'alerte',
        'content-manager.components.page.additional-info.alertMessage': 'Message d\'alerte',
        'content-manager.components.page.additional-info.items': 'Éléments',

        // Additional Info Item
        'content-manager.components.page.additional-info-item.icon': 'Icône',
        'content-manager.components.page.additional-info-item.label': 'Libellé',
        'content-manager.components.page.additional-info-item.text': 'Texte',

        // Additional Services
        'content-manager.components.page.additional-services.title': 'Titre',
        'content-manager.components.page.additional-services.services': 'Services',

        // Additional Service Item
        'content-manager.components.page.additional-service-item.icon': 'Icône',
        'content-manager.components.page.additional-service-item.title': 'Titre',
        'content-manager.components.page.additional-service-item.description': 'Description',

        // Loyalty Program
        'content-manager.components.page.loyalty-program.title': 'Titre',
        'content-manager.components.page.loyalty-program.programName': 'Nom du programme',
        'content-manager.components.page.loyalty-program.description': 'Description',
        'content-manager.components.page.loyalty-program.levels': 'Niveaux',

        // Loyalty Level
        'content-manager.components.page.loyalty-level.name': 'Nom',
        'content-manager.components.page.loyalty-level.trips': 'Voyages',
        'content-manager.components.page.loyalty-level.color': 'Couleur',
        'content-manager.components.page.loyalty-level.highlighted': 'Mis en avant',
        'content-manager.components.page.loyalty-level.benefits': 'Avantages',

        // Loyalty Benefit
        'content-manager.components.page.loyalty-benefit.text': 'Texte',

        // Service Categories
        'content-manager.components.page.service-categories.title': 'Titre',
        'content-manager.components.page.service-categories.categories': 'Catégories',

        // Service Category Info
        'content-manager.components.page.service-category-info.title': 'Titre',
        'content-manager.components.page.service-category-info.icon': 'Icône',
        'content-manager.components.page.service-category-info.color': 'Couleur',
        'content-manager.components.page.service-category-info.services': 'Services',

        // Service Category Item
        'content-manager.components.page.service-category-item.text': 'Texte',

        // Simple Search
        'content-manager.components.page.simple-search.title': 'Titre',
        'content-manager.components.page.simple-search.subtitle': 'Sous-titre',
        'content-manager.components.page.simple-search.description': 'Description',
        'content-manager.components.page.simple-search.image': 'Image',

        // Hero Banner
        'content-manager.content-types.api::hero-content.hero-content.Title': 'Titre',
        'content-manager.content-types.api::hero-content.hero-content.SubTitle': 'Sous-titre',
        'content-manager.content-types.api::hero-content.hero-content.Destination': 'Destination',
        'content-manager.content-types.api::hero-content.hero-content.Description': 'Description',
        'content-manager.content-types.api::hero-content.hero-content.Image': 'Image',

        // Gare Banner
        'content-manager.content-types.api::gare-banner.gare-banner.Title': 'Titre',
        'content-manager.content-types.api::gare-banner.gare-banner.SubTitle': 'Sous-titre',
        'content-manager.content-types.api::gare-banner.gare-banner.Localisation': 'Localisation',
        'content-manager.content-types.api::gare-banner.gare-banner.Description': 'Description',
        'content-manager.content-types.api::gare-banner.gare-banner.Image': 'Image',

        // Koperative Banner
        'content-manager.content-types.api::koperative-banner.koperative-banner.Title': 'Titre',
        'content-manager.content-types.api::koperative-banner.koperative-banner.SubTitle': 'Sous-titre',
        'content-manager.content-types.api::koperative-banner.koperative-banner.Localisation': 'Localisation',
        'content-manager.content-types.api::koperative-banner.koperative-banner.Description': 'Description',
        'content-manager.content-types.api::koperative-banner.koperative-banner.Image': 'Image',

        // Promotion Banner
        'content-manager.content-types.api::promotion-banner.promotion-banner.Title': 'Titre',
        'content-manager.content-types.api::promotion-banner.promotion-banner.SubTitle': 'Sous-titre',
        'content-manager.content-types.api::promotion-banner.promotion-banner.Image': 'Image',
        'content-manager.content-types.api::promotion-banner.promotion-banner.Active': 'Actif',

        // Ville
        'content-manager.content-types.api::ville.ville.name': 'Nom',
        'content-manager.content-types.api::ville.ville.region': 'Région',
        'content-manager.content-types.api::ville.ville.province': 'Province',
        'content-manager.content-types.api::ville.ville.code': 'Code',
        'content-manager.content-types.api::ville.ville.isActive': 'Actif',
        'content-manager.content-types.api::ville.ville.rn': 'Route Nationale',
        'content-manager.content-types.api::ville.ville.frequence': 'Fréquence',
        'content-manager.content-types.api::ville.ville.fokotanies': 'Fokotany',

        // Fokotany
        'content-manager.content-types.api::fokotany.fokotany.commune': 'Commune',
        'content-manager.content-types.api::fokotany.fokotany.fokontany': 'Fokontany',
        'content-manager.content-types.api::fokotany.fokotany.ville': 'Ville',



        // Classe
        'content-manager.content-types.api::classe.classe.name': 'Nom',
        'content-manager.content-types.api::classe.classe.description': 'Description',
        'content-manager.content-types.api::classe.classe.koperative': 'Coopérative',
        'content-manager.content-types.api::classe.classe.iconId': 'Icône (ID Cloudinary)',
        'content-manager.content-types.api::classe.classe.reservations': 'Réservations',

        // Gare
        'content-manager.content-types.api::gare.gare.name': 'Nom',
        'content-manager.content-types.api::gare.gare.address': 'Adresse',
        'content-manager.content-types.api::gare.gare.ville': 'Ville',
        'content-manager.content-types.api::gare.gare.description': 'Description',
        'content-manager.content-types.api::gare.gare.isClosed': 'Fermée',
        'content-manager.content-types.api::gare.gare.frequence': 'Fréquence',
        'content-manager.content-types.api::gare.gare.guichets': 'Guichets',

        // Hotel
        'content-manager.content-types.api::hotel.hotel.name': 'Nom',
        'content-manager.content-types.api::hotel.hotel.ville': 'Ville',
        'content-manager.content-types.api::hotel.hotel.address': 'Adresse',
        'content-manager.content-types.api::hotel.hotel.phone': 'Téléphone',
        'content-manager.content-types.api::hotel.hotel.email': 'Email',
        'content-manager.content-types.api::hotel.hotel.rating': 'Note',
        'content-manager.content-types.api::hotel.hotel.amenities': 'Équipements',
        'content-manager.content-types.api::hotel.hotel.isActive': 'Actif',

        // Koperative
        'content-manager.content-types.api::koperative.koperative.name': 'Nom',
        'content-manager.content-types.api::koperative.koperative.slug': 'Slug',
        'content-manager.content-types.api::koperative.koperative.description': 'Description',
        'content-manager.content-types.api::koperative.koperative.address': 'Adresse',
        'content-manager.content-types.api::koperative.koperative.phone': 'Téléphone',
        'content-manager.content-types.api::koperative.koperative.email': 'Email',
        'content-manager.content-types.api::koperative.koperative.registrationNumber': 'N° d\'immatriculation',
        'content-manager.content-types.api::koperative.koperative.taxId': 'NIF',
        'content-manager.content-types.api::koperative.koperative.website': 'Site web',
        'content-manager.content-types.api::koperative.koperative.logoUrl': 'URL du logo',
        'content-manager.content-types.api::koperative.koperative.status': 'Statut',
        'content-manager.content-types.api::koperative.koperative.type': 'Type',
        'content-manager.content-types.api::koperative.koperative.proprietaireId': 'Propriétaire (ID)',
        'content-manager.content-types.api::koperative.koperative.guichets': 'Guichets',
        'content-manager.content-types.api::koperative.koperative.crafters': 'Véhicules',
        'content-manager.content-types.api::koperative.koperative.chauffeurs': 'Chauffeurs',
        'content-manager.content-types.api::koperative.koperative.contrats': 'Contrats',
        'content-manager.content-types.api::koperative.koperative.voyages': 'Voyages',
        'content-manager.content-types.api::koperative.koperative.villes': 'Villes desservies',
        'content-manager.content-types.api::koperative.koperative.classes': 'Classes',

        // Route
        'content-manager.content-types.api::route.route.name': 'Nom',
        'content-manager.content-types.api::route.route.departureGare': 'Gare de départ',
        'content-manager.content-types.api::route.route.arrivalGare': 'Gare d\'arrivée',
        'content-manager.content-types.api::route.route.estimatedDurationHours': 'Durée estimée (h)',
        'content-manager.content-types.api::route.route.distanceKm': 'Distance (km)',
        'content-manager.content-types.api::route.route.fraisTaxibrousse': 'Frais Taxibrousse',
        'content-manager.content-types.api::route.route.fraisKoperative': 'Frais Coopérative',
        'content-manager.content-types.api::route.route.description': 'Description',
        'content-manager.content-types.api::route.route.isActive': 'Actif',
        'content-manager.content-types.api::route.route.routeStops': 'Arrêts',
        'content-manager.content-types.api::route.route.voyages': 'Voyages',

        // Route Stop
        'content-manager.content-types.api::route-stop.route-stop.route': 'Route',
        'content-manager.content-types.api::route-stop.route-stop.ville': 'Ville',
        'content-manager.content-types.api::route-stop.route-stop.gare': 'Gare',
        'content-manager.content-types.api::route-stop.route-stop.stopOrder': 'Ordre d\'arrêt',
        'content-manager.content-types.api::route-stop.route-stop.estimatedArrival': 'Arrivée estimée',
        'content-manager.content-types.api::route-stop.route-stop.estimatedDeparture': 'Départ estimé',
        'content-manager.content-types.api::route-stop.route-stop.isMandatory': 'Obligatoire',

        // Voyage
        'content-manager.content-types.api::voyage.voyage.koperative': 'Coopérative',
        'content-manager.content-types.api::voyage.voyage.route': 'Route',
        'content-manager.content-types.api::voyage.voyage.departureGare': 'Gare de départ',
        'content-manager.content-types.api::voyage.voyage.arrivalGare': 'Gare d\'arrivée',
        'content-manager.content-types.api::voyage.voyage.crafter': 'Véhicule',
        'content-manager.content-types.api::voyage.voyage.chauffeur': 'Chauffeur',
        'content-manager.content-types.api::voyage.voyage.departureTime': 'Heure de départ',
        'content-manager.content-types.api::voyage.voyage.estimatedArrivalTime': 'Arrivée estimée',
        'content-manager.content-types.api::voyage.voyage.actualArrivalTime': 'Arrivée réelle',
        'content-manager.content-types.api::voyage.voyage.availableSeats': 'Places disponibles',
        'content-manager.content-types.api::voyage.voyage.pricePerSeat': 'Prix par siège',
        'content-manager.content-types.api::voyage.voyage.status': 'Statut',
        'content-manager.content-types.api::voyage.voyage.description': 'Description',
        'content-manager.content-types.api::voyage.voyage.recurrenceType': 'Type de récurrence',
        'content-manager.content-types.api::voyage.voyage.customInterval': 'Intervalle personnalisé (j)',
        'content-manager.content-types.api::voyage.voyage.weekdays': 'Jours de semaine',
        'content-manager.content-types.api::voyage.voyage.monthlyDates': 'Dates mensuelles',
        'content-manager.content-types.api::voyage.voyage.recurrenceStartDate': 'Début de récurrence',
        'content-manager.content-types.api::voyage.voyage.recurrenceEndDate': 'Fin de récurrence',
        'content-manager.content-types.api::voyage.voyage.isTemplate': 'Modèle',
        'content-manager.content-types.api::voyage.voyage.parentTemplate': 'Modèle parent',
        'content-manager.content-types.api::voyage.voyage.generatedInstances': 'Instances générées',
        'content-manager.content-types.api::voyage.voyage.classe': 'Classe',
        'content-manager.content-types.api::voyage.voyage.reservations': 'Réservations',
        'content-manager.content-types.api::voyage.voyage.seats': 'Sièges',

        // Crafter
        'content-manager.content-types.api::crafter.crafter.registrationNumber': 'Immatriculation',
        'content-manager.content-types.api::crafter.crafter.model': 'Modèle',
        'content-manager.content-types.api::crafter.crafter.kilometrage': 'Kilométrage',
        'content-manager.content-types.api::crafter.crafter.seatCapacity': 'Capacité (sièges)',
        'content-manager.content-types.api::crafter.crafter.configName': 'Config. sièges',
        'content-manager.content-types.api::crafter.crafter.seatConfig': 'Config. JSON sièges',
        'content-manager.content-types.api::crafter.crafter.koperative': 'Coopérative',
        'content-manager.content-types.api::crafter.crafter.chauffeur': 'Chauffeur',
        'content-manager.content-types.api::crafter.crafter.isActive': 'Actif',
        'content-manager.content-types.api::crafter.crafter.dateVisite': 'Date de visite technique',
        'content-manager.content-types.api::crafter.crafter.seats': 'Sièges',

        // Moto
        'content-manager.content-types.api::moto.moto.registrationNumber': 'Immatriculation',
        'content-manager.content-types.api::moto.moto.model': 'Modèle',
        'content-manager.content-types.api::moto.moto.yearManufactured': 'Année de fabrication',
        'content-manager.content-types.api::moto.moto.chauffeur': 'Chauffeur',
        'content-manager.content-types.api::moto.moto.isActive': 'Actif',
        'content-manager.content-types.api::moto.moto.lastMaintenance': 'Dernière maintenance',

        // Chauffeur
        'content-manager.content-types.api::chauffeur.chauffeur.userId': 'Utilisateur (ID)',
        'content-manager.content-types.api::chauffeur.chauffeur.licenseNumber': 'N° de permis',
        'content-manager.content-types.api::chauffeur.chauffeur.licenseAuthority': 'Autorité délivrant le permis',
        'content-manager.content-types.api::chauffeur.chauffeur.licenseExpiry': 'Expiration du permis',
        'content-manager.content-types.api::chauffeur.chauffeur.experienceYears': 'Années d\'expérience',
        'content-manager.content-types.api::chauffeur.chauffeur.rating': 'Note',
        'content-manager.content-types.api::chauffeur.chauffeur.isAvailable': 'Disponible',
        'content-manager.content-types.api::chauffeur.chauffeur.koperative': 'Coopérative',
        'content-manager.content-types.api::chauffeur.chauffeur.crafterAssigned': 'Véhicules assignés',
        'content-manager.content-types.api::chauffeur.chauffeur.motos': 'Motos',
        'content-manager.content-types.api::chauffeur.chauffeur.contrats': 'Contrats',
        'content-manager.content-types.api::chauffeur.chauffeur.voyages': 'Voyages',

        // Réservation
        'content-manager.content-types.api::reservation.reservation.voyage': 'Voyage',
        'content-manager.content-types.api::reservation.reservation.voyageurId': 'Voyageur (ID)',
        'content-manager.content-types.api::reservation.reservation.classe': 'Classe',
        'content-manager.content-types.api::reservation.reservation.bookingReference': 'Référence de réservation',
        'content-manager.content-types.api::reservation.reservation.status': 'Statut',
        'content-manager.content-types.api::reservation.reservation.bookingDate': 'Date de réservation',
        'content-manager.content-types.api::reservation.reservation.totalAmount': 'Montant total',
        'content-manager.content-types.api::reservation.reservation.notes': 'Notes',
        'content-manager.content-types.api::reservation.reservation.seats': 'Sièges',
        'content-manager.content-types.api::reservation.reservation.facturation': 'Facturation',

        // Siège
        'content-manager.content-types.api::seat.seat.voyage': 'Voyage',
        'content-manager.content-types.api::seat.seat.crafter': 'Véhicule',
        'content-manager.content-types.api::seat.seat.seatNumber': 'N° de siège',
        'content-manager.content-types.api::seat.seat.seatStatus': 'Statut du siège',
        'content-manager.content-types.api::seat.seat.reservation': 'Réservation',
        'content-manager.content-types.api::seat.seat.position': 'Position',
        'content-manager.content-types.api::seat.seat.notes': 'Notes',

        // Facturation
        'content-manager.content-types.api::facturation.facturation.reservation': 'Réservation',
        'content-manager.content-types.api::facturation.facturation.invoiceNumber': 'N° de facture',
        'content-manager.content-types.api::facturation.facturation.amount': 'Montant HT',
        'content-manager.content-types.api::facturation.facturation.taxAmount': 'TVA',
        'content-manager.content-types.api::facturation.facturation.totalAmount': 'Montant TTC',
        'content-manager.content-types.api::facturation.facturation.remainingAmount': 'Reste à payer',
        'content-manager.content-types.api::facturation.facturation.paymentMethodIdentifier': 'Mode de paiement',
        'content-manager.content-types.api::facturation.facturation.paymentReference': 'Référence de paiement',
        'content-manager.content-types.api::facturation.facturation.paymentStatus': 'Statut du paiement',
        'content-manager.content-types.api::facturation.facturation.paymentDate': 'Date de paiement',
        'content-manager.content-types.api::facturation.facturation.dueDate': 'Date d\'échéance',

        // Colis
        'content-manager.content-types.api::colis.colis.senderName': 'Nom de l\'expéditeur',
        'content-manager.content-types.api::colis.colis.senderPhone': 'Tél. expéditeur',
        'content-manager.content-types.api::colis.colis.recipientName': 'Nom du destinataire',
        'content-manager.content-types.api::colis.colis.recipientPhone': 'Tél. destinataire',
        'content-manager.content-types.api::colis.colis.description': 'Description',
        'content-manager.content-types.api::colis.colis.type': 'Type',
        'content-manager.content-types.api::colis.colis.content': 'Contenu',
        'content-manager.content-types.api::colis.colis.estimatedValue': 'Valeur estimée',
        'content-manager.content-types.api::colis.colis.weight': 'Poids (kg)',
        'content-manager.content-types.api::colis.colis.price': 'Prix',
        'content-manager.content-types.api::colis.colis.status': 'Statut',
        'content-manager.content-types.api::colis.colis.crafter': 'Véhicule',
        'content-manager.content-types.api::colis.colis.reservation': 'Réservation',
        'content-manager.content-types.api::colis.colis.voyage': 'Voyage',

        // Contrat
        'content-manager.content-types.api::contrat.contrat.partenaire': 'Partenaire',
        'content-manager.content-types.api::contrat.contrat.chauffeur': 'Chauffeur',
        'content-manager.content-types.api::contrat.contrat.koperative': 'Coopérative',
        'content-manager.content-types.api::contrat.contrat.type': 'Type',
        'content-manager.content-types.api::contrat.contrat.title': 'Titre',
        'content-manager.content-types.api::contrat.contrat.terms': 'Termes',
        'content-manager.content-types.api::contrat.contrat.startDate': 'Date de début',
        'content-manager.content-types.api::contrat.contrat.endDate': 'Date de fin',
        'content-manager.content-types.api::contrat.contrat.contractValue': 'Valeur du contrat',
        'content-manager.content-types.api::contrat.contrat.status': 'Statut',

        // Partenaire
        'content-manager.content-types.api::partenaire.partenaire.name': 'Nom',
        'content-manager.content-types.api::partenaire.partenaire.type': 'Type',
        'content-manager.content-types.api::partenaire.partenaire.contactPerson': 'Contact',
        'content-manager.content-types.api::partenaire.partenaire.phone': 'Téléphone',
        'content-manager.content-types.api::partenaire.partenaire.email': 'Email',
        'content-manager.content-types.api::partenaire.partenaire.address': 'Adresse',
        'content-manager.content-types.api::partenaire.partenaire.isActive': 'Actif',
        'content-manager.content-types.api::partenaire.partenaire.contrats': 'Contrats',

        // Guichet
        'content-manager.content-types.api::guichet.guichet.name': 'Nom',
        'content-manager.content-types.api::guichet.guichet.gare': 'Gare',
        'content-manager.content-types.api::guichet.guichet.koperative': 'Coopérative',
        'content-manager.content-types.api::guichet.guichet.phones': 'Téléphones',
        'content-manager.content-types.api::guichet.guichet.isActive': 'Actif',
        'content-manager.content-types.api::guichet.guichet.openingHours': 'Horaires d\'ouverture',
        'content-manager.content-types.api::guichet.guichet.destinations': 'Destinations',

        // Product
        'content-manager.content-types.api::product.product.name': 'Nom',
        'content-manager.content-types.api::product.product.slug': 'Slug',
        'content-manager.content-types.api::product.product.description': 'Description',
        'content-manager.content-types.api::product.product.shortDescription': 'Description courte',
        'content-manager.content-types.api::product.product.price': 'Prix',
        'content-manager.content-types.api::product.product.originalPrice': 'Prix original',
        'content-manager.content-types.api::product.product.currency': 'Devise',
        'content-manager.content-types.api::product.product.sku': 'Référence (SKU)',
        'content-manager.content-types.api::product.product.weight': 'Poids (g)',
        'content-manager.content-types.api::product.product.dimensions': 'Dimensions',
        'content-manager.content-types.api::product.product.origin': 'Origine',
        'content-manager.content-types.api::product.product.images': 'Images',
        'content-manager.content-types.api::product.product.tags': 'Étiquettes',
        'content-manager.content-types.api::product.product.specifications': 'Spécifications',
        'content-manager.content-types.api::product.product.inStock': 'En stock',
        'content-manager.content-types.api::product.product.stockQuantity': 'Quantité en stock',
        'content-manager.content-types.api::product.product.rating': 'Note moyenne',
        'content-manager.content-types.api::product.product.reviewCount': 'Nombre d\'avis',
        'content-manager.content-types.api::product.product.isActive': 'Actif',
        'content-manager.content-types.api::product.product.isFeatured': 'Mis en avant',
        'content-manager.content-types.api::product.product.isNew': 'Nouveau',
        'content-manager.content-types.api::product.product.isBestSeller': 'Meilleure vente',
        'content-manager.content-types.api::product.product.category': 'Catégorie',
        'content-manager.content-types.api::product.product.variants': 'Variantes',
        'content-manager.content-types.api::product.product.campaigns': 'Campagnes promotionnelles',
        'content-manager.content-types.api::product.product.seo': 'SEO',

        // Product Category
        'content-manager.content-types.api::product-category.product-category.name': 'Nom',
        'content-manager.content-types.api::product-category.product-category.slug': 'Slug',
        'content-manager.content-types.api::product-category.product-category.description': 'Description',
        'content-manager.content-types.api::product-category.product-category.icon': 'Icône',
        'content-manager.content-types.api::product-category.product-category.image': 'Image',
        'content-manager.content-types.api::product-category.product-category.displayOrder': 'Ordre d\'affichage',
        'content-manager.content-types.api::product-category.product-category.isActive': 'Active',
        'content-manager.content-types.api::product-category.product-category.category': 'Catégorie parente',
        'content-manager.content-types.api::product-category.product-category.products': 'Produits',
        'content-manager.content-types.api::product-category.product-category.seo': 'SEO',

        // Category (top-level)
        'content-manager.content-types.api::category.category.name': 'Nom',
        'content-manager.content-types.api::category.category.description': 'Description',
        'content-manager.content-types.api::category.category.slug': 'Slug',
        'content-manager.content-types.api::category.category.isActive': 'Active',
        'content-manager.content-types.api::category.category.displayOrder': 'Ordre d\'affichage',
        'content-manager.content-types.api::category.category.subcategories': 'Sous-catégories',

        // Product Variant
        'content-manager.content-types.api::product-variant.product-variant.name': 'Nom',
        'content-manager.content-types.api::product-variant.product-variant.sku': 'Référence (SKU)',
        'content-manager.content-types.api::product-variant.product-variant.attributes': 'Attributs',
        'content-manager.content-types.api::product-variant.product-variant.price': 'Prix',
        'content-manager.content-types.api::product-variant.product-variant.stockQuantity': 'Quantité en stock',
        'content-manager.content-types.api::product-variant.product-variant.isActive': 'Active',
        'content-manager.content-types.api::product-variant.product-variant.image': 'Image',
        'content-manager.content-types.api::product-variant.product-variant.product': 'Produit',

        // Promotional Campaign
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.name': 'Nom',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.slug': 'Slug',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.description': 'Description',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.discountType': 'Type de remise',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.discountValue': 'Valeur de la remise',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.code': 'Code promo',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.startDate': 'Date de début',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.endDate': 'Date de fin',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.usageLimit': 'Limite d\'utilisation',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.usageCount': 'Nombre d\'utilisations',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.minOrderAmount': 'Montant minimum de commande',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.image': 'Image',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.isActive': 'Active',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.products': 'Produits',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.categories': 'Catégories',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.seo': 'SEO',

        // Shop Configuration
        'content-manager.content-types.api::shop-configuration.shop-configuration.currency': 'Devise',
        'content-manager.content-types.api::shop-configuration.shop-configuration.taxRate': 'Taux de taxe',
        'content-manager.content-types.api::shop-configuration.shop-configuration.shippingFlatRate': 'Frais de livraison forfaitaires',
        'content-manager.content-types.api::shop-configuration.shop-configuration.freeShippingThreshold': 'Seuil livraison gratuite',
        'content-manager.content-types.api::shop-configuration.shop-configuration.lowStockThreshold': 'Seuil de stock faible',
        'content-manager.content-types.api::shop-configuration.shop-configuration.enableWishlist': 'Activer la liste de souhaits',
        'content-manager.content-types.api::shop-configuration.shop-configuration.enableReviews': 'Activer les avis',
        'content-manager.content-types.api::shop-configuration.shop-configuration.enableGuestCheckout': 'Activer le paiement invité',
        'content-manager.content-types.api::shop-configuration.shop-configuration.supportEmail': 'E-mail du support',
        'content-manager.content-types.api::shop-configuration.shop-configuration.supportPhone': 'Téléphone du support',
        'content-manager.content-types.api::shop-configuration.shop-configuration.logo': 'Logo',
        'content-manager.content-types.api::shop-configuration.shop-configuration.bannerText': 'Texte de bannière',
        'content-manager.content-types.api::shop-configuration.shop-configuration.termsUrl': 'URL des CGV',
        'content-manager.content-types.api::shop-configuration.shop-configuration.returnPolicyUrl': 'URL de la politique de retour',
        'content-manager.content-types.api::shop-configuration.shop-configuration.isActive': 'Active',
        'content-manager.content-types.api::shop-configuration.shop-configuration.seo': 'SEO',

        // Promotion Banner (shop)
        'content-manager.content-types.api::promotion-banner.promotion-banner.ctaText': 'Texte du bouton',
        'content-manager.content-types.api::promotion-banner.promotion-banner.ctaLink': 'Lien du bouton',
        'content-manager.content-types.api::promotion-banner.promotion-banner.startDate': 'Date de début',
        'content-manager.content-types.api::promotion-banner.promotion-banner.endDate': 'Date de fin',
        'content-manager.content-types.api::promotion-banner.promotion-banner.campaign': 'Campagne',
      },
      en: {
        // Page Header
        'content-manager.components.page.page-header.title': 'Title',
        'content-manager.components.page.page-header.subtitle': 'Subtitle',
        'content-manager.components.page.page-header.alertType': 'Alert type',
        'content-manager.components.page.page-header.alertTitle': 'Alert title',
        'content-manager.components.page.page-header.alertMessage': 'Alert message',

        // Call to Action
        'content-manager.components.page.call-to-action.title': 'Title',
        'content-manager.components.page.call-to-action.description': 'Description',
        'content-manager.components.page.call-to-action.buttonText': 'Button text',
        'content-manager.components.page.call-to-action.buttonUrl': 'Button URL',
        'content-manager.components.page.call-to-action.buttonVariant': 'Button variant',
        'content-manager.components.page.call-to-action.buttonColor': 'Button color',
        'content-manager.components.page.call-to-action.buttonIcon': 'Button icon',
        'content-manager.components.page.call-to-action.backgroundColor': 'Background color',

        // About Us Section
        'content-manager.components.page.about-us-section.title': 'Title',
        'content-manager.components.page.about-us-section.paragraphs': 'Paragraphs',

        // Text Paragraph
        'content-manager.components.page.text-paragraph.text': 'Text',

        // Attraction Item
        'content-manager.components.page.attraction-item.name': 'Name',

        // Contact Item
        'content-manager.components.page.contact-item.name': 'Name',
        'content-manager.components.page.contact-item.number': 'Number',
        'content-manager.components.page.contact-item.available': 'Availability',

        // Contact Method
        'content-manager.components.page.contact-method.label': 'Label',
        'content-manager.components.page.contact-method.value': 'Value',
        'content-manager.components.page.contact-method.type': 'Type',

        // Contact Section
        'content-manager.components.page.contact-section.title': 'Title',
        'content-manager.components.page.contact-section.description': 'Description',
        'content-manager.components.page.contact-section.contactMethods': 'Contact methods',

        // Current Promotions
        'content-manager.components.page.current-promotions.title': 'Title',
        'content-manager.components.page.current-promotions.promotions': 'Promotions',

        // Promotion Item
        'content-manager.components.page.promotion-item.title': 'Title',
        'content-manager.components.page.promotion-item.subtitle': 'Subtitle',
        'content-manager.components.page.promotion-item.description': 'Description',
        'content-manager.components.page.promotion-item.discount': 'Discount',
        'content-manager.components.page.promotion-item.originalPrice': 'Original price',
        'content-manager.components.page.promotion-item.discountedPrice': 'Discounted price',
        'content-manager.components.page.promotion-item.validUntil': 'Valid until',
        'content-manager.components.page.promotion-item.image': 'Image',
        'content-manager.components.page.promotion-item.code': 'Promo code',
        'content-manager.components.page.promotion-item.route': 'Route',
        'content-manager.components.page.promotion-item.isLimited': 'Limited offer',
        'content-manager.components.page.promotion-item.remaining': 'Remaining seats',
        'content-manager.components.page.promotion-item.category': 'Category',
        'content-manager.components.page.promotion-item.isVIP': 'VIP offer',
        'content-manager.components.page.promotion-item.progress': 'Progress',
        'content-manager.components.page.promotion-item.imageUrl': 'Image URL',
        'content-manager.components.page.promotion-item.gridSize': 'Grid size',
        'content-manager.components.page.promotion-item.order': 'Display order',

        // Destination Item
        'content-manager.components.page.destination-item.route': 'Route',
        'content-manager.components.page.destination-item.region': 'Region',
        'content-manager.components.page.destination-item.description': 'Description',
        'content-manager.components.page.destination-item.image': 'Image',
        'content-manager.components.page.destination-item.duration': 'Duration',
        'content-manager.components.page.destination-item.attractions': 'Attractions',
        'content-manager.components.page.destination-item.category': 'Category',
        'content-manager.components.page.destination-item.popularity': 'Popularity',
        'content-manager.components.page.destination-item.frequency': 'Frequency',
        'content-manager.components.page.destination-item.price': 'Price',
        'content-manager.components.page.destination-item.imageUrl': 'Image URL',

        // Customer Testimonials
        'content-manager.components.page.customer-testimonials.title': 'Title',
        'content-manager.components.page.customer-testimonials.subtitle': 'Subtitle',
        'content-manager.components.page.customer-testimonials.testimonials': 'Testimonials',
        'content-manager.components.page.customer-testimonials.overallRating': 'Overall rating',
        'content-manager.components.page.customer-testimonials.backgroundColor': 'Background color',
        'content-manager.components.page.customer-testimonials.containerMaxWidth': 'Container max width',

        // Testimonial Item
        'content-manager.components.page.testimonial-item.name': 'Name',
        'content-manager.components.page.testimonial-item.location': 'Location',
        'content-manager.components.page.testimonial-item.rating': 'Rating',
        'content-manager.components.page.testimonial-item.comment': 'Comment',
        'content-manager.components.page.testimonial-item.avatar': 'Avatar',
        'content-manager.components.page.testimonial-item.avatarUrl': 'Avatar URL',

        // Overall Rating
        'content-manager.components.page.overall-rating.title': 'Title',
        'content-manager.components.page.overall-rating.averageRating': 'Average rating',
        'content-manager.components.page.overall-rating.totalReviews': 'Total reviews',
        'content-manager.components.page.overall-rating.recommendation': 'Recommendation (%)',

        // Popular Destinations
        'content-manager.components.page.popular-destinations.title': 'Title',
        'content-manager.components.page.popular-destinations.subtitle': 'Subtitle',
        'content-manager.components.page.popular-destinations.destinations': 'Destinations',
        'content-manager.components.page.popular-destinations.backgroundColor': 'Background color',
        'content-manager.components.page.popular-destinations.containerMaxWidth': 'Container max width',

        // Promotional Content
        'content-manager.components.page.promotional-content.title': 'Title',
        'content-manager.components.page.promotional-content.promotions': 'Promotions',
        'content-manager.components.page.promotional-content.callToAction': 'Call to action',
        'content-manager.components.page.promotional-content.backgroundColor': 'Background color',
        'content-manager.components.page.promotional-content.containerMaxWidth': 'Container max width',

        // Why Choose Us
        'content-manager.components.page.why-choose-us.title': 'Title',
        'content-manager.components.page.why-choose-us.subtitle': 'Subtitle',
        'content-manager.components.page.why-choose-us.features': 'Features',
        'content-manager.components.page.why-choose-us.statistics': 'Statistics',
        'content-manager.components.page.why-choose-us.showStatistics': 'Show statistics',
        'content-manager.components.page.why-choose-us.backgroundColor': 'Background color',
        'content-manager.components.page.why-choose-us.containerMaxWidth': 'Container max width',

        // Statistic Item
        'content-manager.components.page.statistic-item.value': 'Value',
        'content-manager.components.page.statistic-item.label': 'Label',
        'content-manager.components.page.statistic-item.color': 'Color',

        // Page Header (new fields)
        'content-manager.components.page.page-header.description': 'Description',

        // Destinations Grid
        'content-manager.components.page.destinations-grid.title': 'Title',
        'content-manager.components.page.destinations-grid.destinations': 'Destinations',

        // Emergency Contacts
        'content-manager.components.page.emergency-contacts.title': 'Title',
        'content-manager.components.page.emergency-contacts.contacts': 'Contacts',

        // FAQ Item
        'content-manager.components.page.faq-item.question': 'Question',
        'content-manager.components.page.faq-item.answer': 'Answer',

        // FAQ Section
        'content-manager.components.page.faq-section.title': 'Title',
        'content-manager.components.page.faq-section.faqs': 'FAQs',

        // Feature Item
        'content-manager.components.page.feature-item.title': 'Title',
        'content-manager.components.page.feature-item.description': 'Description',
        'content-manager.components.page.feature-item.icon': 'Icon',
        'content-manager.components.page.feature-item.color': 'Color',

        // Help Article
        'content-manager.components.page.help-article.title': 'Title',
        'content-manager.components.page.help-article.content': 'Content',
        'content-manager.components.page.help-article.url': 'URL',

        // Help Category
        'content-manager.components.page.help-category.name': 'Name',
        'content-manager.components.page.help-category.description': 'Description',
        'content-manager.components.page.help-category.icon': 'Icon',
        'content-manager.components.page.help-category.articles': 'Articles',

        // Help Center Section
        'content-manager.components.page.help-center-section.title': 'Title',
        'content-manager.components.page.help-center-section.categories': 'Categories',

        // Insurance Type
        'content-manager.components.page.insurance-type.name': 'Name',
        'content-manager.components.page.insurance-type.description': 'Description',
        'content-manager.components.page.insurance-type.coverage': 'Coverage',
        'content-manager.components.page.insurance-type.included': 'Included',
        'content-manager.components.page.insurance-type.price': 'Price',

        // Insurance Coverage
        'content-manager.components.page.insurance-coverage.title': 'Title',
        'content-manager.components.page.insurance-coverage.insuranceTypes': 'Insurance types',

        // Legal Section
        'content-manager.components.page.legal-section.title': 'Title',
        'content-manager.components.page.legal-section.content': 'Content',

        // Legal Content
        'content-manager.components.page.legal-content.title': 'Title',
        'content-manager.components.page.legal-content.sections': 'Sections',

        // Measure Item
        'content-manager.components.page.measure-item.icon': 'Icon',
        'content-manager.components.page.measure-item.title': 'Title',
        'content-manager.components.page.measure-item.description': 'Description',

        // Popular Routes
        'content-manager.components.page.popular-routes.title': 'Title',
        'content-manager.components.page.popular-routes.routes': 'Routes',
        'content-manager.components.page.popular-routes.disclaimer': 'Disclaimer',

        // Route Item
        'content-manager.components.page.route-item.from': 'From',
        'content-manager.components.page.route-item.to': 'To',
        'content-manager.components.page.route-item.price': 'Price',
        'content-manager.components.page.route-item.duration': 'Duration',
        'content-manager.components.page.route-item.comfort': 'Comfort',

        // Safety Measures
        'content-manager.components.page.safety-measures.title': 'Title',
        'content-manager.components.page.safety-measures.measures': 'Measures',

        // Safety Tips
        'content-manager.components.page.safety-tips.title': 'Title',
        'content-manager.components.page.safety-tips.tips': 'Tips',

        // Tip Item
        'content-manager.components.page.tip-item.title': 'Title',
        'content-manager.components.page.tip-item.text': 'Text',

        // Service Item
        'content-manager.components.page.service-item.name': 'Name',
        'content-manager.components.page.service-item.price': 'Price',
        'content-manager.components.page.service-item.features': 'Features',
        'content-manager.components.page.service-item.color': 'Color',

        // Service Types
        'content-manager.components.page.service-types.title': 'Title',
        'content-manager.components.page.service-types.services': 'Services',

        // Region Item
        'content-manager.components.page.region-item.name': 'Name',
        'content-manager.components.page.region-item.province': 'Province',
        'content-manager.components.page.region-item.cities': 'Cities',

        // Network Section
        'content-manager.components.page.network-section.title': 'Title',
        'content-manager.components.page.network-section.description': 'Description',
        'content-manager.components.page.network-section.regions': 'Regions',

        // Mission Section
        'content-manager.components.page.mission-section.title': 'Title',
        'content-manager.components.page.mission-section.tagline': 'Tagline',
        'content-manager.components.page.mission-section.description': 'Description',

        // Values Section
        'content-manager.components.page.values-section.title': 'Title',
        'content-manager.components.page.values-section.values': 'Values',

        // Value Item
        'content-manager.components.page.value-item.title': 'Title',
        'content-manager.components.page.value-item.description': 'Description',
        'content-manager.components.page.value-item.icon': 'Icon',

        // Statistics Section
        'content-manager.components.page.statistics-section.title': 'Title',
        'content-manager.components.page.statistics-section.statistics': 'Statistics',

        // Section Reference
        'content-manager.components.page.section-reference.sectionTitle': 'Section title',
        'content-manager.components.page.section-reference.sectionType': 'Section type',

        // Payment Section
        'content-manager.components.page.payment-section.title': 'Title',
        'content-manager.components.page.payment-section.description': 'Description',
        'content-manager.components.page.payment-section.buttonText': 'Button text',
        'content-manager.components.page.payment-section.buttonUrl': 'Button URL',
        'content-manager.components.page.payment-section.backgroundColor': 'Background color',
        'content-manager.components.page.payment-section.paymentMethods': 'Payment methods',

        // Booking Rules
        'content-manager.components.page.booking-rules.title': 'Title',
        'content-manager.components.page.booking-rules.rules': 'Rules',

        // Booking Rule Item
        'content-manager.components.page.booking-rule-item.icon': 'Icon',
        'content-manager.components.page.booking-rule-item.title': 'Title',
        'content-manager.components.page.booking-rule-item.description': 'Description',

        // Additional Info
        'content-manager.components.page.additional-info.title': 'Title',
        'content-manager.components.page.additional-info.alertType': 'Alert type',
        'content-manager.components.page.additional-info.alertMessage': 'Alert message',
        'content-manager.components.page.additional-info.items': 'Items',

        // Additional Info Item
        'content-manager.components.page.additional-info-item.icon': 'Icon',
        'content-manager.components.page.additional-info-item.label': 'Label',
        'content-manager.components.page.additional-info-item.text': 'Text',

        // Additional Services
        'content-manager.components.page.additional-services.title': 'Title',
        'content-manager.components.page.additional-services.services': 'Services',

        // Additional Service Item
        'content-manager.components.page.additional-service-item.icon': 'Icon',
        'content-manager.components.page.additional-service-item.title': 'Title',
        'content-manager.components.page.additional-service-item.description': 'Description',

        // Loyalty Program
        'content-manager.components.page.loyalty-program.title': 'Title',
        'content-manager.components.page.loyalty-program.programName': 'Program name',
        'content-manager.components.page.loyalty-program.description': 'Description',
        'content-manager.components.page.loyalty-program.levels': 'Levels',

        // Loyalty Level
        'content-manager.components.page.loyalty-level.name': 'Name',
        'content-manager.components.page.loyalty-level.trips': 'Trips',
        'content-manager.components.page.loyalty-level.color': 'Color',
        'content-manager.components.page.loyalty-level.highlighted': 'Highlighted',
        'content-manager.components.page.loyalty-level.benefits': 'Benefits',

        // Loyalty Benefit
        'content-manager.components.page.loyalty-benefit.text': 'Text',

        // Service Categories
        'content-manager.components.page.service-categories.title': 'Title',
        'content-manager.components.page.service-categories.categories': 'Categories',

        // Service Category Info
        'content-manager.components.page.service-category-info.title': 'Title',
        'content-manager.components.page.service-category-info.icon': 'Icon',
        'content-manager.components.page.service-category-info.color': 'Color',
        'content-manager.components.page.service-category-info.services': 'Services',

        // Service Category Item
        'content-manager.components.page.service-category-item.text': 'Text',

        // Hero Banner
        'content-manager.content-types.api::hero-content.hero-content.Title': 'Title',
        'content-manager.content-types.api::hero-content.hero-content.SubTitle': 'Subtitle',
        'content-manager.content-types.api::hero-content.hero-content.Destination': 'Destination',
        'content-manager.content-types.api::hero-content.hero-content.Description': 'Description',
        'content-manager.content-types.api::hero-content.hero-content.Image': 'Image',

        // Gare Banner
        'content-manager.content-types.api::gare-banner.gare-banner.Title': 'Title',
        'content-manager.content-types.api::gare-banner.gare-banner.SubTitle': 'Subtitle',
        'content-manager.content-types.api::gare-banner.gare-banner.Localisation': 'Location',
        'content-manager.content-types.api::gare-banner.gare-banner.Description': 'Description',
        'content-manager.content-types.api::gare-banner.gare-banner.Image': 'Image',

        // Koperative Banner
        'content-manager.content-types.api::koperative-banner.koperative-banner.Title': 'Title',
        'content-manager.content-types.api::koperative-banner.koperative-banner.SubTitle': 'Subtitle',
        'content-manager.content-types.api::koperative-banner.koperative-banner.Localisation': 'Location',
        'content-manager.content-types.api::koperative-banner.koperative-banner.Description': 'Description',
        'content-manager.content-types.api::koperative-banner.koperative-banner.Image': 'Image',

        // Promotion Banner
        'content-manager.content-types.api::promotion-banner.promotion-banner.Title': 'Title',
        'content-manager.content-types.api::promotion-banner.promotion-banner.SubTitle': 'Subtitle',
        'content-manager.content-types.api::promotion-banner.promotion-banner.Image': 'Image',
        'content-manager.content-types.api::promotion-banner.promotion-banner.Active': 'Active',

        // Ville
        'content-manager.content-types.api::ville.ville.name': 'Name',
        'content-manager.content-types.api::ville.ville.region': 'Region',
        'content-manager.content-types.api::ville.ville.province': 'Province',
        'content-manager.content-types.api::ville.ville.code': 'Code',
        'content-manager.content-types.api::ville.ville.isActive': 'Active',
        'content-manager.content-types.api::ville.ville.rn': 'National Road',
        'content-manager.content-types.api::ville.ville.frequence': 'Frequency',
        'content-manager.content-types.api::ville.ville.fokotanies': 'Fokotanies',

        // Fokotany
        'content-manager.content-types.api::fokotany.fokotany.commune': 'Commune',
        'content-manager.content-types.api::fokotany.fokotany.fokontany': 'Fokontany',
        'content-manager.content-types.api::fokotany.fokotany.ville': 'City',



        // Classe
        'content-manager.content-types.api::classe.classe.name': 'Name',
        'content-manager.content-types.api::classe.classe.description': 'Description',
        'content-manager.content-types.api::classe.classe.koperative': 'Cooperative',
        'content-manager.content-types.api::classe.classe.iconId': 'Icon (Cloudinary ID)',
        'content-manager.content-types.api::classe.classe.reservations': 'Reservations',

        // Gare
        'content-manager.content-types.api::gare.gare.name': 'Name',
        'content-manager.content-types.api::gare.gare.address': 'Address',
        'content-manager.content-types.api::gare.gare.ville': 'City',
        'content-manager.content-types.api::gare.gare.description': 'Description',
        'content-manager.content-types.api::gare.gare.isClosed': 'Closed',
        'content-manager.content-types.api::gare.gare.frequence': 'Frequency',
        'content-manager.content-types.api::gare.gare.guichets': 'Counters',

        // Hotel
        'content-manager.content-types.api::hotel.hotel.name': 'Name',
        'content-manager.content-types.api::hotel.hotel.ville': 'City',
        'content-manager.content-types.api::hotel.hotel.address': 'Address',
        'content-manager.content-types.api::hotel.hotel.phone': 'Phone',
        'content-manager.content-types.api::hotel.hotel.email': 'Email',
        'content-manager.content-types.api::hotel.hotel.rating': 'Rating',
        'content-manager.content-types.api::hotel.hotel.amenities': 'Amenities',
        'content-manager.content-types.api::hotel.hotel.isActive': 'Active',

        // Koperative
        'content-manager.content-types.api::koperative.koperative.name': 'Name',
        'content-manager.content-types.api::koperative.koperative.slug': 'Slug',
        'content-manager.content-types.api::koperative.koperative.description': 'Description',
        'content-manager.content-types.api::koperative.koperative.address': 'Address',
        'content-manager.content-types.api::koperative.koperative.phone': 'Phone',
        'content-manager.content-types.api::koperative.koperative.email': 'Email',
        'content-manager.content-types.api::koperative.koperative.registrationNumber': 'Registration number',
        'content-manager.content-types.api::koperative.koperative.taxId': 'Tax ID',
        'content-manager.content-types.api::koperative.koperative.website': 'Website',
        'content-manager.content-types.api::koperative.koperative.logoUrl': 'Logo URL',
        'content-manager.content-types.api::koperative.koperative.status': 'Status',
        'content-manager.content-types.api::koperative.koperative.type': 'Type',
        'content-manager.content-types.api::koperative.koperative.proprietaireId': 'Owner (ID)',
        'content-manager.content-types.api::koperative.koperative.guichets': 'Counters',
        'content-manager.content-types.api::koperative.koperative.crafters': 'Vehicles',
        'content-manager.content-types.api::koperative.koperative.chauffeurs': 'Drivers',
        'content-manager.content-types.api::koperative.koperative.contrats': 'Contracts',
        'content-manager.content-types.api::koperative.koperative.voyages': 'Trips',
        'content-manager.content-types.api::koperative.koperative.villes': 'Served cities',
        'content-manager.content-types.api::koperative.koperative.classes': 'Classes',

        // Route
        'content-manager.content-types.api::route.route.name': 'Name',
        'content-manager.content-types.api::route.route.departureGare': 'Departure station',
        'content-manager.content-types.api::route.route.arrivalGare': 'Arrival station',
        'content-manager.content-types.api::route.route.estimatedDurationHours': 'Estimated duration (h)',
        'content-manager.content-types.api::route.route.distanceKm': 'Distance (km)',
        'content-manager.content-types.api::route.route.fraisTaxibrousse': 'Taxibrousse fees',
        'content-manager.content-types.api::route.route.fraisKoperative': 'Cooperative fees',
        'content-manager.content-types.api::route.route.description': 'Description',
        'content-manager.content-types.api::route.route.isActive': 'Active',
        'content-manager.content-types.api::route.route.routeStops': 'Stops',
        'content-manager.content-types.api::route.route.voyages': 'Trips',

        // Route Stop
        'content-manager.content-types.api::route-stop.route-stop.route': 'Route',
        'content-manager.content-types.api::route-stop.route-stop.ville': 'City',
        'content-manager.content-types.api::route-stop.route-stop.gare': 'Station',
        'content-manager.content-types.api::route-stop.route-stop.stopOrder': 'Stop order',
        'content-manager.content-types.api::route-stop.route-stop.estimatedArrival': 'Estimated arrival',
        'content-manager.content-types.api::route-stop.route-stop.estimatedDeparture': 'Estimated departure',
        'content-manager.content-types.api::route-stop.route-stop.isMandatory': 'Mandatory',

        // Voyage
        'content-manager.content-types.api::voyage.voyage.koperative': 'Cooperative',
        'content-manager.content-types.api::voyage.voyage.route': 'Route',
        'content-manager.content-types.api::voyage.voyage.departureGare': 'Departure station',
        'content-manager.content-types.api::voyage.voyage.arrivalGare': 'Arrival station',
        'content-manager.content-types.api::voyage.voyage.crafter': 'Vehicle',
        'content-manager.content-types.api::voyage.voyage.chauffeur': 'Driver',
        'content-manager.content-types.api::voyage.voyage.departureTime': 'Departure time',
        'content-manager.content-types.api::voyage.voyage.estimatedArrivalTime': 'Estimated arrival',
        'content-manager.content-types.api::voyage.voyage.actualArrivalTime': 'Actual arrival',
        'content-manager.content-types.api::voyage.voyage.availableSeats': 'Available seats',
        'content-manager.content-types.api::voyage.voyage.pricePerSeat': 'Price per seat',
        'content-manager.content-types.api::voyage.voyage.status': 'Status',
        'content-manager.content-types.api::voyage.voyage.description': 'Description',
        'content-manager.content-types.api::voyage.voyage.recurrenceType': 'Recurrence type',
        'content-manager.content-types.api::voyage.voyage.customInterval': 'Custom interval (days)',
        'content-manager.content-types.api::voyage.voyage.weekdays': 'Weekdays',
        'content-manager.content-types.api::voyage.voyage.monthlyDates': 'Monthly dates',
        'content-manager.content-types.api::voyage.voyage.recurrenceStartDate': 'Recurrence start',
        'content-manager.content-types.api::voyage.voyage.recurrenceEndDate': 'Recurrence end',
        'content-manager.content-types.api::voyage.voyage.isTemplate': 'Template',
        'content-manager.content-types.api::voyage.voyage.parentTemplate': 'Parent template',
        'content-manager.content-types.api::voyage.voyage.generatedInstances': 'Generated instances',
        'content-manager.content-types.api::voyage.voyage.classe': 'Class',
        'content-manager.content-types.api::voyage.voyage.reservations': 'Reservations',
        'content-manager.content-types.api::voyage.voyage.seats': 'Seats',

        // Crafter
        'content-manager.content-types.api::crafter.crafter.registrationNumber': 'Registration number',
        'content-manager.content-types.api::crafter.crafter.model': 'Model',
        'content-manager.content-types.api::crafter.crafter.kilometrage': 'Mileage',
        'content-manager.content-types.api::crafter.crafter.seatCapacity': 'Seat capacity',
        'content-manager.content-types.api::crafter.crafter.configName': 'Seat config name',
        'content-manager.content-types.api::crafter.crafter.seatConfig': 'Seat config (JSON)',
        'content-manager.content-types.api::crafter.crafter.koperative': 'Cooperative',
        'content-manager.content-types.api::crafter.crafter.chauffeur': 'Driver',
        'content-manager.content-types.api::crafter.crafter.isActive': 'Active',
        'content-manager.content-types.api::crafter.crafter.dateVisite': 'Technical inspection date',
        'content-manager.content-types.api::crafter.crafter.seats': 'Seats',

        // Moto
        'content-manager.content-types.api::moto.moto.registrationNumber': 'Registration number',
        'content-manager.content-types.api::moto.moto.model': 'Model',
        'content-manager.content-types.api::moto.moto.yearManufactured': 'Year manufactured',
        'content-manager.content-types.api::moto.moto.chauffeur': 'Driver',
        'content-manager.content-types.api::moto.moto.isActive': 'Active',
        'content-manager.content-types.api::moto.moto.lastMaintenance': 'Last maintenance',

        // Chauffeur
        'content-manager.content-types.api::chauffeur.chauffeur.userId': 'User (ID)',
        'content-manager.content-types.api::chauffeur.chauffeur.licenseNumber': 'License number',
        'content-manager.content-types.api::chauffeur.chauffeur.licenseAuthority': 'License authority',
        'content-manager.content-types.api::chauffeur.chauffeur.licenseExpiry': 'License expiry',
        'content-manager.content-types.api::chauffeur.chauffeur.experienceYears': 'Experience (years)',
        'content-manager.content-types.api::chauffeur.chauffeur.rating': 'Rating',
        'content-manager.content-types.api::chauffeur.chauffeur.isAvailable': 'Available',
        'content-manager.content-types.api::chauffeur.chauffeur.koperative': 'Cooperative',
        'content-manager.content-types.api::chauffeur.chauffeur.crafterAssigned': 'Assigned vehicles',
        'content-manager.content-types.api::chauffeur.chauffeur.motos': 'Motorcycles',
        'content-manager.content-types.api::chauffeur.chauffeur.contrats': 'Contracts',
        'content-manager.content-types.api::chauffeur.chauffeur.voyages': 'Trips',

        // Reservation
        'content-manager.content-types.api::reservation.reservation.voyage': 'Trip',
        'content-manager.content-types.api::reservation.reservation.voyageurId': 'Passenger (ID)',
        'content-manager.content-types.api::reservation.reservation.classe': 'Class',
        'content-manager.content-types.api::reservation.reservation.bookingReference': 'Booking reference',
        'content-manager.content-types.api::reservation.reservation.status': 'Status',
        'content-manager.content-types.api::reservation.reservation.bookingDate': 'Booking date',
        'content-manager.content-types.api::reservation.reservation.totalAmount': 'Total amount',
        'content-manager.content-types.api::reservation.reservation.notes': 'Notes',
        'content-manager.content-types.api::reservation.reservation.seats': 'Seats',
        'content-manager.content-types.api::reservation.reservation.facturation': 'Invoice',

        // Seat
        'content-manager.content-types.api::seat.seat.voyage': 'Trip',
        'content-manager.content-types.api::seat.seat.crafter': 'Vehicle',
        'content-manager.content-types.api::seat.seat.seatNumber': 'Seat number',
        'content-manager.content-types.api::seat.seat.seatStatus': 'Seat status',
        'content-manager.content-types.api::seat.seat.reservation': 'Reservation',
        'content-manager.content-types.api::seat.seat.position': 'Position',
        'content-manager.content-types.api::seat.seat.notes': 'Notes',

        // Facturation
        'content-manager.content-types.api::facturation.facturation.reservation': 'Reservation',
        'content-manager.content-types.api::facturation.facturation.invoiceNumber': 'Invoice number',
        'content-manager.content-types.api::facturation.facturation.amount': 'Amount (excl. tax)',
        'content-manager.content-types.api::facturation.facturation.taxAmount': 'Tax amount',
        'content-manager.content-types.api::facturation.facturation.totalAmount': 'Total amount',
        'content-manager.content-types.api::facturation.facturation.remainingAmount': 'Remaining amount',
        'content-manager.content-types.api::facturation.facturation.paymentMethodIdentifier': 'Payment method',
        'content-manager.content-types.api::facturation.facturation.paymentReference': 'Payment reference',
        'content-manager.content-types.api::facturation.facturation.paymentStatus': 'Payment status',
        'content-manager.content-types.api::facturation.facturation.paymentDate': 'Payment date',
        'content-manager.content-types.api::facturation.facturation.dueDate': 'Due date',

        // Colis
        'content-manager.content-types.api::colis.colis.senderName': 'Sender name',
        'content-manager.content-types.api::colis.colis.senderPhone': 'Sender phone',
        'content-manager.content-types.api::colis.colis.recipientName': 'Recipient name',
        'content-manager.content-types.api::colis.colis.recipientPhone': 'Recipient phone',
        'content-manager.content-types.api::colis.colis.description': 'Description',
        'content-manager.content-types.api::colis.colis.type': 'Type',
        'content-manager.content-types.api::colis.colis.content': 'Content',
        'content-manager.content-types.api::colis.colis.estimatedValue': 'Estimated value',
        'content-manager.content-types.api::colis.colis.weight': 'Weight (kg)',
        'content-manager.content-types.api::colis.colis.price': 'Price',
        'content-manager.content-types.api::colis.colis.status': 'Status',
        'content-manager.content-types.api::colis.colis.crafter': 'Vehicle',
        'content-manager.content-types.api::colis.colis.reservation': 'Reservation',
        'content-manager.content-types.api::colis.colis.voyage': 'Trip',

        // Contrat
        'content-manager.content-types.api::contrat.contrat.partenaire': 'Partner',
        'content-manager.content-types.api::contrat.contrat.chauffeur': 'Driver',
        'content-manager.content-types.api::contrat.contrat.koperative': 'Cooperative',
        'content-manager.content-types.api::contrat.contrat.type': 'Type',
        'content-manager.content-types.api::contrat.contrat.title': 'Title',
        'content-manager.content-types.api::contrat.contrat.terms': 'Terms',
        'content-manager.content-types.api::contrat.contrat.startDate': 'Start date',
        'content-manager.content-types.api::contrat.contrat.endDate': 'End date',
        'content-manager.content-types.api::contrat.contrat.contractValue': 'Contract value',
        'content-manager.content-types.api::contrat.contrat.status': 'Status',

        // Partenaire
        'content-manager.content-types.api::partenaire.partenaire.name': 'Name',
        'content-manager.content-types.api::partenaire.partenaire.type': 'Type',
        'content-manager.content-types.api::partenaire.partenaire.contactPerson': 'Contact person',
        'content-manager.content-types.api::partenaire.partenaire.phone': 'Phone',
        'content-manager.content-types.api::partenaire.partenaire.email': 'Email',
        'content-manager.content-types.api::partenaire.partenaire.address': 'Address',
        'content-manager.content-types.api::partenaire.partenaire.isActive': 'Active',
        'content-manager.content-types.api::partenaire.partenaire.contrats': 'Contracts',

        // Guichet
        'content-manager.content-types.api::guichet.guichet.name': 'Name',
        'content-manager.content-types.api::guichet.guichet.gare': 'Station',
        'content-manager.content-types.api::guichet.guichet.koperative': 'Cooperative',
        'content-manager.content-types.api::guichet.guichet.phones': 'Phones',
        'content-manager.content-types.api::guichet.guichet.isActive': 'Active',
        'content-manager.content-types.api::guichet.guichet.openingHours': 'Opening hours',
        'content-manager.content-types.api::guichet.guichet.destinations': 'Destinations',

        // Product
        'content-manager.content-types.api::product.product.name': 'Name',
        'content-manager.content-types.api::product.product.slug': 'Slug',
        'content-manager.content-types.api::product.product.description': 'Description',
        'content-manager.content-types.api::product.product.shortDescription': 'Short description',
        'content-manager.content-types.api::product.product.price': 'Price',
        'content-manager.content-types.api::product.product.originalPrice': 'Original price',
        'content-manager.content-types.api::product.product.currency': 'Currency',
        'content-manager.content-types.api::product.product.sku': 'SKU',
        'content-manager.content-types.api::product.product.weight': 'Weight (g)',
        'content-manager.content-types.api::product.product.dimensions': 'Dimensions',
        'content-manager.content-types.api::product.product.origin': 'Origin',
        'content-manager.content-types.api::product.product.images': 'Images',
        'content-manager.content-types.api::product.product.tags': 'Tags',
        'content-manager.content-types.api::product.product.specifications': 'Specifications',
        'content-manager.content-types.api::product.product.inStock': 'In stock',
        'content-manager.content-types.api::product.product.stockQuantity': 'Stock quantity',
        'content-manager.content-types.api::product.product.rating': 'Rating',
        'content-manager.content-types.api::product.product.reviewCount': 'Review count',
        'content-manager.content-types.api::product.product.isActive': 'Active',
        'content-manager.content-types.api::product.product.isFeatured': 'Featured',
        'content-manager.content-types.api::product.product.isNew': 'New',
        'content-manager.content-types.api::product.product.isBestSeller': 'Best seller',
        'content-manager.content-types.api::product.product.category': 'Category',
        'content-manager.content-types.api::product.product.variants': 'Variants',
        'content-manager.content-types.api::product.product.campaigns': 'Promotional campaigns',
        'content-manager.content-types.api::product.product.seo': 'SEO',

        // Product Category
        'content-manager.content-types.api::product-category.product-category.name': 'Name',
        'content-manager.content-types.api::product-category.product-category.slug': 'Slug',
        'content-manager.content-types.api::product-category.product-category.description': 'Description',
        'content-manager.content-types.api::product-category.product-category.icon': 'Icon',
        'content-manager.content-types.api::product-category.product-category.image': 'Image',
        'content-manager.content-types.api::product-category.product-category.displayOrder': 'Display order',
        'content-manager.content-types.api::product-category.product-category.isActive': 'Active',
        'content-manager.content-types.api::product-category.product-category.category': 'Parent category',
        'content-manager.content-types.api::product-category.product-category.products': 'Products',
        'content-manager.content-types.api::product-category.product-category.seo': 'SEO',

        // Category (top-level)
        'content-manager.content-types.api::category.category.name': 'Name',
        'content-manager.content-types.api::category.category.description': 'Description',
        'content-manager.content-types.api::category.category.slug': 'Slug',
        'content-manager.content-types.api::category.category.isActive': 'Active',
        'content-manager.content-types.api::category.category.displayOrder': 'Display order',
        'content-manager.content-types.api::category.category.subcategories': 'Subcategories',

        // Product Variant
        'content-manager.content-types.api::product-variant.product-variant.name': 'Name',
        'content-manager.content-types.api::product-variant.product-variant.sku': 'SKU',
        'content-manager.content-types.api::product-variant.product-variant.attributes': 'Attributes',
        'content-manager.content-types.api::product-variant.product-variant.price': 'Price',
        'content-manager.content-types.api::product-variant.product-variant.stockQuantity': 'Stock quantity',
        'content-manager.content-types.api::product-variant.product-variant.isActive': 'Active',
        'content-manager.content-types.api::product-variant.product-variant.image': 'Image',
        'content-manager.content-types.api::product-variant.product-variant.product': 'Product',

        // Promotional Campaign
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.name': 'Name',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.slug': 'Slug',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.description': 'Description',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.discountType': 'Discount type',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.discountValue': 'Discount value',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.code': 'Promo code',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.startDate': 'Start date',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.endDate': 'End date',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.usageLimit': 'Usage limit',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.usageCount': 'Usage count',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.minOrderAmount': 'Minimum order amount',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.image': 'Image',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.isActive': 'Active',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.products': 'Products',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.categories': 'Categories',
        'content-manager.content-types.api::promotional-campaign.promotional-campaign.seo': 'SEO',

        // Shop Configuration
        'content-manager.content-types.api::shop-configuration.shop-configuration.currency': 'Currency',
        'content-manager.content-types.api::shop-configuration.shop-configuration.taxRate': 'Tax rate',
        'content-manager.content-types.api::shop-configuration.shop-configuration.shippingFlatRate': 'Shipping flat rate',
        'content-manager.content-types.api::shop-configuration.shop-configuration.freeShippingThreshold': 'Free shipping threshold',
        'content-manager.content-types.api::shop-configuration.shop-configuration.lowStockThreshold': 'Low-stock threshold',
        'content-manager.content-types.api::shop-configuration.shop-configuration.enableWishlist': 'Enable wishlist',
        'content-manager.content-types.api::shop-configuration.shop-configuration.enableReviews': 'Enable reviews',
        'content-manager.content-types.api::shop-configuration.shop-configuration.enableGuestCheckout': 'Enable guest checkout',
        'content-manager.content-types.api::shop-configuration.shop-configuration.supportEmail': 'Support email',
        'content-manager.content-types.api::shop-configuration.shop-configuration.supportPhone': 'Support phone',
        'content-manager.content-types.api::shop-configuration.shop-configuration.logo': 'Logo',
        'content-manager.content-types.api::shop-configuration.shop-configuration.bannerText': 'Banner text',
        'content-manager.content-types.api::shop-configuration.shop-configuration.termsUrl': 'Terms URL',
        'content-manager.content-types.api::shop-configuration.shop-configuration.returnPolicyUrl': 'Return policy URL',
        'content-manager.content-types.api::shop-configuration.shop-configuration.isActive': 'Active',
        'content-manager.content-types.api::shop-configuration.shop-configuration.seo': 'SEO',

        // Promotion Banner (shop)
        'content-manager.content-types.api::promotion-banner.promotion-banner.ctaText': 'CTA text',
        'content-manager.content-types.api::promotion-banner.promotion-banner.ctaLink': 'CTA link',
        'content-manager.content-types.api::promotion-banner.promotion-banner.startDate': 'Start date',
        'content-manager.content-types.api::promotion-banner.promotion-banner.endDate': 'End date',
        'content-manager.content-types.api::promotion-banner.promotion-banner.campaign': 'Campaign',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    // Optionally set runtime branding here
    // No runtime branding API available in Strapi v5, use config only
  },
};
