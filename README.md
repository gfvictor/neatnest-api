<div align="center">
<img alt="NeatNest Logo" height="450" src="/assets/images/neatnest-logo-dark.svg" width="450"/>
</div>

<div align="center">
<i>A well-structured API for managing household and workplace objects efficiently</i>
</div>

---

## Index
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Configure Environment Variables](#configure-environment-variables)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Database Synchronization](#database-synchronization)
  - [Database Migration](#database-migration)
  - [Database Modifications](#database-modifications)
  - [Access Prisma Studio](#access-prisma-studio)
  - [Production Mode](#production-mode)
- [Database Schema](#database-schema)
  - [User Table](#user-table-codeusercode)
  - [Household Table](#household-table-codehouseholdcode)
  - [Room Table](#room-table-coderoomcode)
  - [Workplace Table](#workplace-table-codeworkplacecode)
  - [Section Table](#section-table-codesectioncode)
  - [Container Table](#container-table-codecontainercode)
  - [Object Table](#object-table-codeobjectcode)
- [License](#licence)


---

## Overview

**NeatNest** is a scalable, RESTful API developed using **NestJS** and **Prisma**, designed to facilitate the 
efficient 
management of household and workplace inventories. This system enables users to categorize and track objects within 
designated rooms, sections, and containers. **NeatNest** incorporates role-based authentication and session 
management to 
enhance security and accessibility.

---

## Technology Stack
- **NestJS** - Node.js framework for building efficient and scalable server-side applications.
- **Prisma ORM** - Modern database toolkit to streamline interactions with PostgreSQL.
- **PostgreSQL** - Relational database solution hosted via Supabase.
- **Supabase Auth** - Handles authentication and JWT issuance; a signup strategy provisions the local `User` profile on first sign-in.
- **Class-validator** - Enables robust DTO-based request validation.
- **Swagger** - API documentation and interactive testing.


**[Back to Index](#index)**

---

## Installation Guide
### Prerequisites
_Ensure that the following dependencies are installed before proceeding:_

- Node.js (v18+)
- PostgreSQL database (Supabase recommended)
- NPM or Yarn

### Clone the Repository
```bash
git clone https://github.com/gfvictor/neatnest-api.git
cd neatnest-api
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a <code>.env</code> file in the root directory and set the necessary configurations:
```dotenv
DATABASE_URL=postgresql://user:password@host:port/dbname
DIRECT_URL=provided-by-supabase
SUPABASE_URL=provided-by-supabase
SUPABASE_KEY=provided-by-supabase
JWT_SECRET_KEY=your_jwt_secret
PORT=3000
TZ=your-timezone
```

**[Back to Index](#index)**

---

## Running the Application
### Development Mode
```bash
npm run start:dev
```

### Database Synchronization
```bash
npx prisma db pull
```

### Database Migration
```bash
npx prisma migrate dev --name init
```

### Database Modifications
```bash
npx prisma generate
```

### Access Prisma Studio
```bash
npm prisma studio
```

### Production Mode
```bash
npm run build
npm run start
```

**[Back to Index](#index)**

---

## Database Schema
The database follows a relational structure using **PostgreSQL**,  managed via **Prisma ORM**.

### User Table (<code>User</code>)
| Column      | Type     | Constraints                                        |
|-------------|----------|-----------------------------------------------------|
| id          | String   | Primary key (Supabase Auth user id)                |
| name        | String   | Not null                                           |
| email       | String   | Unique, Not null                                   |
| avatar      | String   | Nullable                                           |
| homeUse     | Boolean  | Default: true                                      |
| workUse     | Boolean  | Default: true                                      |
| role        | Enum     | [USER, ADMIN, TESTER] <br/>Default: USER           |
| createdAt   | DateTime | Auto-generated                                     |
| updatedAt   | DateTime | Auto-updated                                       |
| deletedAt   | DateTime | Nullable                                           |
| householdId | String   | Nullable, Foreign key (<code>Household.id</code>)  |
| workplaceId | String   | Nullable, Foreign key (<code>Workplace.id</code>)  |


### Household Table (<code>Household</code>)
| Column    | Type     | Constraints                 |
|-----------|----------|-----------------------------|
| id        | UUID     | Primary key, Auto-generated |
| createdAt | DateTime | Auto-generated              |
| updatedAt | DateTime | Auto-updated                |
| deletedAt | DateTime | Nullable                    |


### Room Table (<code>Room</code>)
| Column      | Type     | Constraints                             |
|-------------|----------|-----------------------------------------|
| id          | UUID     | Primary key, Auto-generated             |
| name        | String   | Not null                                |
| createdAt   | DateTime | Auto-generated                          |
| updatedAt   | DateTime | Auto-updated                            |
| deletedAt   | DateTime | Nullable                                |
| householdId | UUID     | Foreign key (<code>Household.id</code>) |


### Workplace Table (<code>Workplace</code>)
| Column    | Type     | Constraints                 |
|-----------|----------|-----------------------------|
| id        | UUID     | Primary key, Auto-generated |
| createdAt | DateTime | Auto-generated              |
| updatedAt | DateTime | Auto-updated                |
| deletedAt | DateTime | Nullable                    |


### Section Table (<code>Section</code>)
| Column      | Type     | Constraints                             |
|-------------|----------|-----------------------------------------|
| id          | UUID     | Primary key, Auto-generated             |
| name        | String   | Not null                                |
| createdAt   | DateTime | Auto-generated                          |
| updatedAt   | DateTime | Auto-updated                            |
| deletedAt   | DateTime | Nullable                                |
| workplaceId | UUID     | Foreign key (<code>Workplace.id</code>) |

### Container Table (<code>Container</code>)
| Column    | Type     | Constraints                                           |
|-----------|----------|-------------------------------------------------------|
| id        | UUID     | Primary key, Auto-generated                           |
| name      | String   | Not null                                              |
| number    | Int      | Nullable                                              |
| image     | String   | Nullable                                              |
| createdAt | DateTime | Auto-generated                                        |
| updatedAt | DateTime | Auto-updated                                          |
| deletedAt | DateTime | Nullable                                              |
| roomId    | UUID     | Foreign key (<code>Room.id</code>) <br>or Nullable    |
| sectionId | UUID     | Foreign key (<code>Section.id</code>) <br>or Nullable |

### Object Table (<code>Object</code>)
| Column      | Type     | Constraints                             |
|-------------|----------|-----------------------------------------|
| id          | UUID     | Primary key, Auto-generated             |
| name        | String   | Not null                                |
| quantity    | Int      | Not null                                |
| category    | String   | Nullable                                |
| image       | String   | Nullable                                |
| createdAt   | DateTime | Auto-generated                          |
| updatedAt   | DateTime | Auto-updated                            |
| deletedAt   | DateTime | Nullable                                |
| containerId | UUID     | Foreign key (<code>Container.id</code>) |

**[Back to Index](#index)**

---
## Licence

This project is licensed under the **Apache Licence 2.0**.
