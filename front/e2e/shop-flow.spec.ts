import { test, expect } from '@playwright/test';

test.describe('Shop Checkout E2E Process', () => {
  test('should go through add to cart, delivery info, payment status, and order confirmation', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', exception => console.log('BROWSER ERROR:', exception));

    // 1. Intercept and mock backend API calls (relative or localhost:8080)
    await page.route('**/users/token', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token-xyz',
          user: {
            id: 1,
            username: 'admin',
            phone: '0343500001',
            email: 'admin@example.com',
            admin: true,
            authorities: [{ id: 1, name: 'ADMIN' }],
          },
        }),
      });
    });

    await page.route('**/users/current', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          username: 'admin',
          phone: '0343500001',
          email: 'admin@example.com',
          admin: true,
          authorities: [{ id: 1, name: 'ADMIN' }],
        }),
      });
    });

    await page.route('**/users/language-preference', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success', language: 'FR' }),
      });
    });

    // Mock Cart endpoints
    await page.route('**/cart', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          items: [],
          subtotal: 0.0,
          itemCount: 0,
        }),
      });
    });

    await page.route('**/cart/merge', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          items: [],
          subtotal: 0.0,
          itemCount: 0,
        }),
      });
    });

    await page.route('**/cart/items', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          items: [
            {
              id: 1,
              cartId: 1,
              productId: 4,
              quantity: 1,
              unitPrice: 45000.0,
              lineTotal: 45000.0,
            },
          ],
          subtotal: 45000.0,
          itemCount: 1,
        }),
      });
    });

    await page.route('**/villes', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'Antananarivo',
            province: 'Antananarivo',
            region: 'Analamanga',
            frequence: 100,
          },
        ]),
      });
    });

    await page.route('**/orders/buy-now', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 42,
          orderNumber: 'ORD-2026-42',
          status: 'PENDING',
          total: 45000.0,
          transactionReference: 'TXN-MOCK-E2E-123',
        }),
      });
    });

    await page.route('**/orders', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 42,
          orderNumber: 'ORD-2026-42',
          status: 'PENDING',
          total: 45000.0,
          transactionReference: 'TXN-MOCK-E2E-123',
        }),
      });
    });

    await page.route('**/orders/*/payment/initiate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 99,
          transactionReference: 'TXN-MOCK-E2E-123',
          serverCorrelationId: 'mvola-corr-e2e',
          status: 'INITIATED',
        }),
      });
    });

    await page.route('**/payments/mvola/check/TXN-MOCK-E2E-123', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 99,
          transactionReference: 'TXN-MOCK-E2E-123',
          status: 'COMPLETED',
        }),
      });
    });

    await page.route('**/tombana-fanaterana/calculate**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          minWeight: 0.0,
          maxWeight: 10.0,
          frais: 5000.0,
          deliveryMethod: 'STANDARD',
          villeId: 1,
        }),
      });
    });

    // 2. Intercept and mock CMS (Strapi) API calls (relative or localhost:1337)
    await page.route('**/categories**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'Cartes Cadeaux',
            slug: 'cartes-cadeaux',
            subcategories: [
              {
                id: 11,
                name: 'Cartes Google Play',
                slug: 'cartes-google-play',
              },
            ],
          },
        ]),
      });
    });

    await page.route('**/shop-banner**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            documentId: 'banner-1',
            title: 'Boutique de voyage',
            subtitle: 'Achetez des articles de voyage',
            ctaText: 'Parcourir',
            ctaLink: '#products',
            isActive: true,
            locale: 'fr',
            publishedAt: '2026-08-22T00:00:00Z',
            createdAt: '2026-08-22T00:00:00Z',
            updatedAt: '2026-08-22T00:00:00Z',
          },
          meta: {
            availableLocales: ['fr', 'en', 'mg'],
          },
        }),
      });
    });

    await page.route('**/products/search**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 4,
              name: 'Carte Gift Play Store 10$',
              slug: 'carte-gift-play-store-10',
              description: 'Carte cadeau Google Play Store',
              shortDescription: 'Carte Google Play',
              price: 45000.0,
              currency: 'MGA',
              images: [
                {
                  id: 1,
                  url: 'https://example.com/playstore.jpg',
                },
              ],
              category: {
                id: 11,
                name: 'Cartes Google Play',
                slug: 'cartes-google-play',
              },
              inStock: true,
              stockQuantity: 10,
              rating: 5.0,
              reviewCount: 2,
              tags: ['gift', 'google'],
              isFeatured: true,
              isNew: true,
              sku: 'GG-PLAY-10',
            },
          ],
        }),
      });
    });

    await page.route('**/products/slug/carte-gift-play-store-10**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 4,
          name: 'Carte Gift Play Store 10$',
          slug: 'carte-gift-play-store-10',
          description: 'Carte cadeau Google Play Store',
          shortDescription: 'Carte Google Play',
          price: 45000.0,
          currency: 'MGA',
          images: [
            {
              id: 1,
              url: 'https://example.com/playstore.jpg',
            },
          ],
          category: {
            id: 11,
            name: 'Cartes Google Play',
            slug: 'cartes-google-play',
          },
          inStock: true,
          stockQuantity: 10,
          rating: 5.0,
          reviewCount: 2,
          tags: ['gift', 'google'],
          isFeatured: true,
          isNew: true,
          sku: 'GG-PLAY-10',
        }),
      });
    });

    // 3. E2E Browser Interaction
    // Go to Login Page (using French locale route for predictable translations)
    await page.goto('/fr/connexion');

    // Fill in Login credentials
    const phoneInput = page.locator('input[type="tel"]');
    await phoneInput.fill('034 35 000 01');

    const passwordInput = page.locator('input#password');
    await passwordInput.fill('password');

    // Submit Auth form
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();

    // Verify authentication succeeds and redirects to home page
    await expect(page).toHaveURL(/fr/);

    // Navigate to the Shop page
    await page.goto('/fr/boutique');

    // Verify product card is visible and click on the product title
    const productCard = page.locator('text=Carte Gift Play Store 10$').first();
    await expect(productCard).toBeVisible();
    await productCard.click();

    // Verify detail page has loaded
    await expect(page).toHaveURL(/fr\/boutique\/carte-gift-play-store-10/);

    // Locate "Commander" (French translation of Add to Cart) button and click it
    const addToCartButton = page.locator('button:has-text("Commander")').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Verify Cart Drawer opens and has the "Voir le panier" (View Cart) button
    const viewCartButton = page.locator('button:has-text("Voir le panier")');
    await expect(viewCartButton).toBeVisible();
    await viewCartButton.click();

    // Verify we are on the Checkout page
    await expect(page).toHaveURL(/fr\/boutique\/commande/);

    // Step 0: Cart Review - click "Continuer" (Continue)
    const continueButton = page.locator('button:has-text("Continuer")').first();
    await expect(continueButton).toBeVisible();
    await continueButton.click();

    // Step 1: Delivery Info
    // 1.1 Autocomplete: click and type "Antananarivo", then select option
    const cityInput = page.locator(
      'input[label="Destination de livraison"], input[placeholder="Rechercher une ville..."], .MuiAutocomplete-input',
    );
    await cityInput.click();
    await cityInput.fill('Antananarivo');

    // Wait for the dropdown options to appear and click the first option
    const cityOption = page.locator('li[role="option"]:has-text("Antananarivo")');
    await cityOption.first().click();

    // 1.2 Fill Recipient Name
    const nameInput = page.locator('input[name="recipientName"]');
    await nameInput.fill('Integ Recipient');

    // 1.3 Fill Recipient Phone
    const phoneRecipientInput = page.locator('input[name="recipientPhone"]');
    await phoneRecipientInput.fill('0343500001');

    // 1.4 Fill Address
    const addressInput = page.locator('textarea[name="shippingAddress"]');
    await addressInput.fill('Lot E2E Shop City');

    // 1.5 Click "Procéder au paiement"
    const proceedToPaymentButton = page.locator('button:has-text("Procéder au paiement")');
    await expect(proceedToPaymentButton).toBeVisible();
    await proceedToPaymentButton.click();

    // Step 2: Payment Method selection
    // Select MVola operator option
    const mvolaRadio = page.locator('text=MVola').first();
    await mvolaRadio.click();

    // Fill in mobile money phone number
    const paymentPhoneInput = page.locator('input[name="phoneNumber"]');
    await paymentPhoneInput.fill('0343500001');

    // Click "Payer" (Pay)
    const payButton = page.locator('button:has-text("Payer")').first();
    await expect(payButton).toBeVisible();
    await payButton.click();

    // Polling will check status and transition to Step 3: Order Confirmation.
    // Verify that the Order Confirmation header/message is visible
    const successHeader = page.locator('text=Commande confirmée').first();
    await expect(successHeader).toBeVisible({ timeout: 15000 });

    const orderNumberText = page.locator('text=ORD-2026-42').first();
    await expect(orderNumberText).toBeVisible();
  });
});
