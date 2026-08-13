# API Endpoints

Full interactive docs: `http://localhost:8080/swagger-ui.html`.

## Authentication (`/api/auth`) — public

- `POST /api/auth/register` — create an account (role defaults to `WORKER`; admins can promote via `/api/accounts`)
- `POST /api/auth/login` — `{ username, password }` → `{ accessToken, tokenType, expiresIn, ...user }`. Also sets an httpOnly `refreshToken` cookie (scoped to `/api/auth`).
- `POST /api/auth/refresh` — reads the `refreshToken` cookie, rotates it, returns a new access token. Public (by design — the client has no valid access token when it needs to refresh).
- `POST /api/auth/logout` — clears the refresh token (cookie + server-side hash).

## Account & Profile

- `PUT /api/auth/change-password` — `{ currentPassword, newPassword }` — authenticated user changes their own password.
- `GET/PUT/DELETE /api/accounts` — admin-only account management (`account_status`, `role`). Requires `ROLE_ADMIN`.

## Dashboard & Analytics

- `GET /api/dashboard/overview` — role-aware stats + charts for the logged-in user (different shape for admin/manager, sales person, worker).
- `GET /api/analytics/overview` — broader stats + 6 charts (revenue trend, harvest yield, crop status, revenue by farm, payment status, equipment status). Requires `ROLE_ADMIN` or `ROLE_FARM_MANAGER`.

## Standard CRUD resources

For each resource below: `GET /api/{resource}`, `GET /api/{resource}/{id}`, `POST /api/{resource}`, `PUT /api/{resource}/{id}`, `DELETE /api/{resource}/{id}`.

- `appuser`, `attendance`, `crop`, `customer`, `disease`, `employment`, `equipment`, `equipmentmaintenance`, `equipmentusage`, `farm`, `fertilizer`, `fertilizerapplication`, `fertilizertransaction`, `harvest`, `inventory`, `inventorytransaction`, `payment`

`sale` also supports `GET /api/sale/summary` — the sale list joined with customer name, staff name, and item count (what the frontend's Sales & Orders page renders).

## Crop diseases (`/api/crop-diseases`)

- `GET /api/crop-diseases`
- `GET /api/crop-diseases/crop/{cropId}`
- `POST /api/crop-diseases`
- `DELETE /api/crop-diseases/{id}` — single surrogate ID (was `/{cropId}/{diseaseId}`; the table now has its own `crop_disease_id` primary key)

## Sale items (`/api/sale-items`)

- `GET /api/sale-items`
- `GET /api/sale-items/sale/{saleId}`
- `POST /api/sale-items` — uses the `sp_record_sale_item` stored procedure. Send `saleId`, `inventoryId`, `quantity`, `unitPrice`; the database computes the subtotal and updates the sale total.
- `DELETE /api/sale-items/{id}`

## Notifications (`/api/notification`)

- `GET /api/notification` — the authenticated user's own notifications
- `PATCH /api/notification/{id}/read`
- `PATCH /api/notification/{id}/unread`
- `PATCH /api/notification/read-all`
- `DELETE /api/notification/{id}`

## Health check

- `GET /api/test` — public, returns `{"status":true,"message":"The Agrify backend server is running"}`

## Demo accounts (seeded on first startup)

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | ADMIN |
| `farm.manager` | `manager123` | FARM_MANAGER |
| `sales.person` | `sales123` | SALES_PERSON |
| `field.worker` | `worker123` | WORKER |
