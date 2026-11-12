import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper to generate SVG data URIs for crystal-clear, reliable, zero-external-dependency images
function generateSvgDataUri(label: string, categoryColor: string = '#218838'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${categoryColor};stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:${categoryColor};stop-opacity:0.05" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" rx="16" />
    <circle cx="200" cy="120" r="50" fill="${categoryColor}" opacity="0.2" />
    <text x="200" y="130" font-family="system-ui, sans-serif" font-size="36" font-weight="bold" fill="${categoryColor}" text-anchor="middle">🛒</text>
    <text x="200" y="210" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#14532D" text-anchor="middle">${label}</text>
    <text x="200" y="235" font-family="system-ui, sans-serif" font-size="14" fill="#4B5563" text-anchor="middle">GrocerGo Fresh Assured</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface SeedProduct {
  sku: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  unit: string;
  packSize: string;
  stock: number;
  isFeatured?: boolean;
  translations?: {
    ta?: { name: string; description: string };
    hi?: { name: string; description: string };
    te?: { name: string; description: string };
    kn?: { name: string; description: string };
    ml?: { name: string; description: string };
  };
}

interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  translations: {
    ta: string;
    hi: string;
    te: string;
    kn: string;
    ml: string;
  };
  products: SeedProduct[];
}

const categoriesData: SeedCategory[] = [
  {
    name: 'Fruits',
    slug: 'fruits',
    description: 'Fresh seasonal and daily farm fruits harvested with care',
    sortOrder: 1,
    translations: {
      ta: 'பழங்கள்',
      hi: 'फल',
      te: 'పండ్లు',
      kn: 'ಹಣ್ಣುಗಳು',
      ml: 'പഴങ്ങൾ'
    },
    products: [
      {
        sku: 'GG-FRU-001',
        name: 'Shimla Royal Delicious Apple',
        description: 'Crisp, sweet, and juicy red apples sourced from Himachal orchards.',
        price: 160,
        originalPrice: 190,
        discountPercent: 15,
        unit: 'kg',
        packSize: '1 kg',
        stock: 50,
        isFeatured: true,
        translations: {
          ta: { name: 'சிம்லா ஆப்பிள்', description: 'இனிப்பான சுவையான சிம்லா ஆப்பிள்.' },
          hi: { name: 'शिमला सेब', description: 'ताज़ा और मीठा शिमला सेब।' }
        }
      },
      {
        sku: 'GG-FRU-002',
        name: 'Robusta Banana (Yelakki)',
        description: 'Fresh farm-picked yellow bananas rich in potassium and energy.',
        price: 45,
        originalPrice: 50,
        discountPercent: 10,
        unit: 'dozen',
        packSize: '12 pcs',
        stock: 80,
        isFeatured: true,
        translations: {
          ta: { name: 'வாழைப்பழம்', description: 'சுவையான நாட்டு வாழைப்பழம்.' },
          hi: { name: 'केला (रोबस्टा)', description: 'ताज़े मीठे केले।' }
        }
      },
      {
        sku: 'GG-FRU-003',
        name: 'Nagpur Sweet Oranges',
        description: 'Juicy citrus Nagpur oranges packed with natural Vitamin C.',
        price: 90,
        originalPrice: 110,
        discountPercent: 18,
        unit: 'kg',
        packSize: '1 kg',
        stock: 40,
        translations: {
          ta: { name: 'நாக்பூர் ஆரஞ்சு', description: 'சாறு நிறைந்த இனிப்பு ஆரஞ்சு.' },
          hi: { name: 'नागपुर संतरा', description: 'रसदार और मीठा संतरा।' }
        }
      },
      {
        sku: 'GG-FRU-004',
        name: 'Papaya Semi-Ripe',
        description: 'Naturally ripened sweet papaya perfect for digestive health.',
        price: 40,
        originalPrice: 48,
        discountPercent: 16,
        unit: 'piece',
        packSize: '1 pc (approx. 1 kg)',
        stock: 35,
        translations: {
          ta: { name: 'பப்பாளி பழம்', description: 'செரிமானத்திற்கு உகந்த இனிப்பு பப்பாளி.' },
          hi: { name: 'पपीता', description: 'मीठा और सेहतमंद पपीता।' }
        }
      },
      {
        sku: 'GG-FRU-005',
        name: 'Pomegranate (Kesar Dalim)',
        description: 'Deep red pearls of fresh pomegranates, rich in iron and antioxidants.',
        price: 180,
        originalPrice: 220,
        discountPercent: 18,
        unit: 'kg',
        packSize: '1 kg',
        stock: 30,
        isFeatured: true,
        translations: {
          ta: { name: 'மாதுளம் பழம்', description: 'சிவப்பு முத்துக்கள் நிறைந்த மாதுளை.' },
          hi: { name: 'अनार', description: 'ताज़ा लाल दानेदार अनार।' }
        }
      }
    ]
  },
  {
    name: 'Vegetables',
    slug: 'vegetables',
    description: 'Farm fresh local Indian vegetables sourced directly from regional growers',
    sortOrder: 2,
    translations: {
      ta: 'காய்கறிகள்',
      hi: 'सब्जियां',
      te: 'కూరగాయలు',
      kn: 'ತರಕಾರಿಗಳು',
      ml: 'പച്ചക്കറികൾ'
    },
    products: [
      {
        sku: 'GG-VEG-001',
        name: 'Country Tomatoes (Nattu Thakkali)',
        description: 'Tangy, juicy farm-fresh country tomatoes ideal for rasam and sambar.',
        price: 32,
        originalPrice: 40,
        discountPercent: 20,
        unit: 'kg',
        packSize: '1 kg',
        stock: 120,
        isFeatured: true,
        translations: {
          ta: { name: 'நாட்டு தக்காளி', description: 'சாம்பார், ரசத்திற்கு ஏற்ற புளிப்பு நாட்டு தக்காளி.' },
          hi: { name: 'देसी टमाटर', description: 'ताज़ा रसीला देसी टमाटर।' }
        }
      },
      {
        sku: 'GG-VEG-002',
        name: 'Nasik Red Onions (Vengayam)',
        description: 'Firm and pungent medium-sized red onions, kitchen essential.',
        price: 38,
        originalPrice: 45,
        discountPercent: 15,
        unit: 'kg',
        packSize: '1 kg',
        stock: 150,
        isFeatured: true,
        translations: {
          ta: { name: 'பெரிய வெங்காயம்', description: 'தரமான நாசிக் சிவப்பு வெங்காயம்.' },
          hi: { name: 'लाल प्याज', description: 'ताज़ा और कड़क नासिक प्याज।' }
        }
      },
      {
        sku: 'GG-VEG-003',
        name: 'Baby Potatoes (Uralakkizhangu)',
        description: 'Tender unpolished baby potatoes great for roasting and curries.',
        price: 30,
        originalPrice: 35,
        discountPercent: 14,
        unit: 'kg',
        packSize: '1 kg',
        stock: 110,
        translations: {
          ta: { name: 'உருளைக்கிழங்கு', description: 'வறுவலுக்கு உகந்த உருளைக்கிழங்கு.' },
          hi: { name: 'आलू', description: 'ताज़ा मिट्टी रहित आलू।' }
        }
      },
      {
        sku: 'GG-VEG-004',
        name: 'Fresh Green Chillies & Ginger Combo',
        description: 'Spicy fresh green chillies and fragrant ginger combo pack.',
        price: 25,
        originalPrice: 30,
        discountPercent: 16,
        unit: 'pack',
        packSize: '250 g combo',
        stock: 75,
        translations: {
          ta: { name: 'பச்சை மிளகாய் & இஞ்சி', description: 'காரமான பச்சை மிளகாய் மற்றும் நறுமண இஞ்சி.' },
          hi: { name: 'हरी मिर्च और अदरक कॉम्बो', description: 'ताज़ा हरी मिर्च और अदरक।' }
        }
      },
      {
        sku: 'GG-VEG-005',
        name: 'Lady Finger / Okra (Vendakkai)',
        description: 'Tender, bright green okras ready for crisp fry or pulli kuzhambu.',
        price: 35,
        originalPrice: 45,
        discountPercent: 22,
        unit: 'kg',
        packSize: '500 g',
        stock: 65,
        translations: {
          ta: { name: 'வெண்டைக்காய்', description: 'லேசான இளம் வெண்டைக்காய்.' },
          hi: { name: 'ताज़ी भिंडी', description: 'नरम और हरी ताज़ी भिंडी।' }
        }
      }
    ]
  },
  {
    name: 'Rice and grains',
    slug: 'rice-and-grains',
    description: 'Traditional Indian rice varieties, raw rice, parboiled, and whole grains',
    sortOrder: 3,
    translations: {
      ta: 'அரிசி மற்றும் தானியங்கள்',
      hi: 'चावल और अनाज',
      te: 'బియ్యం మరియు ధాన్యాలు',
      kn: 'ಅಕ್ಕಿ ಮತ್ತು ಧಾನ್ಯಗಳು',
      ml: 'അരിയും ധാന്യങ്ങളും'
    },
    products: [
      {
        sku: 'GG-RIC-001',
        name: 'Ponni Boiled Rice (1 Year Aged)',
        description: 'Premium aged South Indian Ponni boiled rice, soft, fluffy, non-sticky.',
        price: 320,
        originalPrice: 360,
        discountPercent: 11,
        unit: 'bag',
        packSize: '5 kg',
        stock: 80,
        isFeatured: true,
        translations: {
          ta: { name: 'பொன்னி புழுங்கல் அரிசி (5 கிலோ)', description: 'ஒரு வருடம் பழமையான தரமான பொன்னி அரிசி.' },
          hi: { name: 'पोन्नी उबला चावल (5 किग्रा)', description: 'नरम और स्वादिष्ट साउथ इंडियन पोन्नी चावल।' }
        }
      },
      {
        sku: 'GG-RIC-002',
        name: 'Traditional Idli Rice',
        description: 'Special short grain parboiled rice for soft, pillowy idlis and crispy dosas.',
        price: 240,
        originalPrice: 275,
        discountPercent: 12,
        unit: 'bag',
        packSize: '5 kg',
        stock: 90,
        translations: {
          ta: { name: 'இட்லி அரிசி (5 கிலோ)', description: 'மல்லிகைப்பூ போன்ற இட்லிக்கு உகந்த அரிசி.' },
          hi: { name: 'इडली चावल (5 किग्रा)', description: 'नरम इडली और क्रिस्पी डोसा के लिए विशेष चावल।' }
        }
      },
      {
        sku: 'GG-RIC-003',
        name: 'Sona Masoori Raw Rice',
        description: 'Lightweight, aromatic medium-grain rice beloved for daily meals.',
        price: 310,
        originalPrice: 350,
        discountPercent: 11,
        unit: 'bag',
        packSize: '5 kg',
        stock: 65,
        translations: {
          ta: { name: 'சோனா மசூரி பச்சரிசி', description: 'தினசரி உணவுக்கு ஏற்ற மென்மையான அரிசி.' },
          hi: { name: 'सोना मसूरी चावल', description: 'हल्का और सुगंधित सोना मसूरी चावल।' }
        }
      },
      {
        sku: 'GG-RIC-004',
        name: 'Daawat Rozana Basmati Rice',
        description: 'Long grain aromatic basmati rice for biryanis, pulavs, and fried rice.',
        price: 135,
        originalPrice: 165,
        discountPercent: 18,
        unit: 'pack',
        packSize: '1 kg',
        stock: 70,
        isFeatured: true,
        translations: {
          ta: { name: 'தாவத் பாஸ்மதி அரிசி', description: 'பிரியாணி மற்றும் புலாவிற்கான நறுமண பாஸ்மதி.' },
          hi: { name: 'दावत रोज़ाना बासमती चावल', description: 'बिरयानी और पुलाव के लिए खुशबूदार बासमती।' }
        }
      },
      {
        sku: 'GG-RIC-005',
        name: 'Organic Brown Rice (Kaikuthal Arisi)',
        description: 'Nutrient-rich unpolished brown rice packed with fibre and minerals.',
        price: 95,
        originalPrice: 115,
        discountPercent: 17,
        unit: 'pack',
        packSize: '1 kg',
        stock: 45,
        translations: {
          ta: { name: 'கைக்குத்தல் பழுப்பு அரிசி', description: 'சத்துக்கள் நிறைந்த இயற்கை கைக்குத்தல் அரிசி.' },
          hi: { name: 'ऑर्गेनिक ब्राउन राइस', description: 'फाइबर युक्त सेहतमंद भूरा चावल।' }
        }
      }
    ]
  },
  {
    name: 'Pulses and dals',
    slug: 'pulses-and-dals',
    description: 'Protein-rich lentils, unpolished dals, chickpeas, and legumes',
    sortOrder: 4,
    translations: {
      ta: 'பருப்பு வகைகள்',
      hi: 'दालें और दलहन',
      te: 'పప్పు దినుసులు',
      kn: 'ಬೇಳೆಕಾಳುಗಳು',
      ml: 'പരിപ്പ് വർഗ്ഗങ്ങൾ'
    },
    products: [
      {
        sku: 'GG-DAL-001',
        name: 'Tata Sampann Unpolished Toor Dal',
        description: 'Natural high-protein toor dal with no chemical polish; rich in taste.',
        price: 175,
        originalPrice: 195,
        discountPercent: 10,
        unit: 'pack',
        packSize: '1 kg',
        stock: 100,
        isFeatured: true,
        translations: {
          ta: { name: 'துவரம் பருப்பு', description: 'சுவையான பாலிஷ் செய்யப்படாத நாட்டு துவரம் பருப்பு.' },
          hi: { name: 'टाटा सम्पन्न तुअर दाल', description: 'बिना पॉलिश की शुद्ध और पौष्टिक तुअर दाल।' }
        }
      },
      {
        sku: 'GG-DAL-002',
        name: 'Split Yellow Moong Dal (Paasi Paruppu)',
        description: 'Easy-to-digest yellow moong dal for pongal, kootu, and khichdi.',
        price: 130,
        originalPrice: 145,
        discountPercent: 10,
        unit: 'pack',
        packSize: '1 kg',
        stock: 85,
        translations: {
          ta: { name: 'பாசிப் பருப்பு', description: 'பொங்கல் மற்றும் கூட்டுக்கு உகந்த பாசிப்பருப்பு.' },
          hi: { name: 'मूंग दाल धुली', description: 'खिचड़ी और दाल के लिए हल्की मूंग दाल।' }
        }
      },
      {
        sku: 'GG-DAL-003',
        name: 'Whole Black Urad Dal (Ulundhu)',
        description: 'Nutritious black gram whole with skin, perfect for healthy kali and vadai.',
        price: 155,
        originalPrice: 175,
        discountPercent: 11,
        unit: 'pack',
        packSize: '1 kg',
        stock: 60,
        translations: {
          ta: { name: 'கருப்பு உளுந்து', description: 'உளுந்தங்களி மற்றும் சத்தான உணவுகளுக்கு கருப்பு உளுந்து.' },
          hi: { name: 'साबुत उड़द दाल', description: 'पौष्टिक काली उड़द दाल।' }
        }
      },
      {
        sku: 'GG-DAL-004',
        name: 'White Chickpeas / Kabuli Chana',
        description: 'Plump premium white chickpeas for rich chole masalas and sundal.',
        price: 145,
        originalPrice: 165,
        discountPercent: 12,
        unit: 'pack',
        packSize: '1 kg',
        stock: 55,
        translations: {
          ta: { name: 'காபூலி கொண்டைக்கடலை', description: 'சுண்டல் மற்றும் சன்னா மசாலாவிற்கு காபூலி கொண்டைக்கடலை.' },
          hi: { name: 'काबुली चना', description: 'छोले बनाने के लिए बेहतरीन काबुली चना।' }
        }
      },
      {
        sku: 'GG-DAL-005',
        name: 'Fried Gram / Chutney Pottukadalai',
        description: 'Crispy roasted split chickpeas, essential for coconut chutneys and snacks.',
        price: 65,
        originalPrice: 75,
        discountPercent: 13,
        unit: 'pack',
        packSize: '500 g',
        stock: 90,
        translations: {
          ta: { name: 'பொட்டுக்கடலை', description: 'சட்னி மற்றும் நொறுக்குத்தீனிகளுக்கு மொறுமொறு பொட்டுக்கடலை.' },
          hi: { name: 'भुना चना दाल (रोस्टेड चना)', description: 'चटनी के लिए भुनी हुई चना दाल।' }
        }
      }
    ]
  },
  {
    name: 'Flour and atta',
    slug: 'flour-and-atta',
    description: 'Whole wheat atta, maida, rice flour, ragi, and grain flours',
    sortOrder: 5,
    translations: {
      ta: 'மாவு வகைகள்',
      hi: 'आटा और मैदा',
      te: 'పిండి రకాలు',
      kn: 'ಹಿಟ್ಟುಗಳು',
      ml: 'പൊടികൾ'
    },
    products: [
      {
        sku: 'GG-FLR-001',
        name: 'Aashirvaad Shudh Chakki Atta',
        description: '100% whole wheat chakki atta with natural dietary fibre for soft rotis.',
        price: 245,
        originalPrice: 275,
        discountPercent: 11,
        unit: 'bag',
        packSize: '5 kg',
        stock: 120,
        isFeatured: true,
        translations: {
          ta: { name: 'ஆசீர்வாத் கோதுமை மாவு (5 கிலோ)', description: 'மென்மையான சப்பாத்திக்கு 100% முழு கோதுமை மாவு.' },
          hi: { name: 'आशीर्वाद शुद्ध चक्की आटा (5 किग्रा)', description: 'नरम रोटियों के लिए शुद्ध साबुत गेहूं का आटा।' }
        }
      },
      {
        sku: 'GG-FLR-002',
        name: 'Pure Finger Millet Flour (Ragi Maavu)',
        description: 'Stone-ground calcium-rich ragi flour for healthy mudde, porridge, and dosas.',
        price: 55,
        originalPrice: 65,
        discountPercent: 15,
        unit: 'pack',
        packSize: '1 kg',
        stock: 80,
        translations: {
          ta: { name: 'கேழ்வரகு மாவு (ராகி)', description: 'கால்சியம் நிறைந்த இயற்கை கேழ்வரகு மாவு.' },
          hi: { name: 'रागी आटा', description: 'कैल्शियम से भरपूर स्वास्थ्यवर्धक रागी आटा।' }
        }
      },
      {
        sku: 'GG-FLR-003',
        name: 'Idiyappam & Kozhukkattai Rice Flour',
        description: 'Finely roasted white rice flour for smooth string hoppers and modaks.',
        price: 60,
        originalPrice: 70,
        discountPercent: 14,
        unit: 'pack',
        packSize: '1 kg',
        stock: 65,
        translations: {
          ta: { name: 'இடியாப்ப அரிசி மாவு', description: 'வறுத்த நைசான இடியாப்ப அரிசி மாவு.' },
          hi: { name: 'चावल का आटा', description: 'इडियाप्पम और मोदक के लिए बारीक चावल का आटा।' }
        }
      },
      {
        sku: 'GG-FLR-004',
        name: 'Premium Besan / Bengal Gram Flour',
        description: 'Finely ground 100% chana dal flour for crispy bajjis, pakoras, and sweets.',
        price: 65,
        originalPrice: 75,
        discountPercent: 13,
        unit: 'pack',
        packSize: '500 g',
        stock: 75,
        translations: {
          ta: { name: 'கடலை மாவு', description: 'பஜ்ஜி, பக்கோடா செய்ய தரமான கடலை மாவு.' },
          hi: { name: 'शुद्ध बेसन', description: 'पकौड़े और मिठाइयों के लिए शुद्ध बेसन।' }
        }
      },
      {
        sku: 'GG-FLR-005',
        name: 'Fortune Maida Refined Flour',
        description: 'Clean, versatile refined wheat flour for parottas, baking, and snacks.',
        price: 48,
        originalPrice: 55,
        discountPercent: 12,
        unit: 'pack',
        packSize: '1 kg',
        stock: 70,
        translations: {
          ta: { name: 'பரோட்டா மைதா மாவு', description: 'பரோட்டா மற்றும் பேக்கிங் செய்ய மைதா மாவு.' },
          hi: { name: 'फॉर्च्यून मैदा', description: 'समोसे और बेकिंग के लिए महीन मैदा।' }
        }
      }
    ]
  },
  {
    name: 'Cooking oil and ghee',
    slug: 'cooking-oil-and-ghee',
    description: 'Cold-pressed oils, refined sunflower oil, groundnut oil, and pure cow ghee',
    sortOrder: 6,
    translations: {
      ta: 'சமையல் எண்ணெய் மற்றும் நெய்',
      hi: 'खाद्य तेल और घी',
      te: 'వంట నూనెలు మరియు నెయ్యి',
      kn: 'ಅಡುಗೆ ಎಣ್ಣೆ ಮತ್ತು ತುಪ್ಪ',
      ml: 'പാചക എണ്ണയും നെയ്യും'
    },
    products: [
      {
        sku: 'GG-OIL-001',
        name: 'Fortune Sunlite Refined Sunflower Oil',
        description: 'Light and healthy sunflower oil enriched with Vitamins A and D.',
        price: 135,
        originalPrice: 155,
        discountPercent: 13,
        unit: 'pouch',
        packSize: '1 L',
        stock: 140,
        isFeatured: true,
        translations: {
          ta: { name: 'சன்ஃப்ளவர் சமையல் எண்ணெய்', description: 'ஆரோக்கியமான சுத்திகரிக்கப்பட்ட சூரியகாந்தி எண்ணெய்.' },
          hi: { name: 'फॉर्च्यून सनलाइट रिफाइंड तेल', description: 'हल्का और पौष्टिक सूरजमुखी तेल।' }
        }
      },
      {
        sku: 'GG-OIL-002',
        name: 'Cold Pressed Gingelly Oil (Nalla Ennai)',
        description: 'Traditional wood-pressed sesame oil with jaggery flavour for authentic South Indian cooking.',
        price: 290,
        originalPrice: 330,
        discountPercent: 12,
        unit: 'bottle',
        packSize: '1 L',
        stock: 50,
        translations: {
          ta: { name: 'மரச்செக்கு நல்லெண்ணெய்', description: 'பாரம்பரிய மரச்செக்கு சுத்தமான நல்லெண்ணெய்.' },
          hi: { name: 'तिल का तेल (कोल्ड प्रेस्ड)', description: 'पारंपरिक शुद्ध तिल का तेल।' }
        }
      },
      {
        sku: 'GG-OIL-003',
        name: 'Pure Desi Cow Ghee (Nattu Pasu Nei)',
        description: 'Granular, aromatic golden cow ghee made from fresh cream.',
        price: 360,
        originalPrice: 410,
        discountPercent: 12,
        unit: 'jar',
        packSize: '500 ml',
        stock: 60,
        isFeatured: true,
        translations: {
          ta: { name: 'சுத்தமான பசு நெய்', description: 'மணமணக்கும் மணல் போன்ற சுத்தமான நாட்டுப் பசு நெய்.' },
          hi: { name: 'शुद्ध देसी गाय का घी', description: 'दानेदार और सुगंधित शुद्ध देसी गाय का घी।' }
        }
      },
      {
        sku: 'GG-OIL-004',
        name: 'Cold Pressed Groundnut Oil (Kadala Ennai)',
        description: 'Nutritious cold pressed peanut oil for authentic deep-frying and tiffin gravies.',
        price: 215,
        originalPrice: 245,
        discountPercent: 12,
        unit: 'pouch',
        packSize: '1 L',
        stock: 55,
        translations: {
          ta: { name: 'மரச்செக்கு கடலை எண்ணெய்', description: 'இயற்கை மரச்செக்கு கடலை எண்ணெய்.' },
          hi: { name: 'मूंगफली का तेल (कोल्ड प्रेस्ड)', description: 'शुद्ध कच्ची घानी मूंगफली का तेल।' }
        }
      },
      {
        sku: 'GG-OIL-005',
        name: 'Virgin Coconut Oil (Thengai Ennai)',
        description: 'Pure multi-purpose edible coconut oil from select Kerala coconuts.',
        price: 195,
        originalPrice: 230,
        discountPercent: 15,
        unit: 'bottle',
        packSize: '500 ml',
        stock: 45,
        translations: {
          ta: { name: 'சுத்தமான தேங்காய் எண்ணெய்', description: 'கேரளா கொப்பரை தேங்காய் எண்ணெய்.' },
          hi: { name: 'शुद्ध नारियल तेल', description: 'खाद्य और बालों के लिए शुद्ध नारियल तेल।' }
        }
      }
    ]
  },
  {
    name: 'Milk and dairy',
    slug: 'milk-and-dairy',
    description: 'Fresh dairy milk, thick curd, paneer, butter, and cheese',
    sortOrder: 7,
    translations: {
      ta: 'பால் மற்றும் பால் பொருட்கள்',
      hi: 'दूध और डेयरी उत्पाद',
      te: 'పాలు మరియు డెయిరీ ఉత్పత్తులు',
      kn: 'ಹಾಲು ಮತ್ತು ಡೈರಿ ಉತ್ಪನ್ನಗಳು',
      ml: 'പാലും പാലുൽപ്പന്നങ്ങളും'
    },
    products: [
      {
        sku: 'GG-MLK-001',
        name: 'Aavin / Amul Toned Fresh Milk',
        description: 'Pasteurized homogenized wholesome toned milk for tea, coffee, and curds.',
        price: 28,
        originalPrice: 30,
        discountPercent: 6,
        unit: 'pouch',
        packSize: '500 ml',
        stock: 200,
        isFeatured: true,
        translations: {
          ta: { name: 'ஆவின் பசும்பால் (500 மி.லி)', description: 'பதப்படுத்தப்பட்ட சத்தான ஆரோக்கிய பசும்பால்.' },
          hi: { name: 'अमूल / ताजा टोंड दूध (500 मिली)', description: 'ताज़ा और स्वादिष्ट पाश्चुरीकृत दूध।' }
        }
      },
      {
        sku: 'GG-MLK-002',
        name: 'Farm Fresh Thick Curd (Dahi)',
        description: 'Creamy, thick, naturally set curd with active probiotic cultures.',
        price: 35,
        originalPrice: 40,
        discountPercent: 12,
        unit: 'tub',
        packSize: '400 g',
        stock: 90,
        translations: {
          ta: { name: 'கெட்டி தயிர் (400 கி)', description: 'சுவையான கெட்டியான பசும்பால் தயிர்.' },
          hi: { name: 'गाढ़ा दही', description: 'ताज़ा और क्रीमी स्वादिष्ट दही।' }
        }
      },
      {
        sku: 'GG-MLK-003',
        name: 'Fresh Malai Paneer Block',
        description: 'Soft and spongy cottage cheese cubes block for rich gravies and starters.',
        price: 95,
        originalPrice: 115,
        discountPercent: 17,
        unit: 'pack',
        packSize: '200 g',
        stock: 50,
        isFeatured: true,
        translations: {
          ta: { name: 'மலாய் பனீர்', description: 'மென்மையான புதிய மலாய் பனீர்.' },
          hi: { name: 'मलाई पनीर', description: 'नरम और ताजा मलाईदार पनीर।' }
        }
      },
      {
        sku: 'GG-MLK-004',
        name: 'Amul Salted Table Butter',
        description: 'The taste of India — creamy, delicious salted butter made from fresh milk.',
        price: 58,
        originalPrice: 62,
        discountPercent: 6,
        unit: 'pack',
        packSize: '100 g',
        stock: 80,
        translations: {
          ta: { name: 'அமுல் வெண்ணெய்', description: 'சுவையான அமுல் டேபிள் வெண்ணெய்.' },
          hi: { name: 'अमूल बटर (मक्खन)', description: 'स्वादिष्ट और मलाईदार अमूल मक्खन।' }
        }
      },
      {
        sku: 'GG-MLK-005',
        name: 'Spiced Buttermilk (Mor / Chaas)',
        description: 'Refreshing churned spiced buttermilk infused with ginger, curry leaves, and asafoetida.',
        price: 15,
        originalPrice: 20,
        discountPercent: 25,
        unit: 'pouch',
        packSize: '200 ml',
        stock: 100,
        translations: {
          ta: { name: 'தாளித்த மோர்', description: 'இஞ்சி, கறிவேப்பிலை தாளித்த குளுமையான மோர்.' },
          hi: { name: 'मसाला छाछ', description: 'ठंडी और पाचक मसाला छाछ।' }
        }
      }
    ]
  },
  {
    name: 'Bread and bakery',
    slug: 'bread-and-bakery',
    description: 'Sliced white bread, whole wheat bread, buns, rusk, and tea cakes',
    sortOrder: 8,
    translations: {
      ta: 'ரொட்டி மற்றும் பேக்கரி',
      hi: 'ब्रेड और बेकरी',
      te: 'బ్రెడ్ మరియు బేకరీ',
      kn: 'ಬ್ರೆಡ್ ಮತ್ತು ಬೇಕರಿ',
      ml: 'ബ്രെഡും ബേക്കറിയും'
    },
    products: [
      {
        sku: 'GG-BRD-001',
        name: 'Modern 100% Whole Wheat Bread',
        description: 'High-fibre soft brown bread made with 100% whole wheat grains.',
        price: 45,
        originalPrice: 50,
        discountPercent: 10,
        unit: 'loaf',
        packSize: '400 g',
        stock: 50,
        translations: {
          ta: { name: 'முழு கோதுமை ரொட்டி (பிரெட்)', description: 'ஃபைபர் நிறைந்த சாஃப்ட் பிரவுன் பிரெட்.' },
          hi: { name: 'ब्राउन ब्रेड (होल व्हीट)', description: 'फाइबर युक्त नरम ब्राउन ब्रेड।' }
        }
      },
      {
        sku: 'GG-BRD-002',
        name: 'Britannia Sweet Milk Bread',
        description: 'Soft, sweet, and enriched white bread slices popular with kids.',
        price: 40,
        originalPrice: 45,
        discountPercent: 11,
        unit: 'loaf',
        packSize: '400 g',
        stock: 65,
        translations: {
          ta: { name: 'சுவீட் பால் ரொட்டி', description: 'பாலில் செய்த சாஃப்ட் வெள்ளை பிரெட்.' },
          hi: { name: 'ब्रिटानिया मिल्क ब्रेड', description: 'नरम और मीठी मिल्क ब्रेड।' }
        }
      },
      {
        sku: 'GG-BRD-003',
        name: 'Crispy Elaichi Tea Rusk',
        description: 'Twice-baked crunchy wheat toast infused with fragrant cardamom for tea dipping.',
        price: 45,
        originalPrice: 55,
        discountPercent: 18,
        unit: 'pack',
        packSize: '300 g',
        stock: 75,
        translations: {
          ta: { name: 'ஏலக்காய் ரஸ்க்', description: 'டீயில் நனைத்து சாப்பிட மொறுமொறு ஏலக்காய் ரஸ்க்.' },
          hi: { name: 'इलायची टोस्ट रस्क', description: 'चाय के साथ कुरकुरा इलायची रस्क।' }
        }
      },
      {
        sku: 'GG-BRD-004',
        name: 'Soft Pav Buns (Pack of 6)',
        description: 'Freshly baked pillowy pav buns for pav bhaji and vada pav.',
        price: 30,
        originalPrice: 35,
        discountPercent: 14,
        unit: 'pack',
        packSize: '6 pcs',
        stock: 40,
        translations: {
          ta: { name: 'சாஃப்ட் பன் (6 எண்ணம்)', description: 'மென்மையான பாவ் பஜ்ஜி பன்.' },
          hi: { name: 'नरम पाव बन्स (6 पीस)', description: 'पाव भाजी और वड़ा पाव के लिए ताज़े बन।' }
        }
      },
      {
        sku: 'GG-BRD-005',
        name: 'Vanilla Fruit Slice Cake',
        description: 'Moist vanilla sponge cake embedded with candied tutti-frutti pieces.',
        price: 35,
        originalPrice: 40,
        discountPercent: 12,
        unit: 'pack',
        packSize: '150 g',
        stock: 55,
        translations: {
          ta: { name: 'ப்ரூட் கேக்', description: 'டியூட்டி ஃப்ரூட்டி கலந்த சுவையான வெண்ணிலா கேக்.' },
          hi: { name: 'फ्रूट स्लाइस केक', description: 'टूटी-फ्रूटी युक्त नरम वैनिला केक।' }
        }
      }
    ]
  },
  {
    name: 'Eggs',
    slug: 'eggs',
    description: 'Farm fresh white eggs, brown country eggs, and nutrient-enriched eggs',
    sortOrder: 9,
    translations: {
      ta: 'முட்டைகள்',
      hi: 'अंडे',
      te: 'గుడ్లు',
      kn: 'ಮೊಟ್ಟೆಗಳು',
      ml: 'മുട്ടകൾ'
    },
    products: [
      {
        sku: 'GG-EGG-001',
        name: 'Farm Fresh White Table Eggs (Pack of 6)',
        description: 'Clean, sanitized, high-protein white chicken eggs for daily breakfast.',
        price: 42,
        originalPrice: 48,
        discountPercent: 12,
        unit: 'pack',
        packSize: '6 pcs',
        stock: 120,
        isFeatured: true,
        translations: {
          ta: { name: 'பண்ணை வெள்ளை முட்டை (6 எண்ணம்)', description: 'புரதம் நிறைந்த தூய்மையான வெள்ளை முட்டைகள்.' },
          hi: { name: 'ताजे सफेद अंडे (6 पीस)', description: 'प्रोटीन युक्त फार्म ताजे सफेद अंडे।' }
        }
      },
      {
        sku: 'GG-EGG-002',
        name: 'Farm Fresh White Table Eggs (Pack of 12)',
        description: 'Value pack of fresh white poultry eggs with strong shells and golden yolks.',
        price: 80,
        originalPrice: 96,
        discountPercent: 16,
        unit: 'pack',
        packSize: '12 pcs',
        stock: 100,
        translations: {
          ta: { name: 'பண்ணை வெள்ளை முட்டை (12 எண்ணம்)', description: 'சேமிப்பு பேக்: 12 பண்ணை முட்டைகள்.' },
          hi: { name: 'ताजे सफेद अंडे (12 पीस)', description: 'बचत पैक: 12 ताजे पोल्ट्री अंडे।' }
        }
      },
      {
        sku: 'GG-EGG-003',
        name: 'Country Free-Range Brown Eggs (Nattu Muttai)',
        description: 'Authentic free-range country chicken brown eggs with rich deep yellow yolk.',
        price: 75,
        originalPrice: 90,
        discountPercent: 16,
        unit: 'pack',
        packSize: '6 pcs',
        stock: 50,
        isFeatured: true,
        translations: {
          ta: { name: 'நாட்டுக்கோழி முட்டை (6 எண்ணம்)', description: 'ஆரோக்கியமான நாட்டுக்கோழி பழுப்பு முட்டைகள்.' },
          hi: { name: 'देसी मुर्गी के अंडे (6 पीस)', description: 'शुद्ध देसी पोषण से भरपूर भूरे अंडे।' }
        }
      },
      {
        sku: 'GG-EGG-004',
        name: 'Farm Fresh White Eggs Tray (30 Eggs)',
        description: 'Whole month family crate of 30 farm-fresh inspected poultry eggs.',
        price: 195,
        originalPrice: 230,
        discountPercent: 15,
        unit: 'tray',
        packSize: '30 pcs',
        stock: 40,
        translations: {
          ta: { name: 'முட்டை டிரே (30 எண்ணம்)', description: 'முழு குடும்பத்திற்கான 30 முட்டைகள் அடங்கிய டிரே.' },
          hi: { name: 'अंडा क्रेट (30 अंडे)', description: 'पारिवारिक पैक: 30 ताजे अंडों की ट्रे।' }
        }
      },
      {
        sku: 'GG-EGG-005',
        name: 'Omega-3 Enriched Brown Eggs',
        description: 'Fortified organic vegetarian-fed hens eggs enriched with heart-friendly Omega-3.',
        price: 88,
        originalPrice: 105,
        discountPercent: 16,
        unit: 'pack',
        packSize: '6 pcs',
        stock: 35,
        translations: {
          ta: { name: 'ஒமேகா-3 சத்து முட்டை (6 எண்ணம்)', description: 'இதய நலத்திற்கான ஒமேகா-3 நிறைந்த பிரீமியம் முட்டை.' },
          hi: { name: 'ओमेगा-3 समृद्ध अंडे', description: 'हार्ट-हेल्दी ओमेगा-3 फोर्टिफाइड अंडे।' }
        }
      }
    ]
  },
  {
    name: 'Snacks and biscuits',
    slug: 'snacks-and-biscuits',
    description: 'Crispy biscuits, cookies, traditional South Indian mixtures, murukku, and chips',
    sortOrder: 10,
    translations: {
      ta: 'சிற்றுண்டி மற்றும் பிஸ்கட்',
      hi: 'नमकीन और बिस्कुट',
      te: 'స్నాక్స్ మరియు బిస్కెట్లు',
      kn: 'ತಿಂಡಿಗಳು ಮತ್ತು ಬಿಸ್ಕತ್ತುಗಳು',
      ml: 'ലഘുഭക്ഷണങ്ങളും ബിസ്ക്കറ്റുകളും'
    },
    products: [
      {
        sku: 'GG-SNK-001',
        name: 'Britannia Good Day Cashew Cookies',
        description: 'Rich buttery butter cookies loaded with crunchy real cashew nut chunks.',
        price: 35,
        originalPrice: 40,
        discountPercent: 12,
        unit: 'pack',
        packSize: '200 g',
        stock: 120,
        isFeatured: true,
        translations: {
          ta: { name: 'பிரிட்டானியா குட் டே முந்திரி பிஸ்கட்', description: 'முந்திரி பருப்புகள் நிறைந்த சுவையான பிஸ்கட்.' },
          hi: { name: 'ब्रिटानिया गुड डे काजू कुकीज़', description: 'असली काजू के टुकड़ों से भरपूर मक्खनी कुकीज़।' }
        }
      },
      {
        sku: 'GG-SNK-002',
        name: 'Parle-G Original Glucose Biscuits',
        description: 'India\'s favourite energy biscuits, baked with milk and wheat goodness.',
        price: 25,
        originalPrice: 30,
        discountPercent: 16,
        unit: 'pack',
        packSize: '250 g',
        stock: 180,
        translations: {
          ta: { name: 'பார்லே-ஜி குளூக்கோஸ் பிஸ்கட்', description: 'பாரம்பரிய சுவை கொண்ட குளூக்கோஸ் பிஸ்கட்.' },
          hi: { name: 'पारले-जी ग्लूकोज बिस्कुट', description: 'भारत का सबसे पसंदीदा शक्तिवर्धक बिस्कुट।' }
        }
      },
      {
        sku: 'GG-SNK-003',
        name: 'South Indian Spicy Madras Mixture',
        description: 'Crunchy sev, boondi, roasted groundnuts, and curry leaves with mild spicy seasoning.',
        price: 45,
        originalPrice: 55,
        discountPercent: 18,
        unit: 'pack',
        packSize: '200 g',
        stock: 90,
        isFeatured: true,
        translations: {
          ta: { name: 'மெட்ராஸ் கார மிக்ஸர்', description: 'நிலக்கடலை, பொட்டுக்கடலை கலந்த காரசாரமான மிக்ஸர்.' },
          hi: { name: 'मद्रास मिक्सचर नमकीन', description: 'कुरकुरी और तीखी पारंपरिक साउथ इंडियन मिक्सचर।' }
        }
      },
      {
        sku: 'GG-SNK-004',
        name: 'Handmade Garlic Butter Murukku',
        description: 'Traditional spiral rice flour chakli fried crisp with fragrant roasted garlic.',
        price: 40,
        originalPrice: 50,
        discountPercent: 20,
        unit: 'pack',
        packSize: '150 g',
        stock: 75,
        translations: {
          ta: { name: 'பூண்டு முறுக்கு', description: 'மணக்கும் பூண்டு சுவையுடன் கைமுறுக்கு.' },
          hi: { name: 'लहसुन बटर मुरुक्कू (चकली)', description: 'कुरकुरी लहसुन स्वाद वाली पारंपरिक चकली।' }
        }
      },
      {
        sku: 'GG-SNK-005',
        name: 'Salted Banana Chips (Nendran Chips)',
        description: 'Authentic Kerala golden plantain chips fried in pure coconut oil.',
        price: 65,
        originalPrice: 80,
        discountPercent: 18,
        unit: 'pack',
        packSize: '200 g',
        stock: 80,
        translations: {
          ta: { name: 'நேந்திரம் பழ சிப்ஸ்', description: 'தேங்காய் எண்ணெயில் வறுத்த சுவையான நேந்திரங்காய் சிப்ஸ்.' },
          hi: { name: 'केला चिप्स (नेंद्रन)', description: 'शुद्ध नारियल तेल में तले हुए कुरकुरे बनाना चिप्स।' }
        }
      }
    ]
  },
  {
    name: 'Tea and coffee',
    slug: 'tea-and-coffee',
    description: 'South Indian filter coffee blend, premium leaf tea, green tea, and dust tea',
    sortOrder: 11,
    translations: {
      ta: 'தேநீர் மற்றும் காபி',
      hi: 'चाय और कॉफी',
      te: 'టీ మరియు కాఫీ',
      kn: 'ಚಹಾ ಮತ್ತು ಕಾಫಿ',
      ml: 'ചായയും കാപ്പിയും'
    },
    products: [
      {
        sku: 'GG-TEA-001',
        name: 'Tata Tea Gold Leaf & CTC Blend',
        description: 'Exquisite blend of strong Assam CTC tea and gently rolled long tea leaves.',
        price: 155,
        originalPrice: 175,
        discountPercent: 11,
        unit: 'pack',
        packSize: '500 g',
        stock: 90,
        isFeatured: true,
        translations: {
          ta: { name: 'டாடா டீ கோல்ட் தேயிலை', description: 'நறுமணமும் நல்ல ஸ்ட்ராங்கும் கலந்த தேயிலைத் தூள்.' },
          hi: { name: 'टाटा टी गोल्ड', description: 'कड़क असम सीटीसी और सुगंधित लंबी पत्तियों का मिश्रण।' }
        }
      },
      {
        sku: 'GG-TEA-002',
        name: 'Narasu\'s Udhayam Filter Coffee (80:20)',
        description: 'Authentic Kumbakonam degree filter coffee powder blended with 20% premium chicory.',
        price: 135,
        originalPrice: 150,
        discountPercent: 10,
        unit: 'pack',
        packSize: '500 g',
        stock: 85,
        isFeatured: true,
        translations: {
          ta: { name: 'நரசுஸ் உதயம் பில்டர் காபித்தூள்', description: 'சுவையான கும்பகோணம் டிகிரி பில்டர் காபித்தூள்.' },
          hi: { name: 'नरसुस फ़िल्टर कॉफ़ी पाउडर', description: 'प्रामाणिक दक्षिण भारतीय फ़िल्टर कॉफ़ी।' }
        }
      },
      {
        sku: 'GG-TEA-003',
        name: '3 Roses Strong Dust Tea',
        description: 'Rich dark red liquor and intense aroma for strong morning milk tea.',
        price: 75,
        originalPrice: 85,
        discountPercent: 11,
        unit: 'pack',
        packSize: '250 g',
        stock: 110,
        translations: {
          ta: { name: '3 ரோஸஸ் ஸ்ட்ராங் டீத்தூள்', description: 'அடர் நிறமும் நறுமணமும் தரும் டஸ்ட் டீத்தூள்.' },
          hi: { name: '3 रोज़ेस डस्ट टी', description: 'कड़क स्वाद और गहरा रंग देने वाली चाय।' }
        }
      },
      {
        sku: 'GG-TEA-004',
        name: 'Bru Instant Coffee Jar',
        description: 'Fine blend of choicest coffee beans and chicory for quick refreshing cups.',
        price: 110,
        originalPrice: 125,
        discountPercent: 12,
        unit: 'jar',
        packSize: '100 g',
        stock: 70,
        translations: {
          ta: { name: 'புரூ இன்ஸ்டண்ட் காபி', description: 'உடனடி காபி தயாரிக்க புரூ இன்ஸ்டண்ட் பாட்டில்.' },
          hi: { name: 'ब्रु इंस्टेंट कॉफ़ी', description: 'ताज़गी से भरपूर तुरंत बनने वाली कॉफ़ी।' }
        }
      },
      {
        sku: 'GG-TEA-005',
        name: 'Tetley Pure Green Tea Bags (25 Bags)',
        description: '100% antioxidant-rich green tea bags for metabolism and daily detox.',
        price: 130,
        originalPrice: 155,
        discountPercent: 16,
        unit: 'box',
        packSize: '25 bags',
        stock: 50,
        translations: {
          ta: { name: 'டெட்லி க்ரீன் டீ பேக்ஸ் (25 பைகள்)', description: 'ஆரோக்கியமான இயற்கை கிரீன் டீ பைகள்.' },
          hi: { name: 'टेटली शुद्ध ग्रीन टी (25 बैग)', description: 'एंटीऑक्सिडेंट से भरपूर हर्बल ग्रीन टी।' }
        }
      }
    ]
  },
  {
    name: 'Sugar, salt, and spices',
    slug: 'sugar-salt-and-spices',
    description: 'Pure crystal sugar, rock salt, whole turmeric, mustard, cumin, and masala powders',
    sortOrder: 12,
    translations: {
      ta: 'சர்க்கரை, உப்பு மற்றும் மசாலா',
      hi: 'चीनी, नमक और मसाले',
      te: 'చక్కెర, ఉప్పు మరియు మసాలాలు',
      kn: 'ಸಕ್ಕರೆ, ಉಪ್ಪು ಮತ್ತು ಮಸಾಲೆಗಳು',
      ml: 'പഞ്ചസാര, ഉപ്പ്, സുഗന്ധവ്യഞ്ജനങ്ങൾ'
    },
    products: [
      {
        sku: 'GG-SP-001',
        name: 'Tata Salt Vacuum Evaporated Iodized',
        description: 'Desh Ka Namak — pure vacuum evaporated iodized salt essential for mental development.',
        price: 26,
        originalPrice: 28,
        discountPercent: 7,
        unit: 'pack',
        packSize: '1 kg',
        stock: 200,
        isFeatured: true,
        translations: {
          ta: { name: 'டாடா அயோடின் உப்பு (1 கிலோ)', description: 'சுத்திகரிக்கப்பட்ட அயோடின் கலந்த சமையல் உப்பு.' },
          hi: { name: 'टाटा नमक आयोडीन युक्त (1 किग्रा)', description: 'देश का नमक - शुद्ध आयोडीन युक्त नमक।' }
        }
      },
      {
        sku: 'GG-SP-002',
        name: 'Sulphurless Pure White Crystal Sugar',
        description: 'Sparkling sweet crystalline cane sugar processed without harmful sulphur.',
        price: 46,
        originalPrice: 52,
        discountPercent: 11,
        unit: 'pack',
        packSize: '1 kg',
        stock: 180,
        translations: {
          ta: { name: 'வெள்ளை சர்க்கரை', description: 'கந்தகம் இல்லாத சுத்தமான கரும்பு சர்க்கரை.' },
          hi: { name: 'शुद्ध सफेद चीनी', description: 'सल्फर मुक्त शुद्ध दानेदार चीनी।' }
        }
      },
      {
        sku: 'GG-SP-003',
        name: 'Organic Country Jaggery Powder (Nattu Sakkarai)',
        description: 'Pure chemical-free unrefined brown cane jaggery powder loaded with iron.',
        price: 68,
        originalPrice: 80,
        discountPercent: 15,
        unit: 'pack',
        packSize: '1 kg',
        stock: 90,
        isFeatured: true,
        translations: {
          ta: { name: 'நாட்டுச் சர்க்கரை (1 கிலோ)', description: 'இரசாயனம் இல்லாத இயற்கை நாட்டுச் சர்க்கரை.' },
          hi: { name: 'देसी गुड़ पाउडर (शक्कर)', description: 'आयरन से भरपूर शुद्ध प्राकृतिक गुड़ पाउडर।' }
        }
      },
      {
        sku: 'GG-SP-004',
        name: 'Aachi Sambar Powder (Masala)',
        description: 'Traditional authentic Tamil Nadu blend of coriander, red chilli, and roasted spices.',
        price: 52,
        originalPrice: 60,
        discountPercent: 13,
        unit: 'pack',
        packSize: '200 g',
        stock: 110,
        translations: {
          ta: { name: 'ஆச்சி சாம்பார் பொடி', description: 'பாரம்பரிய சுவை தரும் வீட்டு சாம்பார் பொடி.' },
          hi: { name: 'आची सांभर मसाला', description: 'स्वादिष्ट दक्षिण भारतीय सांभर मसाला पाउडर।' }
        }
      },
      {
        sku: 'GG-SP-005',
        name: 'Whole Cumin Seeds (Jeeragam)',
        description: 'Fragrant bold unadulterated cumin seeds, essential for tempering and rasam.',
        price: 55,
        originalPrice: 65,
        discountPercent: 15,
        unit: 'pack',
        packSize: '100 g',
        stock: 95,
        translations: {
          ta: { name: 'சீரகம்', description: 'மணமான சுத்தமான நாட்டுச் சீரகம்.' },
          hi: { name: 'साबुत जीरा', description: 'खुशबूदार और शुद्ध साबुत जीरा।' }
        }
      }
    ]
  },
  {
    name: 'Packaged foods',
    slug: 'packaged-foods',
    description: 'Instant noodles, roasted vermicelli, ready-to-eat meals, and breakfast cereals',
    sortOrder: 13,
    translations: {
      ta: 'பேக் செய்யப்பட்ட உணவுகள்',
      hi: 'पैकेज्ड खाद्य पदार्थ',
      te: 'ప్యాక్ చేసిన ఆహారాలు',
      kn: 'ಪ್ಯಾಕ್ ಮಾಡಿದ ಆಹಾರಗಳು',
      ml: 'പാക്ക് ചെയ്ത ഭക്ഷണങ്ങൾ'
    },
    products: [
      {
        sku: 'GG-PKG-001',
        name: 'Maggi 2-Minute Masala Noodles (Pack of 4)',
        description: 'India\'s iconic instant masala noodles with signature tastemaker seasoning.',
        price: 54,
        originalPrice: 60,
        discountPercent: 10,
        unit: 'pack',
        packSize: '280 g (4x70g)',
        stock: 130,
        isFeatured: true,
        translations: {
          ta: { name: 'மேகி மசாலா நூடுல்ஸ் (4 பேக்)', description: 'குழந்தைகள் விரும்பும் 2 நிமிட மேகி மசாலா நூடுல்ஸ்.' },
          hi: { name: 'मैगी मसाला नूडल्स (4 का पैक)', description: 'भारत के सबसे पसंदीदा 2 मिनट मसाला नूडल्स।' }
        }
      },
      {
        sku: 'GG-PKG-002',
        name: 'Anil Roasted Short Vermicelli (Semiya)',
        description: 'Pre-roasted wheat vermicelli for quick sweet payasam and savory upma.',
        price: 36,
        originalPrice: 42,
        discountPercent: 14,
        unit: 'pack',
        packSize: '450 g',
        stock: 85,
        translations: {
          ta: { name: 'அனில் வறுத்த சேமியா', description: 'பாயாசம் மற்றும் உப்மாவிற்கு வறுத்த சேமியா.' },
          hi: { name: 'भुनी हुई सेंवई (सेवइयां)', description: 'खीर और उपमा के लिए पहले से भुनी सेवइयां।' }
        }
      },
      {
        sku: 'GG-PKG-003',
        name: 'MTR Ready-To-Eat Paneer Butter Masala',
        description: 'Tender paneer cubes in rich tomato cashew gravy, heat and serve in 3 minutes.',
        price: 110,
        originalPrice: 130,
        discountPercent: 15,
        unit: 'pack',
        packSize: '300 g',
        stock: 60,
        translations: {
          ta: { name: 'எம்.டி.ஆர் பனீர் பட்டர் மசாலா (ரெடிமேட்)', description: 'சூடு செய்து உடனே பரிமாறக்கூடிய பனீர் மசாலா.' },
          hi: { name: 'एमटीआर पनीर बटर मसाला (रेडी टू ईट)', description: 'गर्म करें और खाएं - स्वादिष्ट पनीर ग्रेवी।' }
        }
      },
      {
        sku: 'GG-PKG-004',
        name: 'Kellogg\'s Corn Flakes Original',
        description: 'Crispy golden toasted corn flakes enriched with iron and 8 essential vitamins.',
        price: 125,
        originalPrice: 145,
        discountPercent: 13,
        unit: 'box',
        packSize: '300 g',
        stock: 65,
        translations: {
          ta: { name: 'கெல்லாக்ஸ் கார்ன் ப்ளேக்ஸ்', description: 'பாலுடன் சாப்பிட சுவையான சோள அவல்.' },
          hi: { name: 'केलॉग्स कॉर्न फ्लेक्स', description: 'पौष्टिक और कुरकुरे सुबह का नाश्ता।' }
        }
      },
      {
        sku: 'GG-PKG-005',
        name: 'ID Fresh 100% Natural Idly & Dosa Batter',
        description: 'Freshly stone-ground fermented rice and urad batter with zero preservatives.',
        price: 85,
        originalPrice: 95,
        discountPercent: 10,
        unit: 'pouch',
        packSize: '1 kg',
        stock: 75,
        translations: {
          ta: { name: 'ஐ.டி இட்லி & தோசை மாவு (1 கிலோ)', description: 'இயற்கையாக நொதித்த புதிய இட்லி மாவு.' },
          hi: { name: 'आईडी ताजा इडली और डोसा बैटर', description: 'बिना प्रिजर्वेटिव का प्राकृतिक इडली डोसा घोल।' }
        }
      }
    ]
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Packaged juices, health drinks, mineral water, and natural tender coconut water',
    sortOrder: 14,
    translations: {
      ta: 'பானங்கள்',
      hi: 'पेय पदार्थ',
      te: 'పానీయాలు',
      kn: 'ಪಾನೀಯಗಳು',
      ml: 'പാനീയങ്ങൾ'
    },
    products: [
      {
        sku: 'GG-BEV-001',
        name: 'Frooti Mango Drink Pet Bottle',
        description: 'Juicy, thick mango drink made from ripe Alphonso and Totapuri mangoes.',
        price: 38,
        originalPrice: 42,
        discountPercent: 9,
        unit: 'bottle',
        packSize: '600 ml',
        stock: 110,
        isFeatured: true,
        translations: {
          ta: { name: 'ஃப்ரூட்டி மாம்பழ சாறு', description: 'சுவையான மாம்பழ குளிர்பானம்.' },
          hi: { name: 'फ्रूटी मैंगो ड्रिंक', description: 'पके आमों के रस से बनी लोकप्रिय मैंगो ड्रिंक।' }
        }
      },
      {
        sku: 'GG-BEV-002',
        name: 'Horlicks Classic Malt Health Drink',
        description: 'Nourishing health food drink with zinc, vitamin C, and micronutrients for growing children.',
        price: 240,
        originalPrice: 265,
        discountPercent: 9,
        unit: 'jar',
        packSize: '500 g',
        stock: 70,
        translations: {
          ta: { name: 'ஹார்லிக்ஸ் மால்ட் சத்து மாவு', description: 'குழந்தைகளின் வளர்ச்சிக்கு ஊட்டச்சத்து நிறைந்த பானம்.' },
          hi: { name: 'हॉर्लिक्स क्लासिक माल्ट', description: 'बच्चों के पोषण और विकास के लिए हेल्दी ड्रिंक।' }
        }
      },
      {
        sku: 'GG-BEV-003',
        name: 'Kinley Purified Packaged Drinking Water',
        description: 'Multi-stage reverse osmosis purified clean and safe drinking water with added minerals.',
        price: 20,
        originalPrice: 20,
        discountPercent: 0,
        unit: 'bottle',
        packSize: '1 L',
        stock: 160,
        translations: {
          ta: { name: 'கின்லே மினரல் வாட்டர் (1 லிட்டர்)', description: 'சுத்திகரிக்கப்பட்ட பாதுகாப்பான குடிநீர்.' },
          hi: { name: 'किनले मिनरल वाटर (1 लीटर)', description: 'आरओ शुद्ध किया हुआ स्वच्छ पेयजल।' }
        }
      },
      {
        sku: 'GG-BEV-004',
        name: 'Real Fruit Power Mixed Fruit Juice',
        description: 'Rich blend of 9 fruit juices with natural vitamins and no added preservatives.',
        price: 115,
        originalPrice: 135,
        discountPercent: 14,
        unit: 'tetrapack',
        packSize: '1 L',
        stock: 65,
        translations: {
          ta: { name: 'ரியல் மிக்ஸ்ட் ஃப்ரூட் ஜூஸ்', description: '9 பழங்களின் சத்துக்கள் நிறைந்த ரியல் ஜூஸ்.' },
          hi: { name: 'रियल मिक्स्ड फ्रूट जूस (1 लीटर)', description: '9 फलों के गुणों से भरपूर पौष्टिक जूस।' }
        }
      },
      {
        sku: 'GG-BEV-005',
        name: 'Pure Natural Tender Coconut Water',
        description: 'Naturally sweet and hydrating green coconut water packed in aseptic paper pack.',
        price: 45,
        originalPrice: 50,
        discountPercent: 10,
        unit: 'tetrapack',
        packSize: '200 ml',
        stock: 80,
        translations: {
          ta: { name: 'இயற்கை இளநீர் பேக்', description: 'உடலுக்கு குளுமை தரும் சுத்தமான இயற்கை இளநீர்.' },
          hi: { name: 'प्राकृतिक नारियल पानी', description: 'ताज़गी देने वाला प्राकृतिक नारियल पानी।' }
        }
      }
    ]
  },
  {
    name: 'Personal care',
    slug: 'personal-care',
    description: 'Bathing soaps, herbal hair oils, toothpastes, shampoos, and body powders',
    sortOrder: 15,
    translations: {
      ta: 'சுய பராமரிப்பு',
      hi: 'व्यक्तिगत देखभाल',
      te: 'వ్యక్తిగత సంరక్షణ',
      kn: 'ವೈಯಕ್ತಿಕ ಆರೈಕೆ',
      ml: 'വ്യക്തിഗത പരിചരണം'
    },
    products: [
      {
        sku: 'GG-PC-001',
        name: 'Medimix Ayurvedic 18-Herbs Soap (Buy 4 Get 1)',
        description: 'Time-tested Ayurvedic skin protection bar with 18 rare medicinal herbs.',
        price: 150,
        originalPrice: 175,
        discountPercent: 14,
        unit: 'pack',
        packSize: '5 x 125 g',
        stock: 90,
        isFeatured: true,
        translations: {
          ta: { name: 'மெடிமிக்ஸ் ஆயுர்வேத சோப் (5 பேக்)', description: '18 மூலிகைகள் அடங்கிய சரும பாதுகாப்பு சோப்.' },
          hi: { name: 'मेडिमिक्स आयुर्वेदिक साबुन (5 का पैक)', description: '18 जड़ी-बूटियों से बना त्वचा रक्षक साबुन।' }
        }
      },
      {
        sku: 'GG-PC-002',
        name: 'Colgate Strong Teeth Toothpaste',
        description: 'Amino Shakti calcium formula toothpaste for cavity protection and fresh breath.',
        price: 95,
        originalPrice: 110,
        discountPercent: 13,
        unit: 'tube',
        packSize: '200 g',
        stock: 120,
        translations: {
          ta: { name: 'கோல்கேட் பல் துலக்கும் பேஸ்ட்', description: 'பல் உறுதிக்கும் வாய் துர்நாற்றம் நீங்கவும் கோல்கேட்.' },
          hi: { name: 'कोलगेट मजबूत दांत टूथपेस्ट', description: 'दांतों की मजबूती और कैविटी सुरक्षा के लिए।' }
        }
      },
      {
        sku: 'GG-PC-003',
        name: 'Parachute 100% Pure Coconut Hair Oil',
        description: 'Pure, micro-filtered edible grade coconut oil for strong and glossy hair.',
        price: 98,
        originalPrice: 115,
        discountPercent: 14,
        unit: 'bottle',
        packSize: '250 ml',
        stock: 100,
        translations: {
          ta: { name: 'பாரசூட் தேங்காய் கூந்தல் எண்ணெய்', description: 'கூந்தல் வளர்ச்சிக்கு சுத்தமான தேங்காய் எண்ணெய்.' },
          hi: { name: 'पैराशूट शुद्ध नारियल तेल', description: 'बालों को जड़ों से मजबूत बनाने वाला नारियल तेल।' }
        }
      },
      {
        sku: 'GG-PC-004',
        name: 'Clinic Plus Strong & Long Shampoo',
        description: 'Milk protein enriched daily cleansing shampoo that strengthens hair from root to tip.',
        price: 125,
        originalPrice: 145,
        discountPercent: 13,
        unit: 'bottle',
        packSize: '340 ml',
        stock: 85,
        translations: {
          ta: { name: 'கிளினிக் பிளஸ் ஷாம்பூ', description: 'முடி உதிர்வை தடுத்து நீளமாக வளர்க்கும் ஷாம்பூ.' },
          hi: { name: 'क्लिनिक प्लस शैम्पू', description: 'दूध के प्रोटीन से भरपूर मजबूत बालों के लिए शैम्पू।' }
        }
      },
      {
        sku: 'GG-PC-005',
        name: 'Dettol Original Germ Protection Soap (Pack of 3)',
        description: 'Trusted antibacterial bath soap with active pinewood fragrance.',
        price: 110,
        originalPrice: 130,
        discountPercent: 15,
        unit: 'pack',
        packSize: '3 x 100 g',
        stock: 95,
        translations: {
          ta: { name: 'டெட்டால் கிருமி நாசினி சோப் (3 பேக்)', description: '99.9% கிருமிகளை அழிக்கும் குளியல் சோப்.' },
          hi: { name: 'डेटॉल जर्म प्रोटेक्शन साबुन (3 पैक)', description: 'कीटाणुओं से 99.9% सुरक्षा देने वाला साबुन।' }
        }
      }
    ]
  },
  {
    name: 'Household cleaning',
    slug: 'household-cleaning',
    description: 'Detergent powders, washing bars, dishwash gels, floor cleaners, and mop essentials',
    sortOrder: 16,
    translations: {
      ta: 'வீட்டு உபயோக பொருட்கள்',
      hi: 'घर की सफाई',
      te: 'ఇంటి శుభ్రత',
      kn: 'ಮನೆ ಸ್ವಚ್ಛತೆ',
      ml: 'വീട്ടുപകരണ ശുചീകരണം'
    },
    products: [
      {
        sku: 'GG-CLN-001',
        name: 'Surf Excel Quick Wash Detergent Powder',
        description: 'Tough stain removal in just 1 stroke for bucket and semi-automatic machine washing.',
        price: 135,
        originalPrice: 155,
        discountPercent: 12,
        unit: 'bag',
        packSize: '1 kg',
        stock: 130,
        isFeatured: true,
        translations: {
          ta: { name: 'சர்ப் எக்செல் துணி துவைக்கும் பவுடர்', description: 'கடினமான கறைகளை எளிதில் நீக்கும் வாஷிங் பவுடர்.' },
          hi: { name: 'सर्फ एक्सेल क्विक वॉश डिटर्जेंट पाउडर', description: 'जिद्दी दाग हटाने के लिए बेहतरीन वाशिंग पाउडर।' }
        }
      },
      {
        sku: 'GG-CLN-002',
        name: 'Vim Lemon Dishwash Liquid Gel',
        description: 'Power of 100 lemons cuts through thick oil and grease on vessels without leaving residue.',
        price: 115,
        originalPrice: 135,
        discountPercent: 14,
        unit: 'bottle',
        packSize: '750 ml',
        stock: 100,
        isFeatured: true,
        translations: {
          ta: { name: 'விம் எலுமிச்சை பாத்திரம் கழுவும் ஜெல்', description: 'எண்ணெய் பிசுக்குகளை எளிதாக அகற்றும் விம் ஜெல்.' },
          hi: { name: 'विम लेमन डिशवॉश जेल', description: 'बर्तनों की चिकनाई साफ करने वाला नींबू जेल।' }
        }
      },
      {
        sku: 'GG-CLN-003',
        name: 'Lizol Floral Disinfectant Floor Cleaner',
        description: 'Kills 99.9% of germs and leaves floors shining clean with a long-lasting pleasant scent.',
        price: 95,
        originalPrice: 110,
        discountPercent: 13,
        unit: 'bottle',
        packSize: '500 ml',
        stock: 80,
        translations: {
          ta: { name: 'லைசால் தரை துடைக்கும் திரவம்', description: 'கிருமிகளை நீக்கி வீட்டை நறுமணத்துடன் வைக்கும் லைசால்.' },
          hi: { name: 'लाइज़ोल कीटाणुनाशक फ्लोर क्लीनर', description: 'फर्श को चमकाने और कीटाणुओं को भगाने वाला क्लीनर।' }
        }
      },
      {
        sku: 'GG-CLN-004',
        name: 'Rin Advanced Detergent Washing Bar (Pack of 4)',
        description: 'Superior brightness for whites and coloured clothes with easy lather rinse.',
        price: 45,
        originalPrice: 50,
        discountPercent: 10,
        unit: 'pack',
        packSize: '4 x 140 g',
        stock: 140,
        translations: {
          ta: { name: 'ரின் துணி துவைக்கும் பார் (4 பேக்)', description: 'துணிகளுக்கு பளிச் வெண்மை தரும் ரின் சோப்.' },
          hi: { name: 'रिन डिटर्जेंट बार (4 का पैक)', description: 'कपड़ों को चमकदार सफेदी देने वाला साबुन।' }
        }
      },
      {
        sku: 'GG-CLN-005',
        name: 'Harpic Power Plus Toilet Cleaner Liquid',
        description: '10x better yellowish stain removal, disinfecting germs above and below water line.',
        price: 88,
        originalPrice: 100,
        discountPercent: 12,
        unit: 'bottle',
        packSize: '500 ml',
        stock: 90,
        translations: {
          ta: { name: 'ஹார்பிக் டாய்லெட் கிளீனர்', description: 'கழிப்பறையை சுத்தமாகவும் கிருமி இன்றியும் வைக்கும் ஹார்பிக்.' },
          hi: { name: 'हार्पिक टॉयलेट क्लीनर', description: 'दाग हटाने और कीटाणुओं को नष्ट करने वाला क्लीनर।' }
        }
      }
    ]
  },
  {
    name: 'Baby care',
    slug: 'baby-care',
    description: 'Baby diapers, gentle baby wash, gripe water, massage oil, and baby powders',
    sortOrder: 17,
    translations: {
      ta: 'குழந்தைகள் பராமரிப்பு',
      hi: 'शिशु देखभाल',
      te: 'శిశు సంరక్షణ',
      kn: 'ಮಗುವಿನ ಆರೈಕೆ',
      ml: 'ശിശു സംരക്ഷണം'
    },
    products: [
      {
        sku: 'GG-BAB-001',
        name: 'Pampers All-Round Protection Pant Diapers (M)',
        description: 'Anti-rash magic gel pants with up to 12 hours of overnight dryness for medium babies.',
        price: 360,
        originalPrice: 420,
        discountPercent: 14,
        unit: 'pack',
        packSize: '28 count (M)',
        stock: 60,
        isFeatured: true,
        translations: {
          ta: { name: 'பேம்பர்ஸ் பேபி டயப்பர் (மீடியம்)', description: 'குழந்தைகளுக்கு 12 மணி நேர உலர்வான பாதுகாப்பு டயப்பர்.' },
          hi: { name: 'पैम्पर्स बेबी डायपर (मीडियम)', description: 'रात भर आरामदायक और सूखा रखने वाले डायपर।' }
        }
      },
      {
        sku: 'GG-BAB-002',
        name: 'Johnson\'s Baby No More Tears Shampoo',
        description: 'Ultra-mild soap-free formula gently cleans baby\'s fine scalp without stinging eyes.',
        price: 115,
        originalPrice: 135,
        discountPercent: 14,
        unit: 'bottle',
        packSize: '100 ml',
        stock: 50,
        translations: {
          ta: { name: 'ஜான்சன்ஸ் பேபி ஷாம்பூ', description: 'கண்ணில் எரியாத மென்மையான குழந்தைகள் ஷாம்பூ.' },
          hi: { name: 'जॉनसन बेबी नो मोर टियर्स शैम्पू', description: 'शिशु की नाजुक त्वचा और बालों के लिए कोमल शैम्पू।' }
        }
      },
      {
        sku: 'GG-BAB-003',
        name: 'Himalaya Baby Massage Oil with Olive & Winter Cherry',
        description: 'Pure herbal nourishment to improve baby skin tone and promote sound sleep.',
        price: 130,
        originalPrice: 155,
        discountPercent: 16,
        unit: 'bottle',
        packSize: '200 ml',
        stock: 55,
        translations: {
          ta: { name: 'ஹிமாலயா குழந்தைகள் மசாஜ் எண்ணெய்', description: 'எலும்பு மற்றும் தசை வளர்ச்சிக்கு மூலிகை எண்ணெய்.' },
          hi: { name: 'हिमालय बेबी मसाज ऑयल', description: 'हड्डियों और त्वचा के लिए पौष्टिक हर्बल तेल।' }
        }
      },
      {
        sku: 'GG-BAB-004',
        name: 'Woodward\'s Gripe Water for Colic Relief',
        description: 'Ayurvedic soothing dill oil and sarjikakshara for instant relief from infant gas and colic.',
        price: 60,
        originalPrice: 65,
        discountPercent: 7,
        unit: 'bottle',
        packSize: '130 ml',
        stock: 75,
        translations: {
          ta: { name: 'வுட்வார்ட்ஸ் கிரைப் வாட்டர்', description: 'குழந்தைகளின் வயிறு உப்புசம் மற்றும் செரிமானத்திற்கு.' },
          hi: { name: 'वुडवर्ड्स ग्राइप वाटर', description: 'शिशुओं के पेट दर्द और गैस से राहत के लिए।' }
        }
      },
      {
        sku: 'GG-BAB-005',
        name: 'Johnson\'s Pure Cornstarch Baby Powder',
        description: 'Absorbs excess moisture and prevents heat rashes with gentle floral scent.',
        price: 90,
        originalPrice: 105,
        discountPercent: 14,
        unit: 'bottle',
        packSize: '200 g',
        stock: 65,
        translations: {
          ta: { name: 'ஜான்சன்ஸ் பேபி பவுடர்', description: 'குழந்தைகளுக்கு வியர்க்குரு வராமல் தடுக்கும் மென்மை பவுடர்.' },
          hi: { name: 'जॉनसन बेबी पाउडर', description: 'शिशु को ताजगी और पसीने से सुरक्षित रखने वाला पाउडर।' }
        }
      }
    ]
  },
  {
    name: 'Frozen foods',
    slug: 'frozen-foods',
    description: 'Frozen green peas, sweet corn, french fries, samosas, and frozen parathas',
    sortOrder: 18,
    translations: {
      ta: 'உறைந்த உணவுகள்',
      hi: 'फ्रोजन खाद्य पदार्थ',
      te: 'ఘనీభవించిన ఆహారాలు',
      kn: 'ಘನೀಕೃತ ಆಹಾರಗಳು',
      ml: 'ശീതീകരിച്ച ഭക്ഷണങ്ങൾ'
    },
    products: [
      {
        sku: 'GG-FRZ-001',
        name: 'Safal Premium Frozen Green Peas',
        description: 'Naturally sweet and farm tender green peas preserved at peak freshness.',
        price: 85,
        originalPrice: 105,
        discountPercent: 19,
        unit: 'pack',
        packSize: '500 g',
        stock: 50,
        isFeatured: true,
        translations: {
          ta: { name: 'சஃபால் உறைந்த பச்சை பட்டாணி', description: 'இயற்கை சுவை மாறாத ஃபிரெஷ் பச்சை பட்டாணி.' },
          hi: { name: 'सफल फ्रोजन हरी मटर', description: 'ताज़ी और मीठी हरी मटर हमेशा उपलब्ध।' }
        }
      },
      {
        sku: 'GG-FRZ-002',
        name: 'Safal Tender American Sweet Corn Kernels',
        description: 'Plump golden sweet corn kernels, perfect for butter corn, soups, and chaats.',
        price: 75,
        originalPrice: 90,
        discountPercent: 16,
        unit: 'pack',
        packSize: '500 g',
        stock: 45,
        translations: {
          ta: { name: 'ஸ்வீட் கார்ன் மக்காச்சோளம்', description: 'சுவையான அமெரிக்கன் ஸ்வீட் கார்ன் முத்துக்கள்.' },
          hi: { name: 'अमेरिकन स्वीट कॉर्न', description: 'चाट और सूप के लिए मीठे मक्के के दाने।' }
        }
      },
      {
        sku: 'GG-FRZ-003',
        name: 'McCain Crispy French Fries',
        description: 'Golden, crispy potato fries ready to fry or air-fry in just 3 minutes.',
        price: 99,
        originalPrice: 120,
        discountPercent: 17,
        unit: 'pack',
        packSize: '420 g',
        stock: 40,
        translations: {
          ta: { name: 'மெக்கெய்ன் பிரெஞ்ச் பிரைஸ்', description: 'மொறுமொறுப்பான சுவையான உருளைக்கிழங்கு பிரைஸ்.' },
          hi: { name: 'मैककेन फ्रेंच फ्राइज़', description: '3 मिनट में तैयार होने वाले कुरकुरे फ्रेंच फ्राइज़।' }
        }
      },
      {
        sku: 'GG-FRZ-004',
        name: 'ID Frozen Malabar Multi-Layer Parota (Pack of 5)',
        description: 'Crisp on the outside, flaky soft inside authentic layered Kerala parottas.',
        price: 80,
        originalPrice: 95,
        discountPercent: 15,
        unit: 'pack',
        packSize: '400 g (5 pcs)',
        stock: 55,
        translations: {
          ta: { name: 'மலபார் பரோட்டா (5 எண்ணம்)', description: 'சுவையான மென்மையான அடுக்கு பரோட்டா.' },
          hi: { name: 'मालाबार लच्छा पराठा (5 पीस)', description: 'परतदार और कुरकुरा स्वादिष्ट पराठा।' }
        }
      },
      {
        sku: 'GG-FRZ-005',
        name: 'Haldiram\'s Cocktail Punjabi Samosa',
        description: 'Mini crispy spiced potato pastry bites ready to deep-fry for evening chai.',
        price: 110,
        originalPrice: 135,
        discountPercent: 18,
        unit: 'pack',
        packSize: '360 g (12 pcs)',
        stock: 35,
        translations: {
          ta: { name: 'பஞ்சாபி சமோசா (12 எண்ணம்)', description: 'மசாலா உருளைக்கிழங்கு நிரப்பிய மொறுமொறு சமோசா.' },
          hi: { name: 'हल्दीराम कॉकटेल समोसा', description: 'शाम की चाय के साथ गरमागरम समोसे।' }
        }
      }
    ]
  },
  {
    name: 'Daily essentials',
    slug: 'daily-essentials',
    description: 'Everyday must-haves: pooja camphor, matches, kitchen tissues, batteries, and agarbatti',
    sortOrder: 19,
    translations: {
      ta: 'தினசரி தேவைகள்',
      hi: 'दैनिक आवश्यकताएं',
      te: 'రోజువారీ అవసరాలు',
      kn: 'ದೈನಂದಿನ ಅಗತ್ಯಗಳು',
      ml: 'ദൈനംദിന അവശ്യസാധനങ്ങൾ'
    },
    products: [
      {
        sku: 'GG-ESS-001',
        name: 'Mangaldeep Sandalwood Agarbatti (Incense Sticks)',
        description: 'Fragrant natural sandalwood pooja incense sticks for divine peace and prayer.',
        price: 45,
        originalPrice: 50,
        discountPercent: 10,
        unit: 'pack',
        packSize: '120 sticks',
        stock: 110,
        isFeatured: true,
        translations: {
          ta: { name: 'மங்கள்தீப் சந்தன ஊதுபத்தி', description: 'இறை வழிபாட்டிற்கு நறுமண சந்தன ஊதுபத்தி.' },
          hi: { name: 'मंगलदीप चंदन अगरबत्ती', description: 'पूजा के लिए मनभावन चंदन की खुशबूदार अगरबत्ती।' }
        }
      },
      {
        sku: 'GG-ESS-002',
        name: 'Pure Bhimseni Camphor (Pachai Karpooram)',
        description: '100% pure natural non-toxic crystalline camphor for spiritual aarti and aroma.',
        price: 65,
        originalPrice: 75,
        discountPercent: 13,
        unit: 'jar',
        packSize: '100 g',
        stock: 90,
        translations: {
          ta: { name: 'தூய பச்சை கற்பூரம்', description: 'பூஜைக்கும் நறுமணத்திற்கும் சுத்தமான பச்சை கற்பூரம்.' },
          hi: { name: 'भीमसेनी शुद्ध कपूर', description: '100% शुद्ध और प्राकृतिक पूजा कपूर।' }
        }
      },
      {
        sku: 'GG-ESS-003',
        name: 'Duracell Ultra AA Alkaline Batteries (Pack of 4)',
        description: 'Long-lasting power cells for TV remotes, wall clocks, and household flashlights.',
        price: 155,
        originalPrice: 180,
        discountPercent: 13,
        unit: 'pack',
        packSize: '4 pcs',
        stock: 70,
        translations: {
          ta: { name: 'டியூராசெல் பேட்டரி (4 பேக்)', description: 'ரிமோட் மற்றும் கடிகாரங்களுக்கான நீடித்த பேட்டரி.' },
          hi: { name: 'ड्यूरासेल एए बैटरी (4 का पैक)', description: 'रिमोट और घड़ियों के लिए लंबे समय तक चलने वाली बैटरी।' }
        }
      },
      {
        sku: 'GG-ESS-004',
        name: 'Origami 2-Ply Absorbent Kitchen Towel Tissue',
        description: 'Ultra-absorbent embossed paper towels for wiping oil, kitchen spills, and drying hands.',
        price: 65,
        originalPrice: 75,
        discountPercent: 13,
        unit: 'roll',
        packSize: '2 rolls',
        stock: 80,
        translations: {
          ta: { name: 'சமையலறை டிஷ்யூ ரோல் (2 ரோல்)', description: 'எண்ணெய் மற்றும் நீரினை உறிஞ்சும் கிச்சன் டிஷ்யூ.' },
          hi: { name: 'किचन टॉवल टिशू पेपर (2 रोल)', description: 'रसोई की सफाई और तेल सोखने वाला टिशू।' }
        }
      },
      {
        sku: 'GG-ESS-005',
        name: 'Homelite Safety Matchbox Bundle (Pack of 10)',
        description: 'Strong splinter-free wooden matches with quick damp-proof lighting head.',
        price: 20,
        originalPrice: 20,
        discountPercent: 0,
        unit: 'bundle',
        packSize: '10 matchboxes',
        stock: 150,
        translations: {
          ta: { name: 'தீப்பெட்டி பண்டில் (10 பெட்டிகள்)', description: 'வீட்டு உபயோகத்திற்கு தரமான தீப்பெட்டிகள்.' },
          hi: { name: 'माचिस बंडल (10 माचिस)', description: 'दैनिक घरेलू उपयोग के लिए सुरक्षित माचिस।' }
        }
      }
    ]
  },
  {
    name: 'Meat and seafood',
    slug: 'meat-and-seafood',
    description: 'Fresh farm-dressed chicken cuts, tender mutton, sea fish, and cleaned prawns',
    sortOrder: 20,
    translations: {
      ta: 'இறைச்சி மற்றும் கடல் உணவுகள்',
      hi: 'मांस और समुद्री भोजन',
      te: 'మాంసం మరియు సముద్ర ఆహారం',
      kn: 'ಮಾಂಸ ಮತ್ತು ಸಮುದ್ರಾಹಾರ',
      ml: 'മാംസവും സമുദ്രവിഭവങ്ങളും'
    },
    products: [
      {
        sku: 'GG-MET-001',
        name: 'Fresh Farm Chicken Curry Cut (Skinless)',
        description: 'Tender antibiotic-residue-free chicken bone-in pieces, cleaned and hygienically packed.',
        price: 190,
        originalPrice: 220,
        discountPercent: 13,
        unit: 'pack',
        packSize: '1 kg',
        stock: 50,
        isFeatured: true,
        translations: {
          ta: { name: 'பண்ணை கோழி இறைச்சி (கறி துண்டுகள்)', description: 'சுத்தப்படுத்தப்பட்ட நறுக்கிய புதிய கோழிக்கறி.' },
          hi: { name: 'ताजा चिकन करी कट', description: 'साफ किया हुआ हड्डी वाला ताजा चिकन।' }
        }
      },
      {
        sku: 'GG-MET-002',
        name: 'Fresh Boneless Chicken Breast Fillet',
        description: 'Lean high-protein juicy chicken breast fillets, ideal for tikka, grilling, and stir fries.',
        price: 165,
        originalPrice: 190,
        discountPercent: 13,
        unit: 'pack',
        packSize: '500 g',
        stock: 40,
        translations: {
          ta: { name: 'எலும்பில்லா சிக்கன் பிரெஸ்ட்', description: 'புரதம் நிறைந்த எலும்பில்லாத கோழி மார்புக்கறி.' },
          hi: { name: 'बोनलेस चिकन ब्रेस्ट', description: 'जिम डाइट और टिक्का के लिए बोनलेस चिकन।' }
        }
      },
      {
        sku: 'GG-MET-003',
        name: 'Fresh Seer Fish Steaks (Vanjaram)',
        description: 'King of sea fish: firm, meaty vanjaram fish slices, ideal for spicy pan tawa fry.',
        price: 490,
        originalPrice: 560,
        discountPercent: 12,
        unit: 'pack',
        packSize: '500 g',
        stock: 25,
        isFeatured: true,
        translations: {
          ta: { name: 'வஞ்சிரம் மீன் துண்டுகள்', description: 'சுவையான வஞ்சிர மீன் வறுவல் துண்டுகள்.' },
          hi: { name: 'सूरमई / सीर फिश स्लाइस', description: 'ताज़ी समुद्री सूरमई मछली के टुकड़े।' }
        }
      },
      {
        sku: 'GG-MET-004',
        name: 'Cleaned Deveined Medium Sea Prawns (Iral)',
        description: 'Peeled, deveined tail-on sweet sea prawns ready to cook into gravy or roast.',
        price: 295,
        originalPrice: 340,
        discountPercent: 13,
        unit: 'pack',
        packSize: '350 g',
        stock: 30,
        translations: {
          ta: { name: 'சுத்தம் செய்த இறால்', description: 'தோல் உரிக்கப்பட்டு நரம்பு நீக்கப்பட்ட புதிய இறால்.' },
          hi: { name: 'साफ किए हुए ताजे झींगे (प्रॉन)', description: 'बिना छिलके और धागे के ताजे झींगे।' }
        }
      },
      {
        sku: 'GG-MET-005',
        name: 'Tender Goat Mutton Curry Cut',
        description: 'Succulent grass-fed young goat meat pieces, perfect for slow-cooked aromatic curries.',
        price: 450,
        originalPrice: 500,
        discountPercent: 10,
        unit: 'pack',
        packSize: '500 g',
        stock: 30,
        translations: {
          ta: { name: 'நாட்டு ஆட்டிறைச்சி (மட்டன்)', description: 'மென்மையான இள ஆட்டுக் கறி துண்டுகள்.' },
          hi: { name: 'ताजा बकरे का मटन', description: 'स्वाद और सुगंध से भरपूर ताजा मटन करी कट।' }
        }
      }
    ]
  }
];

async function main() {
  console.log('--- Commencing GrocerGo Database Seeding ---');

  // 1. Seed or Upsert Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@grocergo.com' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@grocergo.com',
      passwordHash: adminPasswordHash,
      name: 'GrocerGo Administrator',
      phone: '+91 9876543210',
      role: 'ADMIN',
      preferredLanguage: 'en',
      villageTown: 'Hubli Central',
      address: 'GrocerGo Rural Logistics Centre, Market Road',
      landmark: 'Near Grain Mandi'
    }
  });
  console.log(`[Admin] Initialized: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Seed or Upsert Sample Customer User
  const customerPasswordHash = await bcrypt.hash('Customer@123', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@grocergo.com' },
    update: {
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER'
    },
    create: {
      email: 'customer@grocergo.com',
      passwordHash: customerPasswordHash,
      name: 'Ramesh Kumar',
      phone: '+91 9123456789',
      role: 'CUSTOMER',
      preferredLanguage: 'ta',
      villageTown: 'Perur, Coimbatore',
      address: '12, West Temple Street',
      landmark: 'Near Murugan Temple'
    }
  });
  console.log(`[Customer] Initialized: ${customerUser.email}`);

  // Create default address for customer
  const existingAddress = await prisma.address.findFirst({ where: { userId: customerUser.id } });
  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customerUser.id,
        streetAddress: '12, West Temple Street',
        villageTown: 'Perur, Coimbatore',
        landmark: 'Near Murugan Temple',
        pincode: '641010',
        isDefault: true
      }
    });
  }

  // 3. Seed Default Payment Settings
  const paymentSettings = await prisma.paymentSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      qrImageUrl: generateSvgDataUri('Scan & Pay with UPI', '#14532D'),
      upiId: 'grocergo@upi',
      accountName: 'GrocerGo Rural Direct Store',
      instructions: '1. Open any UPI application (GPay, PhonePe, Paytm, BHIM).\n2. Scan this QR code or pay to UPI ID: grocergo@upi.\n3. Pay the EXACT order total.\n4. Take a screenshot of the payment receipt showing the 12-digit UTR/UPI Reference Number.\n5. Upload the screenshot and enter your transaction reference below.',
      isActive: true
    }
  });
  console.log(`[PaymentSettings] Active QR Settings initialized for UPI ID: ${paymentSettings.upiId}`);

  // 4. Seed 20 Categories & 100 Products
  let totalCategoriesCreated = 0;
  let totalProductsCreated = 0;

  for (const catData of categoriesData) {
    const categorySvg = generateSvgDataUri(catData.name, '#218838');
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        description: catData.description,
        sortOrder: catData.sortOrder,
        imageUrl: categorySvg
      },
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        sortOrder: catData.sortOrder,
        imageUrl: categorySvg,
        isActive: true
      }
    });
    totalCategoriesCreated++;

    // Category translations
    const langKeys = ['ta', 'hi', 'te', 'kn', 'ml'] as const;
    for (const lang of langKeys) {
      const translatedName = catData.translations[lang];
      if (translatedName) {
        await prisma.categoryTranslation.upsert({
          where: {
            categoryId_language: {
              categoryId: category.id,
              language: lang
            }
          },
          update: { name: translatedName },
          create: {
            categoryId: category.id,
            language: lang,
            name: translatedName
          }
        });
      }
    }

    // Seed 5 products for this category
    for (const prodData of catData.products) {
      const prodSlug = prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const productSvg = generateSvgDataUri(prodData.name, '#218838');

      const product = await prisma.product.upsert({
        where: { sku: prodData.sku },
        update: {
          name: prodData.name,
          slug: prodSlug,
          description: prodData.description,
          categoryId: category.id,
          price: prodData.price,
          originalPrice: prodData.originalPrice || prodData.price,
          discountPercent: prodData.discountPercent || 0,
          unit: prodData.unit,
          packSize: prodData.packSize,
          stock: prodData.stock,
          imageUrl: productSvg,
          isFeatured: prodData.isFeatured || false,
          isActive: true
        },
        create: {
          sku: prodData.sku,
          name: prodData.name,
          slug: prodSlug,
          description: prodData.description,
          categoryId: category.id,
          price: prodData.price,
          originalPrice: prodData.originalPrice || prodData.price,
          discountPercent: prodData.discountPercent || 0,
          unit: prodData.unit,
          packSize: prodData.packSize,
          stock: prodData.stock,
          imageUrl: productSvg,
          isFeatured: prodData.isFeatured || false,
          isActive: true
        }
      });
      totalProductsCreated++;

      // Product Translations
      if (prodData.translations) {
        for (const [lang, trans] of Object.entries(prodData.translations)) {
          if (trans) {
            await prisma.productTranslation.upsert({
              where: {
                productId_language: {
                  productId: product.id,
                  language: lang
                }
              },
              update: {
                name: trans.name,
                description: trans.description
              },
              create: {
                productId: product.id,
                language: lang,
                name: trans.name,
                description: trans.description
              }
            });
          }
        }
      }
    }
  }

  console.log(`[Catalogue] Seeded ${totalCategoriesCreated} Categories.`);
  console.log(`[Catalogue] Seeded ${totalProductsCreated} Products (exactly 5 products across each of the 20 categories).`);
  console.log('--- GrocerGo Database Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
