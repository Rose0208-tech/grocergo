const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products51 = [
  // 1. Rice
  {
    name: 'Rice',
    categorySlug: 'rice-and-grains',
    sku: 'GG-PROD-001',
    description: 'Aromatic traditional boiled raw rice grains aged for superior fluffiness and taste.',
    price: 58,
    originalPrice: 65,
    discountPercent: 11,
    unit: 'kg',
    packSize: '1 kg',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'அரிசி', description: 'பாரம்பரிய சுவையான தரமான அரிசி.' },
      hi: { name: 'चावल', description: 'ताज़ा और स्वादिष्ट बढ़िया चावल।' },
      te: { name: 'బియ్యం', description: 'నాణ్యమైన తాజా బియ్యం.' },
      kn: { name: 'ಅಕ್ಕಿ', description: 'ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಅಕ್ಕಿ.' },
      ml: { name: 'അരി', description: 'ഉയർന്ന നിലവാരമുള്ള നല്ല അരി.' }
    }
  },
  // 2. Wheat Flour
  {
    name: 'Wheat Flour',
    categorySlug: 'flour-and-atta',
    sku: 'GG-PROD-002',
    description: '100% stone-ground whole wheat atta flour rich in dietary fibre for soft rotis.',
    price: 45,
    originalPrice: 52,
    discountPercent: 13,
    unit: 'kg',
    packSize: '1 kg',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'கோதுமை மாவு', description: 'மென்மையான சப்பாத்திக்கான சுத்தமான கோதுமை மாவு.' },
      hi: { name: 'गेहूं का आटा', description: 'मुलायम रोटियों के लिए शुद्ध चक्की आटा।' }
    }
  },
  // 3. Sugar
  {
    name: 'Sugar',
    categorySlug: 'sugar-salt-and-spices',
    sku: 'GG-PROD-003',
    description: 'Sulphur-free sparkling white crystal sugar refined naturally for everyday beverages.',
    price: 44,
    originalPrice: 48,
    discountPercent: 8,
    unit: 'kg',
    packSize: '1 kg',
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'சர்க்கரை', description: 'சுத்திகரிக்கப்பட்ட வெள்ளை சர்க்கரை.' },
      hi: { name: 'चीनी', description: 'सफेद दानेदार शुद्ध चीनी।' }
    }
  },
  // 4. Toor Dal
  {
    name: 'Toor Dal',
    categorySlug: 'pulses-and-dals',
    sku: 'GG-PROD-004',
    description: 'Unpolished premium yellow pigeon peas rich in plant protein for authentic sambar.',
    price: 155,
    originalPrice: 175,
    discountPercent: 11,
    unit: 'kg',
    packSize: '1 kg',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'துவரம் பருப்பு', description: 'சுவையான சாம்பாருக்கான துவரம் பருப்பு.' },
      hi: { name: 'अरहर / तूर दाल', description: 'शुद्ध और प्रोटीन युक्त अरहर दाल।' }
    }
  },
  // 5. Moong Dal
  {
    name: 'Moong Dal',
    categorySlug: 'pulses-and-dals',
    sku: 'GG-PROD-005',
    description: 'Easy-to-digest washed yellow split moong dal, wholesome and nutritious.',
    price: 130,
    originalPrice: 145,
    discountPercent: 10,
    unit: 'kg',
    packSize: '1 kg',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பாசிப் பருப்பு', description: 'எளிதில் செரிக்கும் ஆரோக்கியமான பாசிப் பருப்பு.' },
      hi: { name: 'मूंग दाल', description: 'पौष्टिक और सुपाच्य पीली मूंग दाल।' }
    }
  },
  // 6. Cooking Oil
  {
    name: 'Cooking Oil',
    categorySlug: 'cooking-oil-and-ghee',
    sku: 'GG-PROD-006',
    description: 'Fortified healthy sunflower refined cooking oil with natural Vitamin E.',
    price: 135,
    originalPrice: 155,
    discountPercent: 13,
    unit: 'L',
    packSize: '1 L pouch',
    stock: 110,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'சமையல் எண்ணெய்', description: 'ஆரோக்கியமான சுத்திகரிக்கப்பட்ட சமையல் எண்ணெய்.' },
      hi: { name: 'कुकिंग ऑयल', description: 'स्वास्थ्यवर्धक शुद्ध कुकिंग ऑयल।' }
    }
  },
  // 7. Salt
  {
    name: 'Salt',
    categorySlug: 'sugar-salt-and-spices',
    sku: 'GG-PROD-007',
    description: 'Vacuum-evaporated pure iodized white table salt for essential daily thyroid health.',
    price: 24,
    originalPrice: 28,
    discountPercent: 14,
    unit: 'kg',
    packSize: '1 kg',
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'உப்பு', description: 'அயோடின் கலந்த சுத்தமான சமையல் உப்பு.' },
      hi: { name: 'नमक', description: 'आयोडीन युक्त शुद्ध सफेद नमक।' }
    }
  },
  // 8. Tea Powder
  {
    name: 'Tea Powder',
    categorySlug: 'tea-and-coffee',
    sku: 'GG-PROD-008',
    description: 'Strong aromatic CTC black tea powder offering deep rich colour and invigorating taste.',
    price: 140,
    originalPrice: 160,
    discountPercent: 12,
    unit: 'g',
    packSize: '500 g',
    stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'தேயிலை தூள்', description: 'மணம் வீசும் ஸ்ட்ராங் டீத்தூள்.' },
      hi: { name: 'चाय पत्ती', description: 'कड़क और खुशबूदार बढ़िया चाय।' }
    }
  },
  // 9. Coffee Powder
  {
    name: 'Coffee Powder',
    categorySlug: 'tea-and-coffee',
    sku: 'GG-PROD-009',
    description: 'South Indian authentic filter coffee powder blend of roasted Arabica and Robusta beans.',
    price: 165,
    originalPrice: 185,
    discountPercent: 11,
    unit: 'g',
    packSize: '500 g',
    stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'காபி தூள்', description: 'மணமணக்கும் பாரம்பரிய பில்டர் காபி தூள்.' },
      hi: { name: 'कॉफी पाउडर', description: 'स्वादिष्ट और ताजगी से भरपूर कॉफी पाउडर।' }
    }
  },
  // 10. Biscuits
  {
    name: 'Biscuits',
    categorySlug: 'snacks-and-biscuits',
    sku: 'GG-PROD-010',
    description: 'Crispy, baked golden glucose and butter tea-time biscuits loved across generations.',
    price: 30,
    originalPrice: 35,
    discountPercent: 14,
    unit: 'pack',
    packSize: '250 g pack',
    stock: 140,
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பிஸ்கட்', description: 'மொறுமொறுப்பான சுவையான டீ பிஸ்கட்.' },
      hi: { name: 'बिस्कुट', description: 'क्रिस्पी और स्वादिष्ट चाय बिस्कुट।' }
    }
  },
  // 11. Milk
  {
    name: 'Milk',
    categorySlug: 'milk-and-dairy',
    sku: 'GG-PROD-011',
    description: 'Pasteurized fresh cow toned milk rich in calcium and natural proteins.',
    price: 32,
    originalPrice: 35,
    discountPercent: 8,
    unit: 'ml',
    packSize: '500 ml pouch',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பால்', description: 'புதிய பசும்பால், ஊட்டச்சத்து நிறைந்தது.' },
      hi: { name: 'दूध', description: 'ताज़ा और शुद्ध पौष्टिक गाय का दूध।' }
    }
  },
  // 12. Curd
  {
    name: 'Curd',
    categorySlug: 'milk-and-dairy',
    sku: 'GG-PROD-012',
    description: 'Thick creamy homemade-style probiotic dahi curd made from wholesome farm milk.',
    price: 35,
    originalPrice: 40,
    discountPercent: 12,
    unit: 'g',
    packSize: '400 g cup',
    stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'தயிர்', description: 'கெட்டியான சுவையான புதிய தயிர்.' },
      hi: { name: 'दही', description: 'गाढ़ा और ताज़ा स्वादिष्ट दही।' }
    }
  },
  // 13. Butter
  {
    name: 'Butter',
    categorySlug: 'milk-and-dairy',
    sku: 'GG-PROD-013',
    description: 'Pure churned salted pasteurized table butter, creamy and golden.',
    price: 56,
    originalPrice: 62,
    discountPercent: 10,
    unit: 'g',
    packSize: '100 g pack',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'வெண்ணெய்', description: 'சுவையான புதிய கிரீமி வெண்ணெய்.' },
      hi: { name: 'मक्खन', description: 'स्वादिष्ट और मलाईदार शुद्ध मक्खन।' }
    }
  },
  // 14. Cheese
  {
    name: 'Cheese',
    categorySlug: 'milk-and-dairy',
    sku: 'GG-PROD-014',
    description: 'Rich, smooth processed cheddar cheese slices ideal for toasts, sandwiches, and parathas.',
    price: 125,
    originalPrice: 140,
    discountPercent: 11,
    unit: 'pack',
    packSize: '200 g (10 slices)',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'சீஸ்', description: 'கிரீமியான சுவையான சீஸ் ஸ்லைஸ்.' },
      hi: { name: 'चीज़', description: 'स्वादिष्ट और पौष्टिक चीज़ स्लाइस।' }
    }
  },
  // 15. Paneer
  {
    name: 'Paneer',
    categorySlug: 'milk-and-dairy',
    sku: 'GG-PROD-015',
    description: 'Fresh malai cottage cheese cubes, melt-in-the-mouth texture for curries and tikka.',
    price: 95,
    originalPrice: 110,
    discountPercent: 14,
    unit: 'g',
    packSize: '200 g block',
    stock: 65,
    imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பன்னீர்', description: 'மென்மையான புதிய மில்க் பன்னீர்.' },
      hi: { name: 'पनीर', description: 'ताज़ा और मलाईदार शुद्ध पनीर।' }
    }
  },
  // 16. Bread
  {
    name: 'Bread',
    categorySlug: 'bread-and-bakery',
    sku: 'GG-PROD-016',
    description: 'Freshly baked soft white sandwich loaf prepared with nourishing fortified flour.',
    price: 40,
    originalPrice: 45,
    discountPercent: 11,
    unit: 'pack',
    packSize: '400 g loaf',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'ரொட்டி / பிரெட்', description: 'மென்மையான புதிய சாண்ட்விச் ரொட்டி.' },
      hi: { name: 'ब्रेड', description: 'ताज़ा और मुलायम सफेद ब्रेड।' }
    }
  },
  // 17. Eggs
  {
    name: 'Eggs',
    categorySlug: 'eggs',
    sku: 'GG-PROD-017',
    description: 'Farm-fresh white table eggs rich in high-grade biological protein and choline.',
    price: 75,
    originalPrice: 85,
    discountPercent: 12,
    unit: 'pack',
    packSize: '12 pcs pack',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'முட்டை', description: 'பண்ணை புதிய வெள்ளை முட்டைகள்.' },
      hi: { name: 'अंडे', description: 'ताज़े और पौष्टिक फार्म अंडे।' }
    }
  },
  // 18. Apple
  {
    name: 'Apple',
    categorySlug: 'fruits',
    sku: 'GG-PROD-018',
    description: 'Crisp, sweet, handpicked Royal Delicious red apples direct from Himachal orchards.',
    price: 160,
    originalPrice: 190,
    discountPercent: 15,
    unit: 'kg',
    packSize: '1 kg',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'ஆப்பிள்', description: 'இனிப்பான சுவையான சிம்லா ஆப்பிள்.' },
      hi: { name: 'सेब', description: 'ताज़ा, मीठा और रसीला सेब।' }
    }
  },
  // 19. Banana
  {
    name: 'Banana',
    categorySlug: 'fruits',
    sku: 'GG-PROD-019',
    description: 'Naturally ripened sweet yellow Robusta bananas loaded with potassium and quick energy.',
    price: 45,
    originalPrice: 50,
    discountPercent: 10,
    unit: 'dozen',
    packSize: '12 pcs',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'வாழைப்பழம்', description: 'இயற்கையாக பழுத்த நாட்டு வாழைப்பழம்.' },
      hi: { name: 'केला', description: 'ताज़ा और मीठा पीला केला।' }
    }
  },
  // 20. Orange
  {
    name: 'Orange',
    categorySlug: 'fruits',
    sku: 'GG-PROD-020',
    description: 'Sweet and tangy Nagpur mandarins bursting with Vitamin C and refreshing juice.',
    price: 90,
    originalPrice: 110,
    discountPercent: 18,
    unit: 'kg',
    packSize: '1 kg',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'ஆரஞ்சு பழம்', description: 'சாறு நிறைந்த இனிப்பான ஆரஞ்சு.' },
      hi: { name: 'संतरा', description: 'रसीला और मीठा नागपुरी संतरा।' }
    }
  },
  // 21. Grapes
  {
    name: 'Grapes',
    categorySlug: 'fruits',
    sku: 'GG-PROD-021',
    description: 'Fresh crisp green seedless Thomson grapes, sweet and hydrating.',
    price: 85,
    originalPrice: 100,
    discountPercent: 15,
    unit: 'g',
    packSize: '500 g box',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'திராட்சை', description: 'விதை இல்லாத புதிய இனிப்பு திராட்சை.' },
      hi: { name: 'अंगूर', description: 'मीठे और ताज़े हरे अंगूर।' }
    }
  },
  // 22. Mango
  {
    name: 'Mango',
    categorySlug: 'fruits',
    sku: 'GG-PROD-022',
    description: 'Aromatic king of fruits Alphonso mangoes, honey-sweet saffron pulp.',
    price: 240,
    originalPrice: 280,
    discountPercent: 14,
    unit: 'kg',
    packSize: '1 kg',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'மாம்பழம்', description: 'சுவையான அல்போன்சா மாம்பழம்.' },
      hi: { name: 'आम', description: 'रसीला और बेहद मीठा आम।' }
    }
  },
  // 23. Potato
  {
    name: 'Potato',
    categorySlug: 'vegetables',
    sku: 'GG-PROD-023',
    description: 'Farm-fresh smooth skin potatoes, great for curries, fries, and daily cooking.',
    price: 36,
    originalPrice: 42,
    discountPercent: 14,
    unit: 'kg',
    packSize: '1 kg',
    stock: 130,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'உருளைக்கிழங்கு', description: 'பண்ணை புதிய உருளைக்கிழங்கு.' },
      hi: { name: 'आलू', description: 'ताज़ा और बढ़िया पहाड़ी आलू।' }
    }
  },
  // 24. Tomato
  {
    name: 'Tomato',
    categorySlug: 'vegetables',
    sku: 'GG-PROD-024',
    description: 'Plump ripe country red tomatoes filled with tangy natural richness.',
    price: 30,
    originalPrice: 38,
    discountPercent: 21,
    unit: 'kg',
    packSize: '1 kg',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'தக்காளி', description: 'நாத்து புதிய நாட்டு தக்காளி.' },
      hi: { name: 'टमाटर', description: 'लाल और ताज़ा देसी टमाटर।' }
    }
  },
  // 25. Onion
  {
    name: 'Onion',
    categorySlug: 'vegetables',
    sku: 'GG-PROD-025',
    description: 'High-pungency dry pink Nashik red onions essential for curries and gravies.',
    price: 42,
    originalPrice: 50,
    discountPercent: 16,
    unit: 'kg',
    packSize: '1 kg',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'வெங்காயம்', description: 'காரசாரமான தரமான நாசிக் வெங்காயம்.' },
      hi: { name: 'प्याज', description: 'ताज़ा और तीखा लाल प्याज।' }
    }
  },
  // 26. Carrot
  {
    name: 'Carrot',
    categorySlug: 'vegetables',
    sku: 'GG-PROD-026',
    description: 'Sweet juicy crunchy red Delhi carrots loaded with natural beta-carotene.',
    price: 48,
    originalPrice: 58,
    discountPercent: 17,
    unit: 'kg',
    packSize: '1 kg',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'கேரட்', description: 'இனிப்பான சுவையான ஊட்டி கேரட்.' },
      hi: { name: 'गाजर', description: 'मीठी और ताज़ी लाल गाजर।' }
    }
  },
  // 27. Cabbage
  {
    name: 'Cabbage',
    categorySlug: 'vegetables',
    sku: 'GG-PROD-027',
    description: 'Tightly packed crisp green cabbage heads harvested fresh from local fields.',
    price: 32,
    originalPrice: 40,
    discountPercent: 20,
    unit: 'piece',
    packSize: '1 pc (~750g)',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'முட்டைகோஸ்', description: 'புதிய பச்சை முட்டைகோஸ்.' },
      hi: { name: 'पत्तागोभी', description: 'ताज़ी और हरी बंदगोभी।' }
    }
  },
  // 28. Green Chillies
  {
    name: 'Green Chillies',
    categorySlug: 'vegetables',
    sku: 'GG-PROD-028',
    description: 'Spicy farm-picked green chillies imparting zesty fiery heat to daily dishes.',
    price: 18,
    originalPrice: 22,
    discountPercent: 18,
    unit: 'g',
    packSize: '200 g',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பச்சை மிளகாய்', description: 'காரமான புதிய பச்சை மிளகாய்.' },
      hi: { name: 'हरी मिर्च', description: 'तीखी और ताज़ी हरी मिर्च।' }
    }
  },
  // 29. Cucumber
  {
    name: 'Cucumber',
    categorySlug: 'vegetables',
    sku: 'GG-PROD-029',
    description: 'Cool refreshing salad cucumbers full of hydration and crisp texture.',
    price: 28,
    originalPrice: 35,
    discountPercent: 20,
    unit: 'kg',
    packSize: '1 kg',
    stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'வெள்ளரிக்காய்', description: 'குளிர்ச்சியான புதிய வெள்ளரிக்காய்.' },
      hi: { name: 'खीरा', description: 'ताज़ा और ठंडा सलाद खीरा।' }
    }
  },
  // 30. Spinach
  {
    name: 'Spinach',
    categorySlug: 'vegetables',
    sku: 'GG-PROD-030',
    description: 'Nutrient-dense organic green spinach / palak leaves rich in iron and folates.',
    price: 25,
    originalPrice: 30,
    discountPercent: 16,
    unit: 'bunch',
    packSize: '1 fresh bunch',
    stock: 65,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பசலைக்கீரை / பாலக்', description: 'இரும்புச்சத்து நிறைந்த புதிய பசலைக்கீரை.' },
      hi: { name: 'पालक', description: 'आयरन से भरपूर ताज़ा हरा पालक।' }
    }
  },
  // 31. Instant Noodles
  {
    name: 'Instant Noodles',
    categorySlug: 'packaged-foods',
    sku: 'GG-PROD-031',
    description: 'Classic 2-minute masala instant wheat noodles with signature spice blend.',
    price: 14,
    originalPrice: 15,
    discountPercent: 7,
    unit: 'pack',
    packSize: '70 g pack',
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'இன்ஸ்டன்ட் நூடுல்ஸ்', description: '2 நிமிட மசாலா நூடுல்ஸ்.' },
      hi: { name: 'इंस्टेंट नूडल्स', description: 'स्वादिष्ट 2-मिनट मसाला नूडल्स।' }
    }
  },
  // 32. Potato Chips
  {
    name: 'Potato Chips',
    categorySlug: 'snacks-and-biscuits',
    sku: 'GG-PROD-032',
    description: 'Thin sliced crispy golden classic salted potato wafers.',
    price: 20,
    originalPrice: 20,
    discountPercent: 0,
    unit: 'pack',
    packSize: '50 g pack',
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'உருளைக்கிழங்கு சிப்ஸ்', description: 'மொறுமொறுப்பான சுவையான சிப்ஸ்.' },
      hi: { name: 'आलू चिप्स', description: 'कुरकुरा और नमकीन आलू चिप्स।' }
    }
  },
  // 33. Chocolate Bar
  {
    name: 'Chocolate Bar',
    categorySlug: 'snacks-and-biscuits',
    sku: 'GG-PROD-033',
    description: 'Smooth and silky rich milk chocolate confectionery bar for sweet cravings.',
    price: 45,
    originalPrice: 50,
    discountPercent: 10,
    unit: 'bar',
    packSize: '50 g bar',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'சாக்லேட் பார்', description: 'இனிமையான கிரீமி சாக்லேட்.' },
      hi: { name: 'चॉकलेट बार', description: 'स्वादिष्ट और मलाईदार मिल्क चॉकलेट।' }
    }
  },
  // 34. Cookies
  {
    name: 'Cookies',
    categorySlug: 'snacks-and-biscuits',
    sku: 'GG-PROD-034',
    description: 'Oven-baked rich chocolate chip butter cookies with delightful crunchy crunch.',
    price: 50,
    originalPrice: 60,
    discountPercent: 16,
    unit: 'pack',
    packSize: '150 g box',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'குக்கீஸ்', description: 'சுவையான சாக்லேட் சிப் குக்கீஸ்.' },
      hi: { name: 'कुकीज़', description: 'बेक्ड और स्वादिष्ट चोको-चिप कुकीज़।' }
    }
  },
  // 35. Soft Drink
  {
    name: 'Soft Drink',
    categorySlug: 'beverages',
    sku: 'GG-PROD-035',
    description: 'Chilled sparkling carbonated cola drink for instant party refreshment.',
    price: 40,
    originalPrice: 45,
    discountPercent: 11,
    unit: 'bottle',
    packSize: '750 ml bottle',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'குளிர்பானம்', description: 'புத்துணர்ச்சியூட்டும் சுவையான குளிர்பானம்.' },
      hi: { name: 'सॉफ्ट ड्रिंक', description: 'ठंडा और ताज़ा कार्बोनेटेड पेय।' }
    }
  },
  // 36. Bottled Water
  {
    name: 'Bottled Water',
    categorySlug: 'beverages',
    sku: 'GG-PROD-036',
    description: 'Safe purified packaged drinking water with added essential minerals.',
    price: 20,
    originalPrice: 20,
    discountPercent: 0,
    unit: 'bottle',
    packSize: '1 L bottle',
    stock: 180,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'மினரல் வாட்டர் பாட்டில்', description: 'சுத்திகரிக்கப்பட்ட குடிநீர்.' },
      hi: { name: 'मिनरल वाटर', description: 'शुद्ध और स्वच्छ पैकेज्ड पेयजल।' }
    }
  },
  // 37. Fruit Juice
  {
    name: 'Fruit Juice',
    categorySlug: 'beverages',
    sku: 'GG-PROD-037',
    description: 'Pure mixed fruit nectar blend rich in natural fruity pulp and Vitamin C.',
    price: 110,
    originalPrice: 130,
    discountPercent: 15,
    unit: 'pack',
    packSize: '1 L tetrapack',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பழச்சாறு', description: 'இயற்கையான சத்து நிறைந்த பழச்சாறு.' },
      hi: { name: 'फलों का रस', description: 'स्वादिष्ट और पौष्टिक फ्रूट जूस।' }
    }
  },
  // 38. Tomato Ketchup
  {
    name: 'Tomato Ketchup',
    categorySlug: 'packaged-foods',
    sku: 'GG-PROD-038',
    description: 'Tangy and sweet tomato sauce ketchup crafted from sun-ripened red tomatoes.',
    price: 75,
    originalPrice: 90,
    discountPercent: 16,
    unit: 'bottle',
    packSize: '500 g bottle',
    stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'தக்காளி சாஸ்', description: 'சுவையான தக்காளி சாஸ்/கெட்ச்அப்.' },
      hi: { name: 'टोमैटो केचप', description: 'खट्टा-मीठा स्वादिष्ट टोमैटो सॉस।' }
    }
  },
  // 39. Mixed Pickle
  {
    name: 'Mixed Pickle',
    categorySlug: 'packaged-foods',
    sku: 'GG-PROD-039',
    description: 'Traditional grandma-style spicy mango, lime, and carrot pickle preserved in mustard oil.',
    price: 65,
    originalPrice: 80,
    discountPercent: 18,
    unit: 'jar',
    packSize: '300 g jar',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'கலவை ஊறுகாய்', description: 'பாரம்பரிய காரசாரமான கலவை ஊறுகாய்.' },
      hi: { name: 'मिक्स्ड अचार', description: 'पारंपरिक और चटपटा स्वादिष्ट मिक्स अचार।' }
    }
  },
  // 40. Turmeric Powder
  {
    name: 'Turmeric Powder',
    categorySlug: 'sugar-salt-and-spices',
    sku: 'GG-PROD-040',
    description: 'High-curcumin golden yellow Salem turmeric powder, antiseptic and pure.',
    price: 38,
    originalPrice: 45,
    discountPercent: 15,
    unit: 'g',
    packSize: '200 g pack',
    stock: 110,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'மஞ்சள் தூள்', description: 'இயற்கையான சுத்தமான மஞ்சள் தூள்.' },
      hi: { name: 'हल्दी पाउडर', description: 'शुद्ध और प्राकृतिक हल्दी पाउडर।' }
    }
  },
  // 41. Chilli Powder
  {
    name: 'Chilli Powder',
    categorySlug: 'sugar-salt-and-spices',
    sku: 'GG-PROD-041',
    description: 'Finely pulverized spicy Guntur red chilli powder delivering vivid colour and pungent heat.',
    price: 45,
    originalPrice: 55,
    discountPercent: 18,
    unit: 'g',
    packSize: '200 g pack',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'மிளகாய் தூள்', description: 'காரசாரமான சிவப்பு மிளகாய் தூள்.' },
      hi: { name: 'लाल मिर्च पाउडर', description: 'तीखा और शुद्ध लाल मिर्च पाउडर।' }
    }
  },
  // 42. Coriander Powder
  {
    name: 'Coriander Powder',
    categorySlug: 'sugar-salt-and-spices',
    sku: 'GG-PROD-042',
    description: 'Slow-roasted ground coriander seeds offering cooling fragrant curry aroma.',
    price: 40,
    originalPrice: 48,
    discountPercent: 16,
    unit: 'g',
    packSize: '200 g pack',
    stock: 95,
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'மல்லி தூள்', description: 'மணம் வீசும் தரமான மல்லி தூள்.' },
      hi: { name: 'धनिया पाउडर', description: 'सुगंधित और शुद्ध धनिया पाउडर।' }
    }
  },
  // 43. Bath Soap
  {
    name: 'Bath Soap',
    categorySlug: 'personal-care',
    sku: 'GG-PROD-043',
    description: 'Gentle moisturizing herbal bath soap enriched with pure sandalwood and almond oil.',
    price: 38,
    originalPrice: 45,
    discountPercent: 15,
    unit: 'bar',
    packSize: '125 g bar',
    stock: 130,
    imageUrl: 'https://images.unsplash.com/photo-1607006314644-d8905b637f4d?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'குளியல் சோப்பு', description: 'நறுமணம் மிக்க மூலிகை குளியல் சோப்பு.' },
      hi: { name: 'नहाने का साबुन', description: 'त्वचा को कोमल बनाने वाला हर्बल साबुन।' }
    }
  },
  // 44. Shampoo
  {
    name: 'Shampoo',
    categorySlug: 'personal-care',
    sku: 'GG-PROD-044',
    description: 'Herbal hair fall defense shampoo with shikakai, amla, and bhringraj extracts.',
    price: 95,
    originalPrice: 115,
    discountPercent: 17,
    unit: 'bottle',
    packSize: '180 ml bottle',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'ஷாம்பூ', description: 'கூந்தல் ஆரோக்கியத்திற்கான மூலிகை ஷாம்பூ.' },
      hi: { name: 'शैम्पू', description: 'बालों को मजबूत बनाने वाला पौष्टिक शैम्पू।' }
    }
  },
  // 45. Toothpaste
  {
    name: 'Toothpaste',
    categorySlug: 'personal-care',
    sku: 'GG-PROD-045',
    description: 'Active mint cavity-fighting herbal toothpaste for all-day fresh breath and strong gums.',
    price: 65,
    originalPrice: 75,
    discountPercent: 13,
    unit: 'tube',
    packSize: '150 g tube',
    stock: 110,
    imageUrl: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பற்பசை / டூத்பேஸ்ட்', description: 'பற்கள் மற்றும் ஈறுகளுக்கு பாதுகாப்பு தரும் பேஸ்ட்.' },
      hi: { name: 'टूथपेस्ट', description: 'दांतों को मजबूत और चमकदार बनाने वाला टूथपेस्ट।' }
    }
  },
  // 46. Toothbrush
  {
    name: 'Toothbrush',
    categorySlug: 'personal-care',
    sku: 'GG-PROD-046',
    description: 'Ultra-soft zig-zag bristles with tongue cleaner for delicate enamel protection.',
    price: 45,
    originalPrice: 55,
    discountPercent: 18,
    unit: 'pack',
    packSize: 'Pack of 2',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1559599189-fe84fea4eb60?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பல் துலக்கி / டூத்பிரஷ்', description: 'மென்மையான இழைகள் கொண்ட டூத்பிரஷ்.' },
      hi: { name: 'टूथब्रश', description: 'मुलायम रेशों वाला उच्च गुणवत्ता टूथब्रश।' }
    }
  },
  // 47. Laundry Detergent
  {
    name: 'Laundry Detergent',
    categorySlug: 'household-cleaning',
    sku: 'GG-PROD-047',
    description: 'Deep stain removal washing detergent powder with lemon fragrance for bright whites.',
    price: 85,
    originalPrice: 105,
    discountPercent: 19,
    unit: 'kg',
    packSize: '1 kg pack',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'துணி துவைக்கும் பவுடர்', description: 'கறைகளை நீக்கும் வாஷிங் பவுடர்.' },
      hi: { name: 'डिटर्जेंट पाउडर', description: 'दाग हटाने वाला चमकदार वॉशिंग पाउडर।' }
    }
  },
  // 48. Dishwashing Liquid
  {
    name: 'Dishwashing Liquid',
    categorySlug: 'household-cleaning',
    sku: 'GG-PROD-048',
    description: 'Concentrated lemon degreaser dishwash liquid gel for spotless sparkling utensils.',
    price: 55,
    originalPrice: 65,
    discountPercent: 15,
    unit: 'bottle',
    packSize: '500 ml bottle',
    stock: 95,
    imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பாத்திரம் கழுவும் திரவம்', description: 'எண்ணெய் பிசுக்கை நீக்கும் பாத்திரம் கழுவும் ஜெல்.' },
      hi: { name: 'डिशवॉशिंग लिक्विड', description: 'बर्तनों को चमकाने वाला नीबू युक्त लिक्विड जेल।' }
    }
  },
  // 49. Toilet Cleaner
  {
    name: 'Toilet Cleaner',
    categorySlug: 'household-cleaning',
    sku: 'GG-PROD-049',
    description: 'Thick power bleach disinfectant liquid eliminating 99.9% germs and lime scale.',
    price: 78,
    originalPrice: 92,
    discountPercent: 15,
    unit: 'bottle',
    packSize: '500 ml bottle',
    stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'கழிப்பறை கிளீனர்', description: 'கிருமிகளை அழிக்கும் டாய்லெட் கிளீனர்.' },
      hi: { name: 'टॉयलेट क्लीनर', description: 'कीटाणुनाशक और दुर्गंध हटाने वाला क्लीनर।' }
    }
  },
  // 50. Paper Towels
  {
    name: 'Paper Towels',
    categorySlug: 'daily-essentials',
    sku: 'GG-PROD-050',
    description: 'Super-absorbent 2-ply kitchen paper towel roll for wiping oil, grease, and spills.',
    price: 65,
    originalPrice: 80,
    discountPercent: 18,
    unit: 'roll',
    packSize: 'Pack of 2 rolls',
    stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'பேப்பர் டவல்', description: 'சமையலறை பயன்பாட்டிற்கான பேப்பர் டவல்.' },
      hi: { name: 'पेपर टॉवल', description: 'रसोई के लिए सुपर सोखने वाला पेपर टॉवल।' }
    }
  },
  // 51. Paper Napkins
  {
    name: 'Paper Napkins',
    categorySlug: 'daily-essentials',
    sku: 'GG-PROD-051',
    description: 'Soft virgin wood pulp hygienic dining table paper tissue napkins.',
    price: 35,
    originalPrice: 45,
    discountPercent: 22,
    unit: 'pack',
    packSize: '100 napkins pack',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
    translations: {
      ta: { name: 'டிஷ்யூ பேப்பர் / நேப்கின்', description: 'சாப்பிடும் மேஜைக்கான மென்மையான டிஷ்யூ நேப்கின்.' },
      hi: { name: 'पेपर नैपकिन', description: 'मुलायम और हाइजीनिक टेबल टिशू पेपर नैपकिन।' }
    }
  }
];

async function main() {
  console.log(`Starting migration to 51 custom products requested by user...`);

  // 1. Fetch all categories
  const categories = await prisma.category.findMany();
  const catMap = new Map();
  categories.forEach(c => catMap.set(c.slug, c.id));

  // 2. Clear old order items, carts, translations, and products to cleanly populate the 51 items
  console.log('Cleaning existing product data...');
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.orderStatusHistory.deleteMany({});
  await prisma.paymentProof.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.inventoryMovement.deleteMany({});
  await prisma.productTranslation.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('Inserting exactly 51 products with AI photorealistic imagery and translations...');
  let count = 0;

  for (const item of products51) {
    const categoryId = catMap.get(item.categorySlug);
    if (!categoryId) {
      console.error(`Category not found for slug: ${item.categorySlug}`);
      continue;
    }

    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProd = await prisma.product.create({
      data: {
        sku: item.sku,
        name: item.name,
        slug,
        description: item.description,
        categoryId,
        price: item.price,
        originalPrice: item.originalPrice,
        discountPercent: item.discountPercent,
        unit: item.unit,
        packSize: item.packSize,
        stock: item.stock,
        imageUrl: item.imageUrl,
        isFeatured: true,
        isActive: true
      }
    });

    // Add translations
    if (item.translations) {
      for (const [lang, trans] of Object.entries(item.translations)) {
        await prisma.productTranslation.create({
          data: {
            productId: newProd.id,
            language: lang,
            name: trans.name,
            description: trans.description
          }
        });
      }
    }

    // Add initial inventory log
    await prisma.inventoryMovement.create({
      data: {
        productId: newProd.id,
        quantityChange: item.stock,
        quantityBefore: 0,
        quantityAfter: item.stock,
        reason: 'Catalog Initial Seed (51 Custom Products)'
      }
    });

    count++;
    console.log(`[${count}/51] Added: ${item.name} (${item.sku}) - Category: ${item.categorySlug}`);
  }

  console.log(`\nSUCCESS: Seeded all 51 products with photorealistic imagery and complete translations!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
