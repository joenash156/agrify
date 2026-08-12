# Agrify — Frontend Project Onboarding

You are now taking over as the AI coding assistant for the **Agrify** project.

Your first responsibility is **not to implement anything**.

Your responsibility is to understand the project, its purpose, architecture, database design, technology stack, and the code that already exists so that you can continue development intelligently when I provide the next instruction.

---

## 1. Project Overview

**Agrify** is a final academic project for a Database course.

It is a **role-based agriculture/farm management web application** designed to demonstrate practical use of a relational database through a professional frontend application.

The backend is being developed separately by another team member using:

* Spring Boot
* Java
* REST APIs
* Relational database

You are responsible for the **frontend**.

The frontend and backend will eventually communicate through REST APIs.

The frontend therefore needs to be designed with **backend integration in mind from the beginning**.

---

## 2. Frontend Technology Stack

The frontend uses:

* React
* TypeScript
* Vite
* Tailwind CSS
* pnpm

Use **pnpm exclusively**.

Do not switch to npm or yarn.

Do not replace React, TypeScript, Vite, or Tailwind with alternative technologies unless I explicitly request it.

The project environment has already been initialized.

---

## 3. Your Current Task

For this first interaction, **do not start implementing features**.

Do not:

* Create unnecessary files
* Rewrite existing code
* Install unnecessary packages
* Refactor the project
* Create pages that I have not requested
* Invent API endpoints
* Invent business rules
* Replace the current architecture
* Generate mock functionality just for the sake of having something running

Instead, **familiarize yourself with the existing project**.

Inspect the codebase carefully.

Understand:

* Current folder structure
* Existing components
* Existing pages
* Routing
* Layouts
* Tailwind configuration
* Theme implementation
* Existing TypeScript types
* Existing hooks
* Existing utilities
* Existing API/service code
* Existing state management
* Existing forms
* Existing tables
* Existing authentication/authorization work, if any
* Existing dependencies
* Existing design patterns
* Existing naming conventions

Do not assume that the project is empty just because you have not been given individual files in this prompt.

**The actual code currently present in the repository is the source of truth for the frontend implementation.**

---

# 4. Database / Domain Context

The frontend is based on the following relational database design.

### APP_USER

* user_id
* first_name
* last_name
* email
* phone_number
* other_phone_number
* created_at
* updated_at

### USER_ACCOUNT

* account_id
* user_id
* username
* password_hash
* account_status
* created_at
* updated_at

A user may have one account.

---

### FARM

* farm_id
* farm_name
* location
* size
* farm_status
* created_at
* updated_at

A farm can have multiple employees, crops, and equipment.

---

### EMPLOYMENT

* employment_id
* user_id
* farm_id
* role
* salary
* hire_date
* employment_status

Employment connects users to farms.

---

### CROP

* crop_id
* farm_id
* crop_name
* crop_variety
* planting_date
* expected_harvest_date
* crop_status

A farm can grow multiple crops.

---

### DISEASE

* disease_id
* disease_name
* description

### CROP_DISEASE

* crop_id
* disease_id
* detected_date
* severity
* treatment

This represents diseases affecting crops.

---

### EQUIPMENT

* equipment_id
* farm_id
* equipment_name
* equipment_type
* purchase_date
* purchase_cost
* equipment_status

### EQUIPMENT_MAINTENANCE

* maintenance_id
* equipment_id
* maintenance_date
* maintenance_type
* cost
* description

### EQUIPMENT_USAGE

* usage_id
* equipment_id
* employment_id
* usage_date
* hours_used

Equipment belongs to farms, receives maintenance, and can be used by employees.

---

### FERTILIZER

* fertilizer_id
* fertilizer_name
* fertilizer_type
* unit_price
* quantity

### FERTILIZER_APPLICATION

* application_id
* crop_id
* employment_id
* fertilizer_id
* application_date
* quantity
* notes

### FERTILIZER_TRANSACTION

* transaction_id
* fertilizer_id
* transaction_type
* quantity
* unit_price
* transaction_date

---

### HARVEST

* harvest_id
* crop_id
* harvest_date
* quantity
* unit
* quality_grade

A crop can produce multiple harvest records.

---

### INVENTORY

* inventory_id
* harvest_id
* item_name
* quantity
* unit
* storage_location

### INVENTORY_TRANSACTION

* transaction_id
* inventory_id
* transaction_type
* quantity
* transaction_date

Harvests create inventory, and inventory has transaction history.

---

### CUSTOMER

* customer_id
* first_name
* last_name
* phone_number
* email
* address

---

### SALE

* sale_id
* customer_id
* employment_id
* sale_date
* total
* sale_status

### SALE_ITEM

* sale_item_id
* sale_id
* inventory_id
* quantity
* unit_price
* subtotal

### PAYMENT

* payment_id
* sale_id
* amount
* payment_method
* payment_date
* payment_status

The sales flow is essentially:

**Customer → Sale → Sale Items → Inventory**

and:

**Sale → Payments**

---

### ATTENDANCE

* attendance_id
* employment_id
* attendance_date
* check_in
* check_out
* attendance_status

Employees have attendance records.

---

# 5. Important Relationships

Keep the relational structure in mind when building frontend features.

Conceptually:

```text
Farm
 ├── Employees
 ├── Crops
 │    ├── Diseases
 │    ├── Fertilizer Applications
 │    └── Harvests
 │          └── Inventory
 │
 └── Equipment
      ├── Maintenance
      └── Usage
```

Another important flow is:

```text
Fertilizer
 ├── Applications
 └── Transactions
```

And:

```text
Inventory
 ├── Transactions
 └── Sales
       └── Sale Items
             └── Inventory
       └── Payments
```

Do not treat the entities as completely unrelated CRUD screens.

The relationships should eventually be reflected naturally in the application's workflows and UI.

---

# 6. Visual Design

Agrify should have a **simple, clean, professional dashboard design**.

The primary color is:

**Teal**

Supporting colors:

* White
* Black
* Dark Zinc

The application must support:

* Light mode
* Dark mode

Dark mode should primarily use dark Zinc/neutral surfaces rather than relying entirely on pure black.

The design should feel like a serious farm-management/business application.

Prefer:

* Clean spacing
* Simple cards
* Professional tables
* Clear forms
* Subtle borders
* Clear typography
* Consistent buttons
* Clear status badges
* Simple navigation
* Useful icons

Avoid:

* Excessive gradients
* Glassmorphism
* Excessive animations
* Overly decorative dashboards
* Excessive shadows
* Excessive rounded cards
* Unnecessary visual effects
* "Fancy AI-generated UI"

**Functionality and usability are more important than decoration.**

---

# 7. Role-Based Application

Agrify is a **role-based dashboard application**.

The exact roles and permissions may be clarified later.

The frontend should therefore be architected so that different users can eventually see different:

* Navigation items
* Pages
* Actions
* Dashboard information
* Management capabilities

However, do not invent a final authorization system if one does not already exist in the codebase.

The backend will ultimately be responsible for enforcing security and authorization.

Frontend authorization should primarily control the user experience and navigation.

---

# 8. Backend Integration

The Spring Boot backend is being developed separately.

The frontend should therefore have a clean separation between:

```text
UI
 ↓
Pages / Features
 ↓
Hooks / State
 ↓
API / Service Layer
 ↓
Spring Boot REST API
```

Avoid putting raw API requests directly throughout UI components.

When backend endpoints are eventually provided, the frontend should be able to connect them through a centralized service/API layer.

Do not invent backend endpoints unless I explicitly ask you to create temporary mock endpoints.

If the backend API contract is not yet available, clearly distinguish between:

* Existing backend contracts
* Assumptions
* Temporary mock data

---

# 9. Future AI Integration

Agrify may receive AI functionality later.

This could potentially include:

* Agricultural recommendations
* Crop insights
* Disease assistance
* Farm analytics
* Natural-language queries
* AI-generated summaries
* Other AI functionality exposed by the backend

Do **not** implement AI functionality now.

However, keep the architecture prepared for it.

A future structure may look conceptually like:

```text
src/
 ├── api/
 │    ├── client.ts
 │    ├── farms.api.ts
 │    ├── crops.api.ts
 │    ├── inventory.api.ts
 │    ├── sales.api.ts
 │    └── ai.api.ts
```

The exact structure should follow what already exists in the project.

The important idea is that future AI requests should be treated as API/service operations rather than being embedded directly inside React components.

This should make it easy to connect a future Spring Boot AI endpoint to the frontend.

---

# 10. TypeScript

Use TypeScript properly.

The domain entities should eventually have clear types/interfaces.

Examples:

```text
User
UserAccount
Farm
Employment
Crop
Disease
CropDisease
Equipment
EquipmentMaintenance
EquipmentUsage
Fertilizer
FertilizerApplication
FertilizerTransaction
Harvest
Inventory
InventoryTransaction
Customer
Sale
SaleItem
Payment
Attendance
```

Do not use `any` unnecessarily.

Do not create complicated types simply for abstraction's sake.

Follow the existing project's conventions after inspecting the code.

---

# 11. Mock Data

Mock data may be used temporarily when a frontend feature needs to be demonstrated before the Spring Boot backend is ready.

However, mock data should be separated from the UI.

The desired architecture is:

```text
React Component
      ↓
Service / Hook
      ↓
Mock API
      ↓
Mock Data
```

which can later become:

```text
React Component
      ↓
Service / Hook
      ↓
Spring Boot API
      ↓
Database
```

The UI should not have to be rewritten simply because mock data is replaced by real API responses.

---

# 12. Codebase Familiarization Rules

Before the next development instruction, inspect the existing code and determine:

1. How the project is currently structured.
2. What components already exist.
3. What pages already exist.
4. How routing is implemented.
5. How dark/light mode is implemented.
6. How Tailwind is configured.
7. How reusable UI components are organized.
8. Whether an API layer already exists.
9. Whether TypeScript domain types already exist.
10. Whether authentication/role handling already exists.
11. What dependencies are already installed.
12. What conventions the existing code follows.

**Do not replace existing patterns simply because you would personally structure the project differently.**

If the existing architecture is reasonable, build on it.

If you notice something that could eventually be improved, do not immediately refactor it.

Wait until a task actually requires the change or I explicitly ask for architectural improvements.

---

# 13. How You Should Respond After Inspection

After familiarizing yourself with the repository, give me a **short onboarding report**, not an implementation.

Tell me:

### Project Structure

What the current frontend structure looks like.

### Existing Features

What has already been implemented.

### Architecture

How routing, components, state, API communication, and other major pieces are currently organized.

### Styling

How Tailwind and light/dark mode are currently handled.

### Backend Readiness

What already exists for future Spring Boot integration.

### Potential Concerns

Only mention important issues that could affect future development.

### Understanding

Briefly confirm your understanding of how the Agrify domain and ERD relate to the frontend.

Do not start fixing those concerns yet.

Do not create new features.

Do not modify the code merely because you found something you would normally do differently.

---

# 14. Most Important Instruction

For this onboarding stage:

**Inspect first. Understand first. Wait for my next instruction.**

Do not begin building Agrify just yet.

Once you have inspected the existing codebase and reported your understanding, stop and wait.

I will then provide the next development task, and we will continue building Agrify incrementally from there.
