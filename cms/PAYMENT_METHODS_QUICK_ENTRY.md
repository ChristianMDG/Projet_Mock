# Quick Entry Guide: Payment Methods Data

Use this guide to quickly create payment method entries in Strapi admin panel.

## Access
1. Start CMS: `cd cms && npm run develop`
2. Open: http://localhost:1337/admin
3. Navigate: **Content Manager** → **Payment Method** → **Create new entry**

---

## Entry 1: MVola

### Basic Fields
```
Name: MVola
Slug: mvola
Operator: MVola (select from dropdown)
Phone Prefix: 034
Payment Method Enum: MVOLA
Identifier: mvola
Is Active: true (checked)
Sort Order: 1
```

### Description (French - Default)
```
Paiement sécurisé via MVola. Disponible pour tous les numéros commençant par 034.
```

### Logo
- Click "Add more files"
- Upload MVola/Telma logo (200x200px PNG, red branding)
- Wait for Cloudinary upload

### Actions
1. Click **Save**
2. Click **Publish**
3. Click **Add new locale** → Select **English (en)**
   - Name: `MVola`
   - Description: `Secure payment via MVola. Available for all numbers starting with 034.`
   - Save and Publish
4. Click **Add new locale** → Select **Malagasy (mg)**
   - Name: `MVola`
   - Description: `Fandoavam-bola azo antoka amin'ny alalan'ny MVola. Ho an'ny laharana manomboka amin'ny 034.`
   - Save and Publish

---

## Entry 2: Airtel Money

### Basic Fields
```
Name: Airtel Money
Slug: airtel-money
Operator: Airtel (select from dropdown)
Phone Prefix: 033
Payment Method Enum: AIRTEL_MONEY
Identifier: airtel-money
Is Active: true (checked)
Sort Order: 2
```

### Description (French - Default)
```
Paiement rapide et sécurisé via Airtel Money. Disponible pour tous les numéros commençant par 033.
```

### Logo
- Click "Add more files"
- Upload Airtel Money logo (200x200px PNG, red color scheme)
- Wait for Cloudinary upload

### Actions
1. Click **Save**
2. Click **Publish**
3. Click **Add new locale** → Select **English (en)**
   - Name: `Airtel Money`
   - Description: `Fast and secure payment via Airtel Money. Available for all numbers starting with 033.`
   - Save and Publish
4. Click **Add new locale** → Select **Malagasy (mg)**
   - Name: `Airtel Money`
   - Description: `Fandoavam-bola haingana sy azo antoka amin'ny alalan'ny Airtel Money. Ho an'ny laharana manomboka amin'ny 033.`
   - Save and Publish

---

## Entry 3: Orange Money

### Basic Fields
```
Name: Orange Money
Slug: orange-money
Operator: Orange (select from dropdown)
Phone Prefix: 032
Payment Method Enum: ORANGE_MONEY
Identifier: orange-money
Is Active: true (checked)
Sort Order: 3
```

### Description (French - Default)
```
Paiement simple et sécurisé via Orange Money. Disponible pour tous les numéros commençant par 032.
```

### Logo
- Click "Add more files"
- Upload Orange Money logo (200x200px PNG, orange color scheme)
- Wait for Cloudinary upload

### Actions
1. Click **Save**
2. Click **Publish**
3. Click **Add new locale** → Select **English (en)**
   - Name: `Orange Money`
   - Description: `Simple and secure payment via Orange Money. Available for all numbers starting with 032.`
   - Save and Publish
4. Click **Add new locale** → Select **Malagasy (mg)**
   - Name: `Orange Money`
   - Description: `Fandoavam-bola tsotra sy azo antoka amin'ny alalan'ny Orange Money. Ho an'ny laharana manomboka amin'ny 032.`
   - Save and Publish

---

## Verification

After creating all entries:

1. Go to **Content Manager** → **Payment Method**
2. You should see **3 entries** (one per operator)
3. Each entry should show **3 locales** (fr, en, mg)
4. All entries should be **Published** (green indicator)

### API Test
```bash
curl http://localhost:1337/api/payment-methods?locale=fr&populate=*
```

Expected result: JSON array with 3 payment methods, each with:
- `name`, `description` (localized)
- `slug`, `operator`, `phonePrefix`, `paymentMethodEnum`
- `logo` with Cloudinary URL
- `isActive: true`, proper `sortOrder`

---

## Troubleshooting

### Issue: Can't find Payment Method in Content Manager
**Solution**: Verify content type exists at `cms/src/api/payment-method/`

### Issue: Logo upload fails
**Solution**: Check Cloudinary credentials in `cms/.env`

### Issue: Localization option not available
**Solution**: Verify i18n plugin is enabled in `cms/config/plugins.ts`

### Issue: Can't save without logo
**Solution**: Logo field is required - upload image before saving

---

## Time Estimate
- **Per payment method**: ~5 minutes
- **Total setup time**: ~15-20 minutes
- **Includes**: Entry creation, logo upload, localization for 3 languages

---

## Need Help?
See full documentation: `cms/PAYMENT_METHODS_SETUP.md`
