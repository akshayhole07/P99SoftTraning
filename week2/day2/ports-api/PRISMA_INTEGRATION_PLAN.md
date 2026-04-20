# Prisma + PostgreSQL Integration Plan

## **Phase 1: Setup & Installation**
1. Install Prisma dependencies
   - `npm install @prisma/client`
   - `npm install -D prisma`

2. Initialize Prisma
   - Run `npx prisma init`
   - This creates `.env` and `prisma/schema.prisma`

3. Configure database connection
   - Set `DATABASE_URL` in `.env` with PostgreSQL credentials
   - `postgresql://user:password@localhost:5432/ports_db`

---

## **Phase 2: Database Schema (Prisma Schema)**
1. Define the `Port` model in `prisma/schema.prisma`
   - Fields: id, unlocode, country, name, port_role, status, createdAt, updatedAt
   - Set `unlocode` as unique
   - Add indexes for filtering

2. Create database migration
   - Run `npx prisma migrate dev --name init`
   - This creates the actual PostgreSQL table

---

## **Phase 3: Create Prisma Client**
1. Create `config/prisma.js` 
   - Import and export PrismaClient instance
   - Handle singleton pattern to avoid multiple instances

---

## **Phase 4: Update Controllers**
1. Replace all JSON file operations with Prisma queries
   - `getAllPorts()` → `prisma.port.findMany()` with filtering & pagination
   - `getPortByCode()` → `prisma.port.findUnique()`
   - `createPort()` → `prisma.port.create()`
   - `updatePort()` → `prisma.port.update()` (if needed)
   - `deletePort()` → `prisma.port.delete()`

2. Add error handling for Prisma exceptions

---

## **Phase 5: Create Seed Script (Optional)**
1. Create `prisma/seed.js`
   - Load data from `data/ports.json`
   - Use Prisma to insert into database

2. Add seed script to `package.json`
   - `"prisma": { "seed": "node prisma/seed.js" }`

---

## **Phase 6: Testing & Cleanup**
1. Test each API endpoint
2. Remove old JSON file-based code
3. Delete `data/ports.json` (if using Prisma seed)
4. Update `.env` template

---

## **Benefits of Prisma**
✅ Type-safe database queries  
✅ Auto-generated migrations  
✅ No raw SQL needed  
✅ Better error handling  
✅ Visual database explorer (`npx prisma studio`)  
✅ Easier to maintain and scale  

---

## **File Structure After Implementation**
```
ports-api/
├── prisma/
│   ├── schema.prisma      (database schema)
│   ├── seed.js            (seed data)
│   └── migrations/        (auto-generated)
├── config/
│   └── prisma.js          (Prisma client)
├── controllers/
│   └── ports.controller.js (updated with Prisma)
├── .env                   (database URL)
└── app.js
```

---

## **Ready for Implementation**
Once you're ready to proceed, let me know and we can execute this plan step by step!
