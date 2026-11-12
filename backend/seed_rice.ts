import prisma from './src/config/prisma.js';

async function updateAndAddRice() {
  // Find Rice & Grains category
  const riceCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: 'rice-grains-and-dals' },
        { name: { contains: 'Rice' } }
      ]
    }
  });

  if (!riceCategory) {
    throw new Error('Rice & Grains category not found!');
  }

  console.log(`Using Category: ${riceCategory.name} (${riceCategory.id})`);

  // 1. Update Basmati Rice
  const basmati = await prisma.product.findFirst({
    where: {
      OR: [
        { sku: 'GG-RGD-001' },
        { name: { contains: 'Basmati' } }
      ]
    }
  });

  if (basmati) {
    await prisma.product.update({
      where: { id: basmati.id },
      data: {
        imageUrl: '/uploads/products/basmati_rice.jpg'
      }
    });
    console.log(`[UPDATED] Basmati Rice -> /uploads/products/basmati_rice.jpg`);
  }

  // 2. Add or Update Jeera Rice
  const existingJeera = await prisma.product.findFirst({
    where: {
      OR: [
        { sku: 'GG-RGD-011' },
        { slug: 'jeera-rice-jeerakasala-1kg' }
      ]
    }
  });

  if (!existingJeera) {
    const newJeera = await prisma.product.create({
      data: {
        sku: 'GG-RGD-011',
        name: 'Jeera Rice (Jeerakasala) 1kg',
        slug: 'jeera-rice-jeerakasala-1kg',
        description: 'Aromatic fine-grain traditional rice perfect for ghee rice, khichdi, and Malabar biryani.',
        categoryId: riceCategory.id,
        price: 110,
        originalPrice: 130,
        discountPercent: 15,
        unit: 'kg',
        packSize: '1 kg',
        stock: 50,
        imageUrl: '/uploads/products/jeera_rice.jpg',
        isFeatured: true,
        isActive: true,
        translations: {
          create: [
            { language: 'ta', name: 'சீரக அரிசி (சீரகசாலா) 1 கிலோ', description: 'நெய் சோறு மற்றும் பிரியாணிக்கு ஏற்ற நறுமணமுள்ள சீரக அரிசி.' },
            { language: 'hi', name: 'जीरा चावल (जीराकासाला) 1 किलो', description: 'घी राइस, खिचड़ी और बिरयानी के लिए सुगंधित बारीक जीरा चावल।' },
            { language: 'te', name: 'జీరా బియ్యం 1 కిలో', description: 'ఘీ రైస్ మరియు బిర్యానీ కోసం పరిమళించే జీరా బియ్యం.' },
            { language: 'kn', name: 'ಜೀರಿಗೆ ಅಕ್ಕಿ 1 ಕೆಜಿ', description: 'ತುಪ್ಪದನ್ನ ಮತ್ತು ಬಿರಿಯಾನಿಗೆ ಸೂಕ್ತವಾದ ಸುವಾಸನೆಯುಳ್ಳ ಜೀರಿಗೆ ಅಕ್ಕಿ.' },
            { language: 'ml', name: 'ജീരകശാല അരി (നെയ്ച്ചോറ്) 1 കി.ഗ്രാം', description: 'നെയ്ച്ചോറിനും മലബാർ ബിരിയാണിക്കും അനുയോജ്യമായ ജീരകശാല അരി.' }
          ]
        }
      }
    });
    console.log(`[CREATED] Jeera Rice -> ${newJeera.sku} | ${newJeera.name}`);
  } else {
    await prisma.product.update({
      where: { id: existingJeera.id },
      data: {
        imageUrl: '/uploads/products/jeera_rice.jpg'
      }
    });
    console.log(`[UPDATED EXISTING] Jeera Rice -> /uploads/products/jeera_rice.jpg`);
  }

  // 3. Add or Update Seeraga Samba Rice
  const existingSamba = await prisma.product.findFirst({
    where: {
      OR: [
        { sku: 'GG-RGD-012' },
        { slug: 'traditional-seeraga-samba-rice-1kg' }
      ]
    }
  });

  if (!existingSamba) {
    const newSamba = await prisma.product.create({
      data: {
        sku: 'GG-RGD-012',
        name: 'Traditional Seeraga Samba Rice 1kg',
        slug: 'traditional-seeraga-samba-rice-1kg',
        description: 'Authentic short-grain South Indian heritage fragrant samba rice, famous for authentic Dindigul and Ambur biryanis.',
        categoryId: riceCategory.id,
        price: 125,
        originalPrice: 150,
        discountPercent: 16,
        unit: 'kg',
        packSize: '1 kg',
        stock: 60,
        imageUrl: '/uploads/products/samba_rice.jpg',
        isFeatured: true,
        isActive: true,
        translations: {
          create: [
            { language: 'ta', name: 'பாரம்பரிய சீரக சம்பா அரிசி 1 கிலோ', description: 'திண்டுக்கல் மற்றும் ஆம்பூர் பிரியாணிக்கு மிகச் சிறந்த பாரம்பரிய சீரக சம்பா அரிசி.' },
            { language: 'hi', name: 'पारंपरिक सीरगा साम्बा चावल 1 किलो', description: 'दक्षिण भारतीय पारंपरिक सुगंधित साम्बा चावल, बिरयानी के लिए सर्वोत्तम।' },
            { language: 'te', name: 'సాంప్రదాయ సీరగ సాంబ బియ్యం 1 కిలో', description: 'బిర్యానీకి అత్యుత్తమమైన సాంప్రదాయ సువాసన గల సాంబ బియ్యం.' },
            { language: 'kn', name: 'ಸಾಂಪ್ರದಾಯಿಕ ಸೀರಗ ಸಾಂಬಾ ಅಕ್ಕಿ 1 ಕೆಜಿ', description: 'ಬಿರಿಯಾನಿ ತಯಾರಿಕೆಗೆ ಅತ್ಯುತ್ತಮವಾದ ಸುವಾಸನೆಯುಕ್ತ ಸಾಂಬಾ ಅಕ್ಕಿ.' },
            { language: 'ml', name: 'പരമ്പരാഗത ശീരക സാംബ അരി 1 കി.ഗ്രാം', description: 'പരമ്പരാഗത സാംബ ബിരിയാണി അരി.' }
          ]
        }
      }
    });
    console.log(`[CREATED] Samba Rice -> ${newSamba.sku} | ${newSamba.name}`);
  } else {
    await prisma.product.update({
      where: { id: existingSamba.id },
      data: {
        imageUrl: '/uploads/products/samba_rice.jpg'
      }
    });
    console.log(`[UPDATED EXISTING] Samba Rice -> /uploads/products/samba_rice.jpg`);
  }

  // 4. Also update Guava, Pizza Cheese, Chicken Cuts from the 6-pack
  const guava = await prisma.product.findUnique({ where: { sku: 'GG-FRU-008' } });
  if (guava) {
    await prisma.product.update({
      where: { sku: 'GG-FRU-008' },
      data: { imageUrl: '/uploads/products/guava.jpg' }
    });
    console.log(`[UPDATED] Fresh Sweet Guava -> /uploads/products/guava.jpg`);
  }

  const pizzaCheese = await prisma.product.findUnique({ where: { sku: 'GG-DAI-010' } });
  if (pizzaCheese) {
    await prisma.product.update({
      where: { sku: 'GG-DAI-010' },
      data: { imageUrl: '/uploads/products/pizza_cheese.jpg' }
    });
    console.log(`[UPDATED] Pizza Cheese -> /uploads/products/pizza_cheese.jpg`);
  }

  const chickenCuts = await prisma.product.findUnique({ where: { sku: 'GG-MET-010' } });
  if (chickenCuts) {
    await prisma.product.update({
      where: { sku: 'GG-MET-010' },
      data: { imageUrl: '/uploads/products/chicken_cuts.jpg' }
    });
    console.log(`[UPDATED] Chicken Cuts -> /uploads/products/chicken_cuts.jpg`);
  }

  // Verify real user photos intact
  const dal = await prisma.product.findUnique({ where: { sku: 'GG-RGD-010' } });
  const milk = await prisma.product.findUnique({ where: { sku: 'GG-DAI-005' } });
  console.log('\n--- VERIFY PRESERVED USER PHOTOS ---');
  console.log(`Dal: ${dal?.sku} | ${dal?.name} -> ${dal?.imageUrl}`);
  console.log(`Milk: ${milk?.sku} | ${milk?.name} -> ${milk?.imageUrl}`);
}

updateAndAddRice().catch(console.error).finally(() => prisma.$disconnect());
