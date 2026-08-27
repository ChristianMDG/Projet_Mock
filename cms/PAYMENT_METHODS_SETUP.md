# Payment Methods Setup Guide

## Overview

This guide explains how to complete the mobile money payment methods setup in Strapi CMS. The payment methods (MVola, Airtel Money, Orange Money) have been pre-populated with multilingual descriptions.

## Payment Methods Created

The following payment methods have been automatically created in the CMS with French, English, and Malagasy translations:

### 1. MVola
- **Operator**: MVola
- **Phone Prefix**: 034
- **Payment Method Enum**: MVOLA
- **Sort Order**: 1
- **Status**: Active

**Descriptions:**
- 🇫🇷 French: "Paiement sécurisé via MVola. Disponible pour tous les numéros commençant par 034."
- 🇬🇧 English: "Secure payment via MVola. Available for all numbers starting with 034."
- 🇲🇬 Malagasy: "Fandoavam-bola azo antoka amin'ny alalan'ny MVola. Ho an'ny laharana manomboka amin'ny 034."

### 2. Airtel Money
- **Operator**: Airtel
- **Phone Prefix**: 033
- **Payment Method Enum**: AIRTEL_MONEY
- **Sort Order**: 2
- **Status**: Active

**Descriptions:**
- 🇫🇷 French: "Paiement rapide et sécurisé via Airtel Money. Disponible pour tous les numéros commençant par 033."
- 🇬🇧 English: "Fast and secure payment via Airtel Money. Available for all numbers starting with 033."
- 🇲🇬 Malagasy: "Fandoavam-bola haingana sy azo antoka amin'ny alalan'ny Airtel Money. Ho an'ny laharana manomboka amin'ny 033."

### 3. Orange Money
- **Operator**: Orange
- **Phone Prefix**: 032
- **Payment Method Enum**: ORANGE_MONEY
- **Sort Order**: 3
- **Status**: Active

**Descriptions:**
- 🇫🇷 French: "Paiement simple et sécurisé via Orange Money. Disponible pour tous les numéros commençant par 032."
- 🇬🇧 English: "Simple and secure payment via Orange Money. Available for all numbers starting with 032."
- 🇲🇬 Malagasy: "Fandoavam-bola tsotra sy azo antoka amin'ny alalan'ny Orange Money. Ho an'ny laharana manomboka amin'ny 032."

## Next Steps: Adding Operator Logos

### Step 1: Start the CMS (if not already running)

```bash
cd cms
npm run develop
```

Access the admin panel at: http://localhost:1337/admin

### Step 2: Navigate to Payment Methods

1. Log into Strapi admin panel
2. Go to **Content Manager** → **Payment Method**
3. You should see 9 entries (3 operators × 3 locales)

### Step 3: Upload Logos

For each payment method, click "Edit" and upload the operator logo:

#### Logo Specifications
- **Format**: PNG with transparent background (preferred) or JPG
- **Dimensions**: 200x200px (or larger, will be resized automatically)
- **Quality**: High resolution for clarity on all devices

#### Logo Sources

**MVola Logo:**
- Official Telma/MVola branding
- Primary colors: Red (#E30613) and White
- Logo should include "MVola" text or the recognizable MVola symbol

**Airtel Money Logo:**
- Official Airtel Money branding
- Primary color: Red (#ED1B24)
- Logo should include "Airtel Money" text or the Airtel symbol

**Orange Money Logo:**
- Official Orange Money branding  
- Primary color: Orange (#FF7900)
- Logo should include "Orange Money" text or the Orange symbol

#### Where to Upload

You can obtain official logos from:
1. Official operator websites
2. Press/media kits from operator sites
3. Brand guidelines provided by operators
4. Existing marketing materials (with proper usage rights)

### Step 4: Upload Process in Strapi

For **each locale** (fr, en, mg) of each payment method:

1. Click on the payment method entry
2. Scroll to the **"Logo"** field
3. Click **"Add more files"** or drop file
4. Select the operator logo file (PNG/JPG)
5. Wait for Cloudinary upload to complete
6. Click **"Save"** and **"Publish"**

**Note:** You only need to upload each logo once per operator. Strapi's i18n system will share the logo across all locales since the `logo` field is not localized.

### Step 5: Verify Upload

After uploading, verify that:
- Each payment method has a logo displayed
- The logo appears in the Cloudinary media library
- The Cloudinary URL is properly stored in the database

## Testing the Integration

### Frontend Testing

Once logos are uploaded, test the payment method display in the frontend:

1. Navigate to the shop checkout page
2. Verify payment methods appear with logos
3. Check that descriptions are properly localized
4. Verify phone prefix hints (034, 033, 032) display correctly

### API Testing

Test the CMS API endpoint:

```bash
# Get all payment methods (French locale)
curl http://localhost:1337/api/payment-methods?locale=fr&populate=*

# Get all payment methods (all locales)
curl http://localhost:1337/api/payment-methods?locale=all&populate=*
```

Expected response should include:
- `name`, `description` (localized)
- `slug`, `operator`, `phonePrefix` (not localized)
- `logo` with Cloudinary URL
- `paymentMethodEnum` for backend mapping

## Troubleshooting

### Issue: Logos not appearing

**Solution:**
- Verify Cloudinary credentials in `.env`
- Check browser console for CORS errors
- Ensure logo field is populated in Strapi

### Issue: Duplicate entries created

**Solution:**
- Delete extra entries via Content Manager
- The script checks for existing entries before creating new ones

### Issue: Descriptions not localized

**Solution:**
- Verify you're viewing the correct locale in Strapi
- Check that i18n plugin is properly configured
- Ensure locale parameter is passed in API requests

## Configuration Details

### Database Schema

Payment methods are stored in the `payment_methods` table with the following key fields:

- `name` (localized)
- `slug` (unique, not localized)
- `description` (localized)
- `logo` (media field, not localized)
- `operator` (enum: MVola, Airtel, Orange)
- `phonePrefix` (string: 034, 033, 032)
- `paymentMethodEnum` (string: MVOLA, AIRTEL_MONEY, ORANGE_MONEY)
- `isActive` (boolean, default: true)
- `sortOrder` (integer for display ordering)

### Backend Integration

The `paymentMethodEnum` field maps to Java enum values in the backend:

```java
public enum PaymentMethodEnum {
    MVOLA,
    AIRTEL_MONEY,
    ORANGE_MONEY
}
```

This mapping ensures proper communication between CMS and backend payment processing.

## Requirements Validated

This implementation validates the following requirements from the spec:

- **Requirement 6.1**: Payment Gateway support for MVola (034), Airtel (033), Orange (032)
- **Requirement 6.2**: Display phone number input with appropriate prefix hint
- **Requirement 9.3**: Display operator logos and descriptions from CMS

## Maintenance

### Adding New Payment Methods

To add a new mobile money operator in the future:

1. Create new entry in Strapi admin panel
2. Set appropriate operator enum, phone prefix, and payment method enum
3. Add localized descriptions for all supported languages (fr, en, mg)
4. Upload operator logo
5. Update backend Java enum if needed
6. Test integration end-to-end

### Updating Logos

To update an operator logo:

1. Navigate to the payment method in Content Manager
2. Remove the existing logo
3. Upload the new logo file
4. Save and publish
5. The updated logo will be served from Cloudinary immediately

## Completion Checklist

- [x] Payment method content type created/verified
- [x] Bootstrap script created for data population
- [x] French descriptions added
- [x] English descriptions added
- [x] Malagasy descriptions added
- [ ] MVola logo uploaded to Cloudinary
- [ ] Airtel Money logo uploaded to Cloudinary
- [ ] Orange Money logo uploaded to Cloudinary
- [ ] Frontend integration tested
- [ ] API endpoints verified

## Contact

For questions or issues with payment method setup, refer to:
- CMS Developer documentation
- Strapi documentation: https://docs.strapi.io
- Cloudinary documentation: https://cloudinary.com/documentation
