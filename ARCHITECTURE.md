# Agrify — System Architecture

Farm management system. React/TypeScript SPA talking to a Spring Boot REST API
backed by MySQL 8.0. No ORM on the backend (raw Spring JDBC only); no global
state library on the frontend (React Context only).

---

## 1. System Context

```
 +------------------------------------------------------------------+
 |                         CLIENT — Browser                          |
 |     Agrify React SPA  (Vite dev server / static production build) |
 +------------------------------------------------------------------+
                |                                    ^
                |  HTTPS, JSON                        |
                |  Authorization: Bearer <JWT>         |  httpOnly refresh
                |  withCredentials (refresh cookie)    |  cookie set here
                v                                    |
 +------------------------------------------------------------------+
 |                SPRING BOOT BACKEND — port 8080                    |
 |          Java 25 · Spring Boot 3.5.4 · Spring Security            |
 |                    Spring JDBC (no ORM)                           |
 +------------------------------------------------------------------+
                |
                |  JDBC  (MariaDB Connector/J driver)
                v
 +------------------------------------------------------------------+
 |                 MySQL 8.0 — database "farm_management"            |
 |      21 tables · 8 views · 4 procedures · 3 triggers               |
 +------------------------------------------------------------------+
```

---

## 2. Frontend Architecture (`frontend/`)

React 18 + TypeScript + Vite + Tailwind CSS. Framer Motion for transitions,
Recharts for charts, FontAwesome for icons, Axios for HTTP, React Router for
routing.

```
 main.tsx
    |
    v
 App.tsx
    |
    +-- ThemeProvider ------------------+
    +-- ToastProvider ------------------+---- React Context providers,
    +-- AuthProvider -------------------+     wrap the entire app
    |       |
    |       v
    |   React Router
    |       |
    |       +----------------------------+----------------------------+
    |       |                            |
    |   PUBLIC ROUTE                 PRIVATE ROUTES
    |   "/auth"                      (behind PrivateAppLayout)
    |       |                            |
    |   AuthPage.tsx                     v
    |   (login / register)   +--------------------------------------+
    |                        |  SidebarProvider                      |
    |                        |  NotificationsProvider                |
    |                        |         |                             |
    |                        |         +-- Sidebar (nav, role-       |
    |                        |         |    filtered, lockable)      |
    |                        |         +-- DashboardTopBar           |
    |                        |         +-- AnimatedOutlet            |
    |                        |               |                       |
    |                        |               v                       |
    |                        |     [ if accountStatus != ACTIVE ]     |
    |                        |     AccountPendingNotice shown         |
    |                        |     in place of Dashboard content,     |
    |                        |     other sidebar links disabled       |
    |                        +--------------------------------------+
    |                                     |
    |                        16 private pages render here:
    |                        Dashboard, Farms, Crops, Diseases,
    |                        Equipment, Fertilizers, Harvests,
    |                        Inventory, POS, Sales, Payments,
    |                        Employees, Attendance, Notifications,
    |                        Analytics, Settings
    v
 each page calls one or more domain SERVICES
    |
    v
 +----------------------------------------------------------------+
 |                    SERVICES  (src/services/*.ts)                |
 |                                                                  |
 |   authService        farmService        cropService             |
 |   employeeService     saleService        paymentService          |
 |   attendanceService   notificationService accountService         |
 |   appUserService      inventoryService    ...(22 files total)    |
 |                                                                  |
 |            createCrudService<T>()  <- generic factory for        |
 |                    |                   plain CRUD resources;      |
 |                    |                   hand-written services      |
 |                    |                   used where the API shape   |
 |                    |                   isn't plain CRUD           |
 |                    v                                              |
 |               httpClient.ts  (Axios instance)                    |
 |    - baseURL "/api"                                              |
 |    - attaches "Authorization: Bearer <accessToken>"               |
 |    - response interceptor: 401 -> silent /auth/refresh -> retry   |
 +----------------------------------------------------------------+
    |
    |  HTTP requests to /api/**
    v
 (crosses into the Spring Boot backend — see section 3)
```

### Frontend directory layout

```
frontend/src/
├── main.tsx, App.tsx
├── components/
│   ├── common/     — EntityFormModal, ConfirmDialog, RowActions,
│   │                 EntityCard, StatusBadge, Toast, PageHeader, ...
│   ├── dashboard/  — StatCard and chart building blocks
│   ├── layout/     — Sidebar, DashboardTopBar, AccountPendingNotice
│   └── auth/       — PasswordStrengthMeter, etc.
├── contexts/       — AuthContext, ThemeContext, SidebarContext,
│                      NotificationsContext, ToastContext
├── layouts/        — PrivateAppLayout (shell for all private pages)
├── pages/
│   ├── public/     — AuthPage.tsx
│   └── private/    — 16 route-level pages (see diagram above)
├── services/       — one file per backend resource + httpClient.ts
├── types/          — shared TS interfaces (Sale, Payment, Employee, ...)
├── utils/          — formatDate, errors (extractErrorMessage), permissions
├── hooks/          — useScrollToTop, etc.
└── data/           — static reference data (nav groups, etc.)
```

---

## 3. Backend Architecture (`backend/`)

Spring Boot 3.5.4 on Java 25. Strict layering, **no ORM** — every query is
raw SQL through `JdbcTemplate`. 26 controllers, 25 services, ~23 DAO
interface+impl pairs, one per domain resource.

```
                       HTTP request  (/api/**)
                              |
                              v
 +--------------------------------------------------------------------+
 |                     SECURITY FILTER CHAIN                          |
 |                                                                    |
 |   CorsFilter -> JwtAuthenticationFilter -> HttpBasicFilter -> ...   |
 |        |                    |                                     |
 |        |                    +-- reads "Authorization: Bearer",     |
 |        |                        validates JWT, loads               |
 |        |                        DatabaseUserDetailsService          |
 |        |                                                            |
 |   SecurityConfig:                                                  |
 |     /api/auth/**      -> permitAll                                 |
 |     /api/accounts/**  -> hasRole(ADMIN)                             |
 |     everything else   -> authenticated()                            |
 |     + @PreAuthorize on individual controller methods                |
 +--------------------------------------------------------------------+
                              |
                              v
 +--------------------------------------------------------------------+
 |                          CONTROLLER  (26)                          |
 |   @RestController — one per resource (FarmController,               |
 |   SaleController, EmploymentController, AttendanceController, ...)  |
 |   maps HTTP verbs to service calls, (de)serializes DTOs             |
 +--------------------------------------------------------------------+
                              |
                              v
 +--------------------------------------------------------------------+
 |                           SERVICE  (25)                            |
 |   business rules, validation, cross-entity orchestration            |
 |   e.g. EmploymentService keeps app_user.working_status in sync;     |
 |        AttendanceService enforces "clock in for yourself only";     |
 |        UserAccountService blocks role changes to/from ADMIN         |
 +--------------------------------------------------------------------+
                              |
                              v
 +--------------------------------------------------------------------+
 |                        DAO INTERFACE + IMPL  (~23)                 |
 |   FarmDao / JdbcFarmDao, SaleDao / JdbcSaleDao, ...                  |
 |   raw SQL via JdbcTemplate — SELECT * + BeanPropertyRowMapper,       |
 |   or a manual RowMapper where column<->property names diverge       |
 +--------------------------------------------------------------------+
                              |
                              v
                    JdbcTemplate / SimpleJdbcInsert
                              |
                              v
                MariaDB Connector/J  (JDBC driver)
                              |
                              v
                   MySQL 8.0 "farm_management"

     Cross-cutting:
       DTO package        — request/response shapes, decoupled from
                             the raw Model/table shape
       Model package       — plain objects mapped 1:1 from DB rows
       GlobalExceptionHandler (@RestControllerAdvice)
                           — AccessDeniedException -> 403
                             DataIntegrityViolationException -> 409
                             UncategorizedDataAccessException -> 400
                             (surfaces trigger SIGNAL messages)
                             RuntimeException -> 404
                             Exception -> 400 (generic fallback)
       AdminInitializer / DemoAccountInitializer
                           — CommandLineRunners; seed the admin account
                             and one demo login per role on first boot
```

### Backend package layout

```
backend/src/main/java/com/farmmanagement/
├── FarmManagementApplication.java
├── controller/   — 26 REST controllers
├── service/      — 25 business-logic classes
├── dao/          — DAO interfaces
│   └── impl/     — Jdbc*Dao implementations
├── dto/          — request/response payloads
├── model/        — DB-row-shaped domain objects
├── exception/    — GlobalExceptionHandler
└── security/
    ├── SecurityConfig.java
    ├── DatabaseUserDetailsService.java
    ├── AdminInitializer.java
    ├── DemoAccountInitializer.java
    └── jwt/      — JwtAuthenticationFilter, token issuing/validation
```

---

## 4. Auth Flow

```
  Browser                    Backend                        Database
     |                          |                                |
     |--- POST /auth/login ---->|                                |
     |                          |--- lookup user_account -------->|
     |                          |<--- row (bcrypt hash) ----------|
     |                          | verify password                 |
     |                          | issue access token (JWT, 15m,   |
     |                          |   in-memory only on client)     |
     |                          | issue refresh token (opaque,    |
     |                          |   7d, httpOnly cookie)           |
     |<-- 200 { accessToken, ---|                                |
     |     accountStatus, ... } |                                |
     |                          |                                |
     |--- GET /api/xyz -------->|                                |
     |   Authorization: Bearer  | JwtAuthenticationFilter          |
     |                          | validates + sets SecurityContext |
     |                          |--- query ---------------------->|
     |                          |<--- rows ------------------------|
     |<-- 200 JSON -------------|                                |
     |                          |                                |
     |  (15 min later: access token expired)                     |
     |--- GET /api/xyz -------->|                                |
     |<-- 401 ------------------|                                |
     |--- POST /auth/refresh -->|                                |
     |   (httpOnly cookie sent  |--- validate refresh hash ------>|
     |    automatically)        |<--- ok --------------------------|
     |<-- 200 { new accessToken}|                                |
     |--- retries original -----|                                |
     |    request automatically |                                |
```

Account lifecycle gating (frontend-enforced, independent of the JWT itself):

```
 user_account.account_status:  INACTIVE --admin activates--> ACTIVE
                                  ^                              |
                                  +----- admin suspends ---------+
                                                 |
                                            SUSPENDED

 Non-ACTIVE + non-ADMIN role  =>  full app shell still renders,
                                    but Sidebar links are disabled
                                    and Dashboard shows
                                    AccountPendingNotice instead of
                                    stats/charts. ADMIN role is
                                    always exempt from this gate.
```

---

## 5. Database (`backend/database/db/`)

```
 21 base tables, grouped by domain:

 Identity & access        Farm operations         Commerce
 -----------------        ----------------         --------
 app_user                 farm                     customer
 user_account             crop                     sale
 employment                crop_disease             sale_item
 attendance                disease                  payment
 notification              equipment
                            equipment_maintenance
                            equipment_usage
                            fertilizer
                            fertilizer_application
                            fertilizer_transaction
                            harvest
                            inventory
                            inventory_transaction

 Every internal id is CHAR(36) with a CHECK(IS_UUID(...)) constraint
 (MySQL 8 has no native UUID column type). sale.public_id and
 payment.public_id are the one exception — human-facing sequential
 references ("SL-000001", "PL-000001") backed by an AUTO_INCREMENT
 column, generated in Java at insert time.

 8 views          vw_employee_directory   vw_sale_summary
                   vw_pending_account_..   vw_payment_ledger
                   vw_farm_overview        vw_inventory_status
                   vw_attendance_log       vw_crop_disease_report

 4 procedures      sp_record_sale_item          (runtime, POS checkout)
                    sp_activate_employee_account (DB-side activation)
                    sp_farm_monthly_revenue      (report)
                    sp_low_stock_report          (report)

 3 triggers         trg_sale_item_before_insert  (reject oversells)
                     trg_sale_item_after_insert   (decrement stock)
                     trg_payment_after_insert     (recompute sale_status)
```

SQL source files, split by concern (`backend/database/db/`):

```
db/
├── run_all.sql          — runs everything below in the correct order
├── create_database.sql  — DROP/CREATE DATABASE
├── create_tables.sql    — all 21 CREATE TABLE statements
├── procedures.sql       — stored procedures
├── triggers.sql         — triggers (must exist before insert_data.sql)
├── views.sql            — views
├── insert_data.sql      — seed data + public_id/working_status backfill
└── queries.sql          — example ad-hoc reports (not auto-run)
```

---

## 6. Request Lifecycle, End to End

```
 [Browser]                                                    [MySQL]
    |                                                             |
    | 1. Page component mounts, calls a service function          |
    |    e.g. saleService.findAll()                                |
    |                                                             |
    | 2. Service calls httpClient.get("/sale/summary")            |
    |    Axios attaches Authorization header                       |
    |                                                             |
    +------------------------- HTTP GET ------------------------->|
                                                                    |
        [Backend]                                                  |
           |                                                       |
           | 3. Security filter chain authenticates the JWT        |
           | 4. SaleController.findAllWithDetails()                |
           |    -> SaleService.findAllWithDetails(username)         |
           |       - resolves caller's role/employment              |
           |       - ADMIN/FARM_MANAGER see all sales;               |
           |         SALES_PERSON sees only their own                |
           |    -> SaleDao.findAllWithDetails(employmentId)          |
           |       - raw SQL JOIN sale/customer/employment/app_user  |
           |------------------------- JDBC query ------------------>|
           |<------------------------ result rows -------------------|
           | 5. RowMapper -> SaleSummaryDto list                     |
           | 6. Controller returns 200 + JSON                        |
    <------------------------- HTTP response ----------------------+
    |                                                             |
    | 7. Service maps DTO -> frontend Sale type                    |
    | 8. React state updates -> component re-renders                |
```
