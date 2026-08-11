# 📝 Section Paiement

## Composant : Section Paiement

### 🇫🇷 Français (Locale par défaut)

**Titre de la section :** `Modes de paiement sécurisés`

**Description :** `Payez vos billets en toute sécurité avec le moyen de paiement qui vous convient. Nous acceptons les principales solutions de paiement disponibles à Madagascar pour votre commodité.`

**Texte du bouton :** `Réserver maintenant`

**URL du bouton :** `/reservation`

**Couleur de fond :** `background.paper`

**Méthodes de paiement (relation) :** `Référence vers api::payment-method.payment-method`

### Notes d'implémentation
```
Ce composant utilise une relation oneToMany vers le content-type payment-method.
Les méthodes de paiement suivantes doivent être créées séparément dans le content-type payment-method :

1. MVola
   - Nom : MVola
   - Description : Paiement mobile instantané et sécurisé via votre compte MVola. Simple et rapide.
   - Icône : PhoneAndroidRounded
   - Logo : (URL logo MVola)
   - Est actif : Oui
   - Ordre d'affichage : 1
   - Instructions : Sélectionnez MVola, entrez votre numéro, validez la transaction sur votre téléphone.

2. Orange Money
   - Nom : Orange Money
   - Description : Payez facilement avec votre compte Orange Money en quelques secondes.
   - Icône : PhoneAndroidRounded
   - Logo : (URL logo Orange Money)
   - Est actif : Oui
   - Ordre d'affichage : 2
   - Instructions : Choisissez Orange Money, saisissez votre numéro, confirmez via SMS.

3. Airtel Money
   - Nom : Airtel Money
   - Description : Utilisez votre compte Airtel Money pour un paiement instantané et sécurisé.
   - Icône : PhoneAndroidRounded
   - Logo : (URL logo Airtel Money)
   - Est actif : Oui
   - Ordre d'affichage : 3
   - Instructions : Sélectionnez Airtel Money, indiquez votre numéro, validez le paiement.

4. Carte Bancaire
   - Nom : Carte Visa/Mastercard
   - Description : Paiement sécurisé par carte bancaire Visa ou Mastercard avec protocole SSL.
   - Icône : CreditCardRounded
   - Logo : (URL logos Visa/Mastercard)
   - Est actif : Oui
   - Ordre d'affichage : 4
   - Instructions : Entrez les informations de votre carte, la transaction est cryptée et sécurisée.

5. Paiement en Gare
   - Nom : Paiement en espèces à la gare
   - Description : Réservez en ligne et payez en espèces directement à la gare avant le départ.
   - Icône : LocalAtmRounded
   - Logo : (URL icône cash)
   - Est actif : Oui
   - Ordre d'affichage : 5
   - Instructions : Réservez votre place, présentez-vous à la gare 30 min avant le départ avec votre numéro de réservation.
```

---

### 🇬🇧 Anglais

**Titre de la section :** `Secure payment methods`

**Description :** `Pay for your tickets securely with the payment method that suits you. We accept the main payment solutions available in Madagascar for your convenience.`

**Texte du bouton :** `Book now`

**URL du bouton :** `/booking`

**Couleur de fond :** `background.paper`

**Méthodes de paiement (relation) :** `Reference to api::payment-method.payment-method`

### Implementation Notes
```
This component uses a oneToMany relation to the payment-method content-type.
The following payment methods should be created separately in the payment-method content-type:

1. MVola
   - Name : MVola
   - Description : Instant and secure mobile payment via your MVola account. Simple and fast.
   - Icon : PhoneAndroidRounded
   - Logo : (MVola logo URL)
   - Is active : Yes
   - Display order : 1
   - Instructions : Select MVola, enter your number, validate the transaction on your phone.

2. Orange Money
   - Name : Orange Money
   - Description : Pay easily with your Orange Money account in seconds.
   - Icon : PhoneAndroidRounded
   - Logo : (Orange Money logo URL)
   - Is active : Yes
   - Display order : 2
   - Instructions : Choose Orange Money, enter your number, confirm via SMS.

3. Airtel Money
   - Name : Airtel Money
   - Description : Use your Airtel Money account for instant and secure payment.
   - Icon : PhoneAndroidRounded
   - Logo : (Airtel Money logo URL)
   - Is active : Yes
   - Display order : 3
   - Instructions : Select Airtel Money, provide your number, validate the payment.

4. Credit Card
   - Name : Visa/Mastercard
   - Description : Secure payment by Visa or Mastercard credit card with SSL protocol.
   - Icon : CreditCardRounded
   - Logo : (Visa/Mastercard logos URL)
   - Is active : Yes
   - Display order : 4
   - Instructions : Enter your card information, the transaction is encrypted and secure.

5. Station Payment
   - Name : Cash payment at station
   - Description : Book online and pay in cash directly at the station before departure.
   - Icon : LocalAtmRounded
   - Logo : (Cash icon URL)
   - Is active : Yes
   - Display order : 5
   - Instructions : Book your seat, arrive at the station 30 min before departure with your booking number.
```

---

### 🇲🇬 Malgache

**Titre de la section :** `Fomba fandoavana azo antoka`

**Description :** `Mandoava ny tapakilanao am-pahatoky amin'ny fomba fandoavana mety aminao. Manaiky ny vahaolana fandoavana lehibe ao Madagasikara izahay mba hanamorana anao.`

**Texte du bouton :** `Hamandrika izao`

**URL du bouton :** `/famandrihana`

**Couleur de fond :** `background.paper`

**Méthodes de paiement (relation) :** `Référence mankany amin'ny api::payment-method.payment-method`

### Fanamarihana momba ny fampiharana
```
Ity singa ity dia mampiasa fifandraisana oneToMany mankany amin'ny content-type payment-method.
Ireto fomba fandoavana manaraka ireto dia tokony ho noforonina manokana ao amin'ny content-type payment-method:

1. MVola
   - Anarana : MVola
   - Famaritana : Fandoavana finday eo noho eo sy azo antoka amin'ny alalan'ny kaontinao MVola. Tsotra sy haingana.
   - Icône : PhoneAndroidRounded
   - Logo : (URL logo MVola)
   - Mavitrika : Eny
   - Filaharana fampisehoana : 1
   - Torolalana : Safidio MVola, ampidiro ny laharanao, hamafiso ny fifampiraharahana amin'ny telefaonanao.

2. Orange Money
   - Anarana : Orange Money
   - Famaritana : Mandoava mora amin'ny kaontinao Orange Money ao anatin'ny segondra vitsy.
   - Icône : PhoneAndroidRounded
   - Logo : (URL logo Orange Money)
   - Mavitrika : Eny
   - Filaharana fampisehoana : 2
   - Torolalana : Safidio Orange Money, ampidiro ny laharanao, hamafiso amin'ny alalan'ny SMS.

3. Airtel Money
   - Anarana : Airtel Money
   - Famaritana : Ampiasao ny kaontinao Airtel Money mba handoavana eo noho eo sy azo antoka.
   - Icône : PhoneAndroidRounded
   - Logo : (URL logo Airtel Money)
   - Mavitrika : Eny
   - Filaharana fampisehoana : 3
   - Torolalana : Safidio Airtel Money, omeo ny laharanao, hamafiso ny fandoavana.

4. Carte Bancaire
   - Anarana : Visa/Mastercard
   - Famaritana : Fandoavana azo antoka amin'ny carte bancaire Visa na Mastercard miaraka amin'ny protocole SSL.
   - Icône : CreditCardRounded
   - Logo : (URL logo Visa/Mastercard)
   - Mavitrika : Eny
   - Filaharana fampisehoana : 4
   - Torolalana : Ampidiro ny fampahafantarana ny carte, voahodina sy azo antoka ny fifampiraharahana.

5. Fandoavana eo amin'ny toeram-piantsonana
   - Anarana : Fandoavana vola eo amin'ny toeram-piantsonana
   - Famaritana : Mamandrika an-tserasera ary mandoava vola mivantana eo amin'ny toeram-piantsonana mialohan'ny fiaingana.
   - Icône : LocalAtmRounded
   - Logo : (URL icône vola)
   - Mavitrika : Eny
   - Filaharana fampisehoana : 5
   - Torolalana : Mamandrika ny toeranao, miseho eo amin'ny toeram-piantsonana 30 min mialohan'ny fiaingana miaraka amin'ny laharana famandrihana.
```

---
