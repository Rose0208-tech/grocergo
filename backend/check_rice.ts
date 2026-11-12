import prisma from './src/config/prisma.js';

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      products: true
    }
  });

  const riceCat = categories.find(c => c.name.toLowerCase().includes('rice') || c.slug.includes('rice') || c.name.toLowerCase().includes('grain'));
  console.log('Category found:', riceCat?.name, riceCat?.slug, riceCat?.id);
  if (riceCat) {
    console.log('Products in category:');
    riceCat.products.forEach(p => console.log(`${p.sku} | ${p.name} | ${p.imageUrl?.slice(0, 40)}`));
  }

  // Also check if any products across DB have basmati, samba, or jeera
  const matches = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'Basmati' } },
        { name: { contains: 'Samba' } },
        { name: { contains: 'Jeera' } },
        { name: { contains: 'Guava' } },
        { name: { contains: 'Pizza' } },
        { name: { contains: 'Chicken Cuts' } }
      ]
    }
  });
  console.log('\nMatches across entire DB:');
  matches.forEach(p => console.log(`${p.sku} | ${p.name} | ${p.imageUrl?.slice(0, 40)}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
