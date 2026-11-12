// Voice Assistant using Web Speech API (Recognition + Synthesis)
// Enhanced for instant responsiveness, native bilingual matching, and rich rural kiosk options
import { setAppLanguage } from '../i18n.js';
import { ApiService } from './api.js';
import { PRODUCT_TRANSLATIONS, CATEGORY_NAMES, getLocalizedProductName } from './productTranslations.js';

// Map language codes to BCP 47 language tags for SpeechRecognition
export const SPEECH_LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN'
};

export interface VoiceActionResult {
  type: 'NAVIGATE' | 'SEARCH' | 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'ORDER_STATUS' | 'CHANGE_LANGUAGE' | 'CLARIFICATION' | 'INFO';
  message: string;
  payload?: any;
}

// Fast keyword to SKU mapping for 0-latency instant direct matching
const FAST_PRODUCT_KEYWORD_MAP: Array<{ keywords: string[]; sku: string }> = [
  { keywords: ['tomato', 'tomatoes', 'தக்காளி', 'நாட்டு தக்காளி', 'टमाटर', 'టమోటా', 'టొమాటో', 'ಟೊಮೆಟೊ', 'തക്കാളി'], sku: 'GG-VEG-002' },
  { keywords: ['potato', 'potatoes', 'உருளைக்கிழங்கு', 'ஆலு', 'आलू', 'బంగాళాదుంప', 'ಆಲೂಗಡ್ಡೆ', 'ഉരുളക്കിഴങ്ങ്'], sku: 'GG-VEG-003' },
  { keywords: ['onion', 'onions', 'வெங்காயம்', 'प्याज', 'ఉల్లిపాయ', 'ಈರುಳ್ಳಿ', 'സവാള'], sku: 'GG-VEG-001' },
  { keywords: ['milk', 'fresh milk', 'பால்', 'பசும்பால்', 'दूध', 'పాలు', 'ಹಾಲು', 'പാൽ'], sku: 'GG-DAI-001' },
  { keywords: ['curd', 'dahi', 'தயிர்', 'दही', 'పెరుగు', 'ಮೊಸರು', 'തൈര്'], sku: 'GG-DAI-002' },
  { keywords: ['paneer', 'பனீர்', 'पनीर', 'పన్నీర్', 'ಪನೀರ್'], sku: 'GG-DAI-003' },
  { keywords: ['butter', 'வெண்ணெய்', 'मक्खन', 'बटर', 'వెన్న', 'ಬೆಣ್ಣೆ'], sku: 'GG-DAI-004' },
  { keywords: ['ghee', 'cow ghee', 'நெய்', 'பசும் நெய்', 'घी', 'నెయ్యి', 'ತುಪ್ಪ', 'നെയ്യ്'], sku: 'GG-OIL-002' },
  { keywords: ['sunflower oil', 'cooking oil', 'எண்ணெய்', 'சூரியகாந்தி', 'तेल', 'నూనె', 'ಎಣ್ಣೆ', 'എണ്ണ'], sku: 'GG-OIL-001' },
  { keywords: ['egg', 'eggs', 'முட்டை', 'வெள்ளை முட்டை', 'अंडा', 'अंडे', 'గుడ్లు', 'ಮೊಟ್ಟೆ', 'മുട്ട'], sku: 'GG-EGG-001' },
  { keywords: ['apple', 'apples', 'ஆப்பிள்', 'செவ்வாப்பிள்', 'सेब', 'ఆపిల్', 'ಸೇಬು'], sku: 'GG-FRU-001' },
  { keywords: ['banana', 'bananas', 'வாழைப்பழம்', 'केला', 'అరటిపండు', 'ಬಾಳೆಹಣ್ಣು', 'ഏത്തപ്പഴം'], sku: 'GG-FRU-002' },
  { keywords: ['mango', 'mangoes', 'மாம்பழம்', 'आम', 'మామిడి', 'ಮಾವು', 'മാമ്പഴം'], sku: 'GG-FRU-003' },
  { keywords: ['orange', 'oranges', 'ஆரஞ்சு', 'संतरा', 'నారింజ', 'ಕಿತ್ತಳೆ'], sku: 'GG-FRU-004' },
  { keywords: ['pomegranate', 'மாதுளை', 'அனார்', 'अनार', 'దానిమ్మ', 'ದಾಳಿಂಬೆ'], sku: 'GG-FRU-005' },
  { keywords: ['basmati', 'basmati rice', 'பாசுமதி அரிசி', 'बासमती', 'బాస్మతి'], sku: 'GG-RGD-001' },
  { keywords: ['ponni rice', 'boiled rice', 'பொன்னி அரிசி', 'పుழுங்கல் அரிசி', 'पोन्नी चावल', 'పొన్ని బియ్యం'], sku: 'GG-RGD-003' },
  { keywords: ['sona masoori', 'masoori', 'சோனா மசூரி', 'सोना मसूरी', 'సోనా మసూరి'], sku: 'GG-RGD-002' },
  { keywords: ['toor dal', 'arhar dal', 'துவரம் பருப்பு', 'துவரம்பருப்பு', 'तुअर दाल', 'अरहर दाल', 'కందిపప్పు', 'ತೊಗರಿ ಬೇಳೆ'], sku: 'GG-RGD-006' },
  { keywords: ['moong dal', 'பாசிப்பருப்பு', 'मूंग दाल', 'పెసరపప్పు', 'ಹೆಸರು ಬೇಳೆ'], sku: 'GG-RGD-007' },
  { keywords: ['urad dal', 'உளுந்து', 'வெள்ளை உளுந்து', 'उड़द दाल', 'మినపప్పు', 'ಉದ್ದಿನ ಬೇಳೆ'], sku: 'GG-RGD-009' },
  { keywords: ['atta', 'wheat flour', 'கோதுமை மாவு', 'ஆட்டா', 'आटा', 'गेहूं का आटा', 'గోధుమ పిండి', 'ಗೋಧಿ ಹಿಟ್ಟು'], sku: 'GG-FLR-001' },
  { keywords: ['maida', 'மைதா', 'मैदा', 'మైదా'], sku: 'GG-FLR-002' },
  { keywords: ['rava', 'sooji', 'ரவை', 'सूजी', 'రవ్వ', 'ರವೆ'], sku: 'GG-FLR-003' },
  { keywords: ['besan', 'கடலை மாவு', 'बेसन', 'శనగపిండి', 'ಕಡಲೆ ಹಿಟ್ಟು'], sku: 'GG-FLR-004' },
  { keywords: ['maggi', 'noodles', 'மேகி', 'நூடுல்ஸ்', 'मैगी', 'నూడుల్స్'], sku: 'GG-PKG-001' },
  { keywords: ['tea', 'tea powder', 'டீ', 'டீத்தூள்', 'தேநீர்', 'चाय', 'టీ', 'ಚಹಾ'], sku: 'GG-TEA-001' },
  { keywords: ['coffee', 'filter coffee', 'காபி', 'காபித்தூள்', 'कॉफी', 'కాఫీ', 'ಕಾಫಿ'], sku: 'GG-TEA-002' },
  { keywords: ['sugar', 'சர்க்கரை', 'சீனி', 'चीनी', 'చక్కెర', 'ಸಕ್ಕರೆ'], sku: 'GG-SPN-001' },
  { keywords: ['salt', 'உப்பு', 'தூள் உப்பு', 'नमक', 'ఉప్పు', 'ಉಪ್ಪು'], sku: 'GG-SPN-002' },
  { keywords: ['turmeric', 'மஞ்சள் தூள்', 'மஞ்சள்', 'हल्दी', 'పసుపు', 'ಅರಿಶಿನ'], sku: 'GG-SPN-003' },
  { keywords: ['chilli powder', 'மிளகாய் தூள்', 'मिर्च पाउडर', 'కారం పొడి', 'ಖಾರದ ಪುಡಿ'], sku: 'GG-SPN-004' },
  { keywords: ['bread', 'பிரெட்', 'ரொட்டி', 'ब्रेड', 'పావ్', 'బ్రెడ్', 'ಬ್ರೆಡ್'], sku: 'GG-BRD-001' },
  { keywords: ['chicken', 'கோழி இறைச்சி', 'சிக்கன்', 'चिकन', 'చికెన్', 'ಚಿಕನ್'], sku: 'GG-MET-001' },
  { keywords: ['mutton', 'ஆட்டுக்கறி', 'மட்டன்', 'मटन', 'మటన్', 'ಮಟನ್'], sku: 'GG-MET-004' },
  { keywords: ['fish', 'மீன்', 'மச்சிலி', 'मछली', 'చేప', 'ಮೀನು', 'മത്സ്യം'], sku: 'GG-MET-003' }
];

export class VoiceAssistant {
  private recognition: any = null;
  private isSupported: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true; // Provides real-time instant visual feedback
        this.recognition.maxAlternatives = 1;
        this.isSupported = true;
      }
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  // Non-blocking, snappy speech synthesis with safety timeout
  public speak(text: string, langCode: string = 'en'): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      try {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = SPEECH_LANG_MAP[langCode] || 'en-IN';
        utterance.rate = 1.05; // Slightly faster natural conversational pace
        utterance.pitch = 1.0;

        // Safety timeout so speech synthesis never hangs indefinitely
        const timer = setTimeout(() => {
          resolve();
        }, 4000);

        utterance.onend = () => {
          clearTimeout(timer);
          this.activeUtterance = null;
          resolve();
        };

        utterance.onerror = () => {
          clearTimeout(timer);
          this.activeUtterance = null;
          resolve();
        };

        this.activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    });
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Fast listening with real-time interim results callback and rapid silence detection
  public listen(
    langCode: string = 'en',
    onInterim?: (text: string) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported in this browser. Please use Chrome, Edge, Safari, or mobile browser.'));
        return;
      }

      try {
        this.recognition.abort(); // Cancel any lingering recognition session
      } catch {}

      this.recognition.lang = SPEECH_LANG_MAP[langCode] || 'en-IN';
      let finalTranscript = '';
      let silenceTimer: any = null;
      let hasResolved = false;

      const finish = (resultText: string) => {
        if (hasResolved) return;
        hasResolved = true;
        clearTimeout(silenceTimer);
        try {
          this.recognition.stop();
        } catch {}
        if (resultText && resultText.trim()) {
          resolve(resultText.trim());
        } else {
          reject(new Error('No speech heard. Please tap the mic and speak clearly.'));
        }
      };

      this.recognition.onresult = (event: any) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimText += item[0].transcript;
          }
        }

        const display = (finalTranscript + ' ' + interimText).trim();
        if (onInterim && display) {
          onInterim(display);
        }

        // When user has spoken something, start a short 900ms silence timer to finalize immediately
        if (display.length > 2) {
          clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => {
            finish(display);
          }, 900);
        }

        if (finalTranscript.trim()) {
          finish(finalTranscript);
        }
      };

      this.recognition.onspeechend = () => {
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          finish(finalTranscript);
        }, 500);
      };

      this.recognition.onerror = (event: any) => {
        if (hasResolved) return;
        clearTimeout(silenceTimer);
        if (event.error === 'no-speech') {
          reject(new Error('No speech detected. Please tap the mic and try again.'));
        } else if (event.error === 'not-allowed') {
          reject(new Error('Microphone permission denied. Please allow microphone access in your browser settings.'));
        } else {
          reject(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      this.recognition.onnomatch = () => {
        if (!hasResolved) {
          reject(new Error('Could not recognize phrase. Please speak clearly.'));
        }
      };

      try {
        this.recognition.start();
      } catch (e: any) {
        reject(new Error(e.message || 'Could not start microphone.'));
      }
    });
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  // Parse natural speech command with 0-latency matching and rich multilingual capabilities
  public async processCommand(
    command: string,
    currentLang: string = 'en',
    navigate: (path: string) => void,
    refreshCart?: () => void
  ): Promise<VoiceActionResult> {
    const text = command.toLowerCase().trim();

    // 1. Language change commands (All 6 supported languages)
    if (
      text.includes('tamil') ||
      text.includes('தமிழ்') ||
      text.includes('thamizh') ||
      text.includes('thamil') ||
      text.includes('change language to tamil') ||
      text.includes('change to tamil') ||
      text.includes('switch to tamil') ||
      text.includes('switch language to tamil') ||
      text.includes('set language to tamil') ||
      text.includes('tamil language') ||
      text.includes('speak tamil') ||
      text.includes('change lanugage to tamil') ||
      text.includes('தமிழுக்கு மாற்று') ||
      text.includes('தமிழுக்கு மாத்து') ||
      text.includes('மொழியை தமிழுக்கு மாற்று') ||
      text.includes('தமிழ் மொழி')
    ) {
      setAppLanguage('ta');
      return {
        type: 'CHANGE_LANGUAGE',
        message: 'மொழியை தமிழுக்கு மாற்றியுள்ளேன். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
        payload: { lang: 'ta' }
      };
    }
    if (text.includes('hindi') || text.includes('हिन्दी') || text.includes('हिंदी')) {
      setAppLanguage('hi');
      return {
        type: 'CHANGE_LANGUAGE',
        message: 'भाषा को हिन्दी में बदल दिया गया है। मैं आपकी क्या सहायता कर सकता हूँ?',
        payload: { lang: 'hi' }
      };
    }
    if (text.includes('telugu') || text.includes('తెలుగు')) {
      setAppLanguage('te');
      return {
        type: 'CHANGE_LANGUAGE',
        message: 'భాషను తెలుగుకు మార్చాను. నేను మీకు ఎలా సహాయం చేయగలను?',
        payload: { lang: 'te' }
      };
    }
    if (text.includes('kannada') || text.includes('ಕನ್ನಡ')) {
      setAppLanguage('kn');
      return {
        type: 'CHANGE_LANGUAGE',
        message: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
        payload: { lang: 'kn' }
      };
    }
    if (text.includes('malayalam') || text.includes('മലയാളം')) {
      setAppLanguage('ml');
      return {
        type: 'CHANGE_LANGUAGE',
        message: 'ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി. ഞാൻ എങ്ങനെ സഹായിക്കണം?',
        payload: { lang: 'ml' }
      };
    }
    if (text.includes('english')) {
      setAppLanguage('en');
      return {
        type: 'CHANGE_LANGUAGE',
        message: 'Language switched to English. How can I help you today?',
        payload: { lang: 'en' }
      };
    }

    // 2. Checkout / Place Order
    if (
      text.includes('checkout') ||
      text.includes('check out') ||
      text.includes('place order') ||
      text.includes('pay now') ||
      text.includes('செக் அவுட்') ||
      text.includes('ஆர்டர் செய்') ||
      text.includes('चेकआउट')
    ) {
      navigate('/checkout');
      return {
        type: 'NAVIGATE',
        message: 'Proceeding to checkout and delivery address now.'
      };
    }

    // 3. Clear Cart
    if (
      text.includes('clear cart') ||
      text.includes('empty cart') ||
      text.includes('delete cart') ||
      text.includes('கூடையை காலி செய்') ||
      text.includes('कार्ट खाली करो')
    ) {
      try {
        await ApiService.clearCart();
        if (refreshCart) refreshCart();
        return {
          type: 'REMOVE_FROM_CART',
          message: 'Your shopping cart has been cleared.'
        };
      } catch {
        return {
          type: 'INFO',
          message: 'Unable to clear cart right now.'
        };
      }
    }

    // 4. Open / View Cart
    if (
      text.includes('cart') ||
      text.includes('basket') ||
      text.includes('கூடை') ||
      text.includes('கார்ட்') ||
      text.includes('कार्ट') ||
      text.includes('కార్ట్') ||
      text.includes('ಕಾರ್ಟ್')
    ) {
      if (
        text.includes('open') ||
        text.includes('show') ||
        text.includes('view') ||
        text.includes('my cart') ||
        text.includes('திற') ||
        text.includes('காட்டு') ||
        text.includes('खोलो') ||
        text.includes('చూపించు') ||
        text === 'cart' ||
        text === 'open cart'
      ) {
        navigate('/cart');
        return {
          type: 'NAVIGATE',
          message: 'Opening your shopping basket now.'
        };
      }
    }

    // 5. Check Order Status
    if (
      text.includes('order status') ||
      text.includes('latest order') ||
      text.includes('track order') ||
      text.includes('my orders') ||
      text.includes('where is my order') ||
      text.includes('என் ஆர்டர்') ||
      text.includes('ஆர்டர் நிலை') ||
      text.includes('ऑर्डर स्थिति') ||
      text.includes('आर्डर स्टेटस')
    ) {
      try {
        const res = await ApiService.getMyOrders();
        const orders = res.data.data.orders;
        if (!orders || orders.length === 0) {
          navigate('/orders');
          return {
            type: 'INFO',
            message: 'You have not placed any orders yet. Browse our farm-fresh groceries!'
          };
        }
        const latest = orders[0];
        const statusMsg = `Your latest order #${latest.orderNumber} is currently ${latest.orderStatus}, with payment status ${latest.paymentStatus}. Total: ₹${latest.total}.`;
        navigate(`/orders/${latest.id}`);
        return {
          type: 'ORDER_STATUS',
          message: statusMsg,
          payload: { order: latest }
        };
      } catch {
        navigate('/orders');
        return {
          type: 'NAVIGATE',
          message: 'Opening your order tracking page.'
        };
      }
    }

    // 6. Deals & Offers / Popular Items
    if (
      text.includes('deal') ||
      text.includes('deals') ||
      text.includes('offer') ||
      text.includes('offers') ||
      text.includes('bestseller') ||
      text.includes('best seller') ||
      text.includes('popular') ||
      text.includes('சலுகை') ||
      text.includes('ஆபர்') ||
      text.includes('ऑफर')
    ) {
      navigate('/products?sortBy=popular');
      return {
        type: 'NAVIGATE',
        message: "Showing today's top popular deals and discounts."
      };
    }

    // 7. Store Help, Delivery & UPI FAQs
    if (text.includes('help') || text.includes('support') || text.includes('contact') || text.includes('care') || text.includes('உதவி')) {
      navigate('/help');
      return {
        type: 'NAVIGATE',
        message: 'Opening GrocerGo customer help and support page.'
      };
    }
    if (text.includes('delivery charge') || text.includes('free delivery') || text.includes('டெலிவரி கட்டணம்') || text.includes('डिलीवरी')) {
      return {
        type: 'INFO',
        message: 'GrocerGo offers 100% FREE delivery on orders ₹300 and above! Standard rural doorstep delivery is only ₹30.'
      };
    }
    if (text.includes('upi') || text.includes('how to pay') || text.includes('qr code') || text.includes('பணம் செலுத்துவது எப்படி') || text.includes('पेमेंट')) {
      return {
        type: 'INFO',
        message: 'To pay, simply scan our store UPI QR code using Google Pay, PhonePe, Paytm, or BHIM and submit your screenshot receipt!'
      };
    }

    // 8. Category Navigation (All 19 Departments with Rich Multilingual Keywords)
    const categoryRules: Array<{ slug: string; keywords: string[] }> = [
      { slug: 'fruits', keywords: ['fruit', 'fruits', 'பழம்', 'பழங்கள்', 'फल', 'పండ్లు', 'ಹಣ್ಣುಗಳು', 'പഴങ്ങൾ'] },
      { slug: 'vegetables', keywords: ['vegetable', 'vegetables', 'veggie', 'veggies', 'காய்கறி', 'காய்கறிகள்', 'सब्जी', 'सब्जियां', 'కూరగాయలు', 'ತರಕಾರಿಗಳು', 'പച്ചക്കറികൾ'] },
      { slug: 'rice-grains-and-dals', keywords: ['rice', 'grains', 'pulses', 'dals', 'dal', 'அரிசி', 'தானியம்', 'பருப்பு', 'चावल', 'दाल', 'బియ్యం', 'పప్పులు', 'ಅಕ್ಕಿ', 'ಬೇಳೆ'] },
      { slug: 'cooking-oil-and-ghee', keywords: ['oil', 'ghee', 'sunflower oil', 'groundnut oil', 'எண்ணெய்', 'நெய்', 'तेल', 'घी', 'నూనె', 'నెయ్యి', 'ಎಣ್ಣೆ', 'ತುಪ್ಪ'] },
      { slug: 'milk-and-dairy', keywords: ['milk', 'dairy', 'curd', 'paneer', 'butter', 'cheese', 'பால்', 'தயிர்', 'பனீர்', 'வெண்ணெய்', 'दूध', 'दही', 'पनीर', 'पాలు', 'ಹಾಲು'] },
      { slug: 'beverages', keywords: ['beverage', 'beverages', 'juice', 'soda', 'drink', 'குளிர்பானம்', 'ஜூஸ்', 'जूस', 'शरबत', 'జ్యూస్'] },
      { slug: 'personal-care', keywords: ['soap', 'shampoo', 'toothpaste', 'personal care', 'சோப்', 'ஷாம்பு', 'साबुन', 'शैम्पू', 'సబ్బు', 'ಶ್ಯಾಂಪೂ'] },
      { slug: 'household-cleaning', keywords: ['cleaning', 'detergent', 'surf', 'dishwash', 'துணி துவைக்க', 'சர்ப்', 'सफाई', 'डिटर्जेंट'] },
      { slug: 'baby-care', keywords: ['baby', 'diaper', 'pampers', 'wipes', 'குழந்தை', 'டயப்பர்', 'शिशु', 'बच्चा', 'డయాపర్'] },
      { slug: 'frozen-foods', keywords: ['frozen', 'green peas', 'fries', 'samosa', 'குளிரூட்டப்பட்ட', 'சமோசா', 'समोसा', 'फ्रोजन'] },
      { slug: 'daily-essentials', keywords: ['essential', 'essentials', 'pooja', 'camphor', 'agarbatti', 'கற்பூரம்', 'ஊதுபத்தி', 'தீப்பெட்டி', 'पूजा', 'कपूर'] },
      { slug: 'meat-and-seafood', keywords: ['meat', 'chicken', 'mutton', 'fish', 'prawn', 'seafood', 'இறைச்சி', 'கோழி', 'மட்டன்', 'மீன்', 'चिकन', 'मटन', 'मछली'] }
    ];

    for (const rule of categoryRules) {
      const isMatch = rule.keywords.some((kw) => text.includes(kw));
      if (isMatch && (text.includes('show') || text.includes('category') || text.includes('browse') || text.includes('open') || text.includes('view') || text.includes('காட்டு') || text.includes('திற') || text.includes('दिखाओ') || text.includes('చూపించు') || text === rule.slug || text === `show ${rule.slug}`)) {
        navigate(`/category/${rule.slug}`);
        const catName = rule.slug.replace(/-/g, ' ');
        return {
          type: 'NAVIGATE',
          message: `Showing farm-fresh groceries in: ${catName}.`
        };
      }
    }

    // 9. Add to Cart Command
    const isAddCommand =
      text.includes('add') ||
      text.includes('buy') ||
      text.includes('put in') ||
      text.includes('சேர்') ||
      text.includes('வாங்கு') ||
      text.includes('जोड़ो') ||
      text.includes('खरीदो') ||
      text.includes('చేర్చు') ||
      text.includes('ಹಾಕು');

    if (isAddCommand) {
      // Determine quantity if spoken
      let quantity = 1;
      if (text.includes('two') || text.includes('2 ') || text.includes(' 2') || text.includes('இரண்டு') || text.includes('दो') || text.includes('రెండు')) {
        quantity = 2;
      } else if (text.includes('three') || text.includes('3 ') || text.includes(' 3') || text.includes('மூன்று') || text.includes('तीन')) {
        quantity = 3;
      } else if (text.includes('four') || text.includes('4 ') || text.includes(' 4') || text.includes('நான்கு') || text.includes('चार')) {
        quantity = 4;
      } else if (text.includes('five') || text.includes('5 ') || text.includes(' 5') || text.includes('ஐந்து') || text.includes('पांच')) {
        quantity = 5;
      }

      // First: Instant Direct SKU Matching (0-latency instant response!)
      let targetSku: string | null = null;
      for (const item of FAST_PRODUCT_KEYWORD_MAP) {
        if (item.keywords.some((kw) => text.includes(kw))) {
          targetSku = item.sku;
          break;
        }
      }

      if (targetSku) {
        try {
          const res = await ApiService.getProductById(targetSku, currentLang);
          const product = res.data.data.product;
          await ApiService.addToCart(product.id, quantity);
          if (refreshCart) refreshCart();
          const pName = getLocalizedProductName(product, currentLang);
          return {
            type: 'ADD_TO_CART',
            message: `Added ${quantity} ${product.packSize || product.unit} of ${pName} to your cart! Total: ₹${product.price * quantity}.`,
            payload: { product, quantity }
          };
        } catch {}
      }

      // Second: Fallback to API product search
      const cleanQuery = text
        .replace(/add/g, '')
        .replace(/to cart/g, '')
        .replace(/in cart/g, '')
        .replace(/into cart/g, '')
        .replace(/please/g, '')
        .replace(/two|three|four|five|2|3|4|5|one|1/g, '')
        .replace(/kilograms|kilogram|kg|grams|g|litres|litre|l|packets|packet|pack|boxes/g, '')
        .trim();

      if (cleanQuery.length > 1) {
        try {
          const searchRes = await ApiService.getProducts({ search: cleanQuery, limit: 3, lang: currentLang });
          const products = searchRes.data.data.products;
          if (products && products.length > 0) {
            const target = products[0];
            await ApiService.addToCart(target.id, quantity);
            if (refreshCart) refreshCart();
            const pName = getLocalizedProductName(target, currentLang);
            return {
              type: 'ADD_TO_CART',
              message: `Added ${quantity} ${target.packSize || target.unit} of ${pName} to your cart for ₹${target.price * quantity}.`,
              payload: { product: target, quantity }
            };
          }
        } catch {}
      }
    }

    // 10. General Search Query
    let searchQuery = text
      .replace(/find/g, '')
      .replace(/search/g, '')
      .replace(/show me/g, '')
      .replace(/look for/g, '')
      .replace(/where is/g, '')
      .replace(/தேடு/g, '')
      .replace(/காட்டு/g, '')
      .replace(/खोजो/g, '')
      .replace(/दिखाओ/g, '')
      .trim();

    if (searchQuery.length > 1) {
      try {
        const searchRes = await ApiService.getProducts({ search: searchQuery, limit: 5, lang: currentLang });
        const products = searchRes.data.data.products;

        if (products.length > 0) {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
          const first = products[0];
          const pName = getLocalizedProductName(first, currentLang);
          return {
            type: 'SEARCH',
            message: `Found ${products.length} items for "${searchQuery}". For example, ${pName} is ₹${first.price} per ${first.packSize}.`,
            payload: { products }
          };
        } else {
          return {
            type: 'CLARIFICATION',
            message: `No exact matches found for "${searchQuery}". Try saying "Show vegetables", "Add milk", or "Open my cart".`
          };
        }
      } catch {}
    }

    // 11. Friendly Fallback
    return {
      type: 'INFO',
      message: `I heard: "${command}". You can say "Add milk", "Show vegetables", "Open cart", "Order status", or tap any quick option below.`
    };
  }
}

export const voiceAssistantService = new VoiceAssistant();
