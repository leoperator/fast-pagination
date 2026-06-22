# Product Feed API

A high-performance Node.js backend built to serve and paginate a dataset of 200,000 products. Engineered to handle real-time data mutations without duplicating or dropping records, while maintaining sub-150ms database execution times.

## Live Demo
https://fast-pagination-8km6.onrender.com

## Core Engineering & Optimizations

This project was built to solve specific database scaling and pagination traps:

* **Stable Cursor Pagination:** Traditional `OFFSET/LIMIT` pagination fails if data shifts (insertions/deletions) during browsing. This API uses a cursor-based approach, anchoring queries to a physical row to guarantee zero duplicates and zero skipped items, even in a highly mutable environment.
* **Tie-Breaker Indexing (Sub-150ms Queries):** Sorting solely by `created_at` on a non-unique column forces the database into a catastrophic sequential scan. By implementing a composite index `@@index([created_at(sort: Desc), id(sort: Desc)])`, the query shifts from an O(N) full table scan to a fast O(log N) lookup.
* **In-Memory Batched Seeding:** Inserting 200,000 records sequentially in a loop triggers an N+1 network bottleneck. Conversely, sending all 200K at once crashes the Node V8 engine and triggers Postgres's hard 65,535 parameter limit. The `seed.js` script solves this by generating data entirely in-memory and executing bulk inserts in calculated chunks of 10,000.
* **Zero-Latency Frontend Rendering:** The included UI generates deterministic SVG placeholder graphics directly in the browser memory using the product ID. This eliminates the network bottleneck of third-party image hosting, exposing the true speed of the backend.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted on Supabase)
* **ORM:** Prisma
* **Deployment:** Render

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a .env file in the root directory and add your PostgreSQL connection string:
```bash
DATABASE_URL="postgresql://user:password@host:port/dbname"
```

### 3. Database Sync & Seeding
Push the schema to your database and generate the 200,000 dummy products:
```bash
npx prisma db push
npm run seed
```

### 4. Run the server
```
npm run dev
```

The server will start on http://localhost:3000

### 5. API Endpoints

GET /api/products
Fetches a paginated list of products, sorted newest first.

Query Parameters:

```limit``` (optional): Number of items per page (default: 12).

```cursor``` (optional): The ID of the last product from the previous page.

```category``` (optional): Filter products by a specific category.

Example Request
```GET /api/products?limit=12&cursor=150242&category=Electronics```
