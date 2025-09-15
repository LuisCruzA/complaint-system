# Complaint Management System

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker\&logoColor=white)


> A minimal **Complaint Management** (mini helpdesk) app with a public submission form and an admin panel to triage complaints: change status, set due dates, and add notes.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [Frontend (Atomic Design)](#frontend-atomic-design)
* [Data Model (≤6 fields per table)](#data-model-≤6-fields-per-table)
* [Quick Start](#quick-start)

  * [Run PostgreSQL with Docker](#run-postgresql-with-docker)
  * [Environment Setup](#environment-setup)
  * [Install & Migrate](#install--migrate)
  * [Run the App](#run-the-app)
* [Useful Commands](#useful-commands)
* [API Reference](#api-reference)
* [Project Structure](#project-structure)
* [Design Decisions & Trade‑offs](#design-decisions--trade-offs)


---

## Overview

📨 **Public side:** users submit their **email** and a **complaint**.

🛠️ **Admin panel:** list complaints, **change status**, **set due date**, and **attach notes**.

The goal is to demonstrate clean separation of **server** and **client** concerns (Next.js App Router + Route Handlers), proper **validation**, and **persistence** using PostgreSQL.

## Features

* ✅ Public complaint form with loading & error states
* ✅ Admin panel: list, search, filter by status, pagination
* ✅ Update **status** (`NEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
* ✅ Set/Clear **due date**
* ✅ Add and view **notes** per complaint
* ✅ PostgreSQL persistence via Prisma ORM
* ✅ Tables limited to **≤ 6 fields** each (challenge constraint)

---

## Architecture

```
Browser (React / Next.js Client Components)
           │
           ▼
Next.js App Router (Server Components)
           │
           ├── Route Handlers (REST):
           │     /api/complaints          (GET list, POST create)
           │     /api/complaints/[id]     (GET detail, PATCH update)
           │     /api/complaints/[id]/notes (GET list, POST create)
           │
           ▼
        Prisma Client  ──▶  PostgreSQL (Docker/local)
```

* **Server-only logic** lives in Route Handlers and DB access (Prisma).
* **Client-only logic** (form interactions, table actions) lives in client components.

---

## Tech Stack

* **Next.js (App Router)** — server/client split, filesystem routing, native API routes
* **TypeScript** — safer code & IDE autocompletion
* **Tailwind CSS** — rapid, consistent styling
* **PostgreSQL** — relational persistence
* **Prisma ORM** — schema, type-safe queries, migrations
* **Zod** — request validation at the API boundary
* **Docker** — easy local DB setup

---

## Frontend (Atomic Design)

The UI components are organized following **Atomic Design** principles:

* **Atoms**: Buttons, Inputs, Labels, Badges
* **Molecules**: Form rows, Search bar, Table row controls
* **Organisms**: Public complaint form, Admin table
* **Pages/Templates**: `/` (public form), `/adminPage` (management panel)

This keeps components **reusable**, **testable**, and easy to evolve.

---

## Data Model (≤6 fields per table)

**Complaint** (6 fields)

| Field         | Type            | Notes                                      |
| ------------- | --------------- | ------------------------------------------ |
| `id`          | `String (cuid)` | primary key                                |
| `email`       | `String`        | submitter email                            |
| `description` | `String`        | complaint text                             |
| `status`      | `Enum`          | `NEW`\|`IN_PROGRESS`\|`RESOLVED`\|`CLOSED` |
| `dueDate`     | `DateTime?`     | optional                                   |
| `createdAt`   | `DateTime`      | default `now()`                            |

**Note** (4 fields)

| Field         | Type            | Notes                     |
| ------------- | --------------- | ------------------------- |
| `id`          | `String (cuid)` | primary key               |
| `complaintId` | `String (fk)`   | references `Complaint.id` |
| `body`        | `String`        | note text                 |
| `createdAt`   | `DateTime`      | default `now()`           |

> Relation: **Complaint 1 ──▶ N Note** (cascade on delete)

---

## Quick Start
## CLONE THIS REPOSITORY FROM MAIN BRANCH

### Run PostgreSQL with Docker

```bash
# from the project root
cat > docker-compose.yml << 'YAML'
version: '3.8'
services:
  db:
    image: postgres:15
    container_name: postgres-complaints
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: complaints
    ports:
      - '5433:5432'
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d complaints"]
      interval: 5s
      timeout: 5s
      retries: 10
volumes:
  db-data:
YAML

# start the DB
docker compose up -d

# (optional) open a psql shell inside the container
docker exec -it postgres-complaints psql -U postgres -d complaints
```

### Environment Setup

Create a `.env.local` file with the required secrets (e.g., `DATABASE_URL`). These values are **not** committed to the repo and will be provided separately.

### Install & Migrate

```bash
# install deps
npm i

# prisma tooling
npm i -D prisma
npm i @prisma/client zod

# generate client & run initial migration
npx prisma generate
npx prisma migrate dev --name init
```

### Run the App

```bash
npm run dev
# Open http://localhost:3000  (public form)
# Open http://localhost:3000/admin  (admin panel)
```

---

## Useful Commands

| Task                  | Command                                          |
| --------------------- | ------------------------------------------------ |
| Start DB (Docker)     | `docker compose up -d`                           |
| Stop DB               | `docker compose down`                            |
| Tail DB logs          | `docker logs -f postgres-complaints`             |
| Reset DB volume ⚠️    | `docker compose down -v && docker compose up -d` |
| Prisma generate       | `npx prisma generate`                            |
| Prisma migrate        | `npx prisma migrate dev --name <name>`           |
| Prisma Studio (DB UI) | `npx prisma studio`                              |
| Dev server            | `npm run dev`                                    |

---

## API Reference

Base URL: `http://localhost:3000`

### Create complaint

`POST /api/complaints`

```json
{
  "email": "user@example.com",
  "description": "The product arrived damaged."
}
```

**201**

```json
{
  "id": "ckr...",
  "email": "user@example.com",
  "description": "The product arrived damaged.",
  "status": "NEW",
  "dueDate": null,
  "createdAt": "2025-09-14T00:00:00.000Z"
}
```

### List complaints (filter/search/paginate)

`GET /api/complaints?status=NEW&q=refund&page=1&pageSize=10`

```json
{
  "total": 42,
  "page": 1,
  "pageSize": 10,
  "items": [ { "id": "...", "email": "...", "status": "NEW", ... } ]
}
```

### Get complaint (with notes)

`GET /api/complaints/:id`

### Update complaint

`PATCH /api/complaints/:id`

```json
{ "status": "IN_PROGRESS", "dueDate": "2025-12-01T00:00:00.000Z" }
```

To clear due date:

```json
{ "dueDate": null }
```

### Notes

* `GET /api/complaints/:id/notes`
* `POST /api/complaints/:id/notes` with body:

```json
{ "body": "Called the customer; awaiting response." }
```

---

## Project Structure

```
src/
  app/
    api/
      complaints/
        route.ts                 # GET list, POST create
        [id]/
          route.ts               # GET detail, PATCH update
          notes/
            route.ts             # GET notes, POST note
    page.tsx                     # public form (client component)
    adminPage/
      page.tsx                   # admin panel (client component)
  lib/
    prisma.ts                    # Prisma client singleton
    validation.ts                # Zod schemas
  components/                    # (Atomic Design) atoms/molecules/organisms
  types/
prisma/
  schema.prisma                  # DB schema
```

---

## Design Decisions & Trade‑offs

* **Next.js App Router** for a clear server/client split and built‑in API routes.
* **Prisma** for DX, migrations, and type safety (instead of raw SQL).
* **Simple REST** (could be GraphQL or tRPC in larger systems).
* **Basic validations with Zod** at the API boundary (lightweight, good DX).

---

