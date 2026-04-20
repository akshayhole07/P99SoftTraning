import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  const dataPath = join(__dirname, '../data/ports.json');
  const portsData = JSON.parse(readFileSync(dataPath, 'utf8'));

  let created = 0;
  let skipped = 0;
  const errors = [];

  for (const port of portsData) {
    try {
      await prisma.port.create({
        data: {
          unlocode: port.unlocode,
          country: port.country,
          name: port.name,
          port_role: port.port_role,
          status: port.status
        }
      });
      created++;
      console.log(`✓ Created port: ${port.unlocode}`);
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation - port already exists
        skipped++;
        console.log(`⊘ Skipped (already exists): ${port.unlocode}`);
      } else {
        errors.push({ unlocode: port.unlocode, error: error.message });
        console.error(`✗ Error creating port ${port.unlocode}:`, error.message);
      }
    }
  }

  console.log('\n=== Seed Summary ===');
  console.log(`Total records in JSON: ${portsData.length}`);
  console.log(`Successfully created: ${created}`);
  console.log(`Skipped (duplicates): ${skipped}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nError details:');
    errors.forEach(e => console.log(`  - ${e.unlocode}: ${e.error}`));
  }
}

main()
  .catch((e) => {
    console.error('Seed script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
