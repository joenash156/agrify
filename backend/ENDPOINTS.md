# Swagger endpoints

All endpoints except registration and Swagger documentation require Basic Authentication.

## Authentication

POST `/api/auth/register`

Example:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "0240000000",
  "username": "john.doe",
  "password": "password123"
}
```

## Standard CRUD resources

For each resource below:

- GET `/api/{resource}`
- GET `/api/{resource}/{id}`
- POST `/api/{resource}`
- PUT `/api/{resource}/{id}`
- DELETE `/api/{resource}/{id}`

Resources:

- appuser
- attendance
- crop
- customer
- disease
- employment
- equipment
- equipmentmaintenance
- equipmentusage
- farm
- fertilizer
- fertilizerapplication
- fertilizertransaction
- inventory
- sale
- payment
- inventorytransaction

## Crop diseases

- GET `/api/crop-diseases`
- GET `/api/crop-diseases/crop/{cropId}`
- POST `/api/crop-diseases`
- DELETE `/api/crop-diseases/{cropId}/{diseaseId}`

## Sale items

- GET `/api/sale-items`
- GET `/api/sale-items/sale/{saleId}`
- POST `/api/sale-items`
- DELETE `/api/sale-items/{id}`

POST `/api/sale-items` uses the supplied `sp_record_sale_item` stored procedure. Send `saleId`, `inventoryId`, `quantity`, and `unitPrice`. The database calculates the subtotal and updates the sale total.

## Admin account management

- GET `/api/accounts`
- GET `/api/accounts/{id}`
- PUT `/api/accounts/{id}`
- DELETE `/api/accounts/{id}`

These require the ADMIN role.
