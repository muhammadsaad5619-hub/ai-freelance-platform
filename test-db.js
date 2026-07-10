const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Running manual migration...');
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN "clerkId" TEXT NOT NULL;`);
    console.log('Added clerkId column.');
  } catch (e) {
    console.error('Error adding clerkId:', e.message);
  }
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;`);
    console.log('Made password optional.');
  } catch (e) {
    console.error('Error making password optional:', e.message);
  }

  try {
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");`);
    console.log('Added unique index on clerkId.');
  } catch (e) {
    console.error('Error adding index:', e.message);
  }
}

main().finally(() => prisma.$disconnect());
