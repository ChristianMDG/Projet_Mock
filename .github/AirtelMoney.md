# Airtel Money API Notes

Base URL used in these examples:

`https://openapiuat.airtel.mg`

## 1. OAuth2 Authorization

Retrieve an access token using the `client_credentials` grant.

### Endpoint

`POST /auth/oauth2/token`

### cURL Example

```bash
curl -X POST https://openapiuat.airtel.mg/auth/oauth2/token \
  -H 'Content-Type: application/json' \
  -H 'Accept: */*' \
  --data '{
    "client_id": "************",
    "client_secret": "****************",
    "grant_type": "client_credentials"
  }'
```

### Request Body

```json
{
  "client_id": "************",
  "client_secret": "****************",
  "grant_type": "client_credentials"
}
```

### Success Response

```json
{
  "access_token": "****************",
  "expires_in": "180",
  "token_type": "bearer"
}
```

## 2. Payments - USSD Push

This API requests a payment from a consumer (payer). The consumer is prompted to authorize the payment, and the transaction is executed after approval.

### Endpoint

`POST /merchant/v1/payments/`

### cURL Example

```bash
curl -X POST https://openapiuat.airtel.mg/merchant/v1/payments/ \
  -H 'Accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'X-Country: MG' \
  -H 'X-Currency: MGA' \
  -H 'Authorization: Bearer UC******2w' \
  --data '{
    "reference": "Testing transaction",
    "subscriber": {
      "country": "MG",
      "currency": "MGA",
      "msisdn": "12****89"
    },
    "transaction": {
      "amount": 1000,
      "country": "MG",
      "currency": "MGA",
      "id": "random-unique-id"
    }
  }'
```

### Request Body

```json
{
  "reference": "Testing transaction",
  "subscriber": {
    "country": "MG",
    "currency": "MGA",
    "msisdn": "12****89"
  },
  "transaction": {
    "amount": 1000,
    "country": "MG",
    "currency": "MGA",
    "id": "random-unique-id"
  }
}
```

### Success Response

```json
{
  "data": {
    "transaction": {
      "id": "A*******N5",
      "status": "SUCCESS"
    }
  },
  "status": {
    "code": "200",
    "message": "SUCCESS",
    "result_code": "ESB000010",
    "response_code": "DP00800001006",
    "success": true
  }
}
```

### Notes

- Do not send the country code in `msisdn`.

## 3. Transaction Enquiry

This API retrieves the transaction status for a requested external ID.

### Endpoint

`GET /standard/v1/payments/{id}`

It is recommended to run the enquiry at least three minutes after calling the payment API.

### Path Parameter

- `id`: external transaction ID used when creating the payment request.

### cURL Example

```bash
curl -X GET https://openapiuat.airtel.mg/standard/v1/payments/{id} \
  -H 'Accept: */*' \
  -H 'X-Country: MG' \
  -H 'X-Currency: MGA' \
  -H 'Authorization: Bearer UC******2w'
```

### Success Response

```json
{
  "data": {
    "transaction": {
      "airtel_money_id": "C36*****67",
      "id": "83****88",
      "message": "success",
      "status": "TS"
    }
  },
  "status": {
    "code": "200",
    "message": "SUCCESS",
    "result_code": "ESB000010",
    "response_code": "DP00800001006",
    "success": false
  }
}
```

## 4. Callback With Authentication

Airtel Africa sends transaction status updates to the configured callback URL. The callback status can be intermediate or final.

When callback authentication is enabled, a `hash` is included in the request body. You can verify it by hashing the callback payload with the private key configured in the application settings using `HmacSHA256`, then comparing the Base64-encoded result with the received hash.

### Endpoint

`POST /callback_path`

### Callback URL Format

`https://partner_domain/callback_path`

This URL is configured in the application settings.

### cURL Example

```bash
curl -X POST https://openapiuat.airtel.mg/callback_path \
  -H 'Content-Type: application/json' \
  --data '{
    "transaction": {
      "id": "BBZMiscxy",
      "message": "Paid MGA 5,000 to TECHNOLOGIES LIMITED Charge MGA 140, Trans ID MP210603.1234.L06941.",
      "status_code": "TS",
      "airtel_money_id": "MP210603.1234.L06941"
    },
    "hash": "zITVAAGYSlzl1WkUQJn81kbpT5drH3koffT8jCkcJJA="
  }'
```

### Callback Payload

```json
{
  "transaction": {
    "id": "BBZMiscxy",
    "message": "Paid MGA 5,000 to TECHNOLOGIES LIMITED Charge MGA 140, Trans ID MP210603.1234.L06941.",
    "status_code": "TS",
    "airtel_money_id": "MP210603.1234.L06941"
  },
  "hash": "zITVAAGYSlzl1WkUQJn81kbpT5drH3koffT8jCkcJJA="
}
```