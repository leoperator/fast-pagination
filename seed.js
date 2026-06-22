const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const TOTAL_RECORDS = 200000;
  const BATCH_SIZE = 10000;
  const categories = ['Electronics', 'Clothing', 'Home', 'Toys', 'Books'];

  console.log('Starting seed...');

  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const batch = [];
    
    for (let j = 0; j < BATCH_SIZE; j++) {
      batch.push({
        name: `Product ${i + j}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 1000) + 1,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      });
    }

    await prisma.product.createMany({
      data: batch,
    });
    
    console.log(`Inserted ${i + BATCH_SIZE} products...`);
  }

  console.log('Seeding complete.');
}

main().catch(console.error).finally(() => prisma.$disconnect());