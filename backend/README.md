# 🌾 Agrify - Agriculture Farm Management System

Agrify is a Spring Boot REST API for managing farm operations including farms, crops, employees, equipment, fertilizer, inventory, customers, sales, and payments.

## Features

- Farm, crop, employee, equipment, fertilizer and inventory management
- Customer, sales, and payment management
- CRUD operations
- UUID-based IDs
- User registration and authentication
- Spring Security with HTTP Basic Authentication
- Database triggers and stored procedures
- Global exception handling and validation
- Swagger/OpenAPI documentation

## Technologies

Java 21 • Spring Boot • Spring Web • Spring JDBC • Spring Security • MariaDB • Maven • Swagger/OpenAPI • Lombok • Jakarta Validation

> The application does not use JPA, Hibernate, or any ORM. SQL is accessed manually using JDBC and the DAO pattern, with DTOs for data transfer.

## Architecture

Controller → Service → DAO → JdbcTemplate → MariaDB

## Database

MariaDB is used with manually created SQL tables, foreign keys, UUIDs, triggers, and stored procedures.

## Security

Users register through the API and authenticate using HTTP Basic Authentication. Passwords are encrypted using BCrypt.

## Swagger

After starting the application, open:

`http://localhost:8080/swagger-ui/index.html`

Swagger is used to authenticate and test the API endpoints.

## Running

```bash
git clone https://github.com/Fida-Ukwishaka/Agrify.git
cd Agrify
mvn spring-boot:run
