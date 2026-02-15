/**
 * KISAN-DRISHTI — Main JavaScript
 * Tailwind config (must run before Tailwind CDN), language, theme, core functionality
 */
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#0d5c0d',
          'primary-hover': '#0a4a0a',
          'primary-light': '#e8f5e8',
          'background-light': '#f5f9f5',
          'background-dark': '#0a1f0a',
          'neutral-soft': '#e8eee8',
          'accent-gold': '#b8860b',
          forest: '#0a4b0a',
          mint: '#e0f2e0',
          'border-muted': '#c5d9c5',
          'neutral-border': '#dce5dc',
          'neutral-muted': '#5c665c'
        },
        fontFamily: { display: ['Work Sans', 'system-ui', 'sans-serif'] },
        borderRadius: { DEFAULT: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.25rem', full: '9999px' },
        boxShadow: {
          card: '0 1px 3px rgba(13, 92, 13, 0.08)',
          'card-hover': '0 12px 32px -8px rgba(13, 92, 13, 0.12), 0 0 0 1px rgba(13, 92, 13, 0.06)'
        }
      }
    }
  };
}

let currentLanguage = localStorage.getItem('language') || 'en';

// Crop Data with Multi-Language Support
const cropData = {
  wheat: {
    emoji: '🌾',
    name: { en: 'Wheat', hi: 'गेहूँ', mr: 'गहू' },
    price: 2450,
    trend: '+20',
    trendDirection: 'up',
    suggestion: 'sell_today',
    volatility: 'medium'
  },
  onion: {
    emoji: '🧅',
    name: { en: 'Onion', hi: 'प्याज', mr: 'कांदा' },
    price: 1800,
    trend: '-50',
    trendDirection: 'down',
    suggestion: 'wait_2_days',
    volatility: 'high'
  },
  corn: {
    emoji: '🌽',
    name: { en: 'Corn', hi: 'मक्का', mr: 'मका' },
    price: 1950,
    trend: '+10',
    trendDirection: 'up',
    suggestion: 'sell_today',
    volatility: 'low'
  },
  rice: {
    emoji: '🍚',
    name: { en: 'Rice', hi: 'चावल', mr: 'तांदूळ' },
    price: 3200,
    trend: '+80',
    trendDirection: 'up',
    suggestion: 'sell_today',
    volatility: 'medium'
  },
  tomato: {
    emoji: '🍅',
    name: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' },
    price: 2400,
    trend: '-120',
    trendDirection: 'down',
    suggestion: 'wait_3_days',
    volatility: 'high'
  },
  potato: {
    emoji: '🥔',
    name: { en: 'Potato', hi: 'आलू', mr: 'बटाटा' },
    price: 1500,
    trend: '+30',
    trendDirection: 'up',
    suggestion: 'sell_today',
    volatility: 'low'
  },
  soybean: {
    emoji: '🫘',
    name: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' },
    price: 4200,
    trend: '+150',
    trendDirection: 'up',
    suggestion: 'sell_today',
    volatility: 'medium'
  },
  sugarcane: {
    emoji: '🎋',
    name: { en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
    price: 350,
    trend: '+5',
    trendDirection: 'up',
    suggestion: 'hold',
    volatility: 'low'
  },
  cotton: {
    emoji: '🌿',
    name: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
    price: 6500,
    trend: '+200',
    trendDirection: 'up',
    suggestion: 'sell_today',
    volatility: 'high'
  },
  pulses: {
    emoji: '🌰',
    name: { en: 'Pulses', hi: 'दाल', mr: 'डाळ' },
    price: 4800,
    trend: '-100',
    trendDirection: 'down',
    suggestion: 'wait_2_days',
    volatility: 'medium'
  }
};

// Shared price state (PS: instant sync between official and farmer)
const PRICES_KEY = 'kisan_drishti_prices';
function getPriceData() {
  try {
    const raw = localStorage.getItem(PRICES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) { }
  return JSON.parse(JSON.stringify(cropData));
}
function savePriceData(data) {
  try {
    localStorage.setItem(PRICES_KEY, JSON.stringify(data));
  } catch (e) { }
}

// Translation System — load from JSON (PS requirement), fallback to in-code
let translations = {};
const FALLBACK_TRANSLATIONS = {
  en: {
    // Navigation
    'nav.prices': 'Prices',
    'nav.trends': 'Trends',
    'nav.profit': 'Profit',
    'nav.mandi': 'Mandi',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',

    // Hero Section
    'hero.main_headline': 'Know Today\'s Crop Prices Instantly — In Your Language',
    'hero.sub_headline': 'Helping farmers decide when and where to sell for maximum profit.',
    'hero.voice_first': 'Voice-First',
    'hero.smart_decisions': 'Smart Decisions',
    'hero.location_aware': 'Location-Aware',
    'hero.farmer_title': 'Continue as Farmer',
    'hero.farmer_desc': 'Check prices • Voice commands • Smart profit tips',
    'hero.farmer_enter': 'Start Now',
    'hero.official_title': 'Continue as Market Official',
    'hero.official_desc': 'Update prices • View analytics • Manage reports',
    'hero.official_enter': 'Enter Portal',

    // Dashboard
    'dashboard.market_prices': 'Market Prices',
    'dashboard.market_prices_title': 'Market Prices मंडी भाव',
    'dashboard.location': 'Azadpur Mandi, New Delhi',
    'dashboard.location_info': 'Azadpur Mandi, New Delhi · <span class="font-semibold text-slate-700 dark:text-slate-300">Today</span>',
    'dashboard.today': 'Today',
    'dashboard.updated_ago': 'Updated {time} ago',
    'dashboard.voice_tooltip': 'बोलने के लिए दबाएं · Click to speak',
    'dashboard.alerts': 'Alerts',
    'dashboard.play_all': 'Play All Prices',

    // Mandi Locator
    'mandi.nearby': 'Nearby Mandis',
    'mandi.current_location': 'Current Location: {location}',
    'mandi.change_location': 'Change Location',
    'mandi.search_placeholder': 'Search markets or pin codes...',
    'mandi.markets_found': '{count} Markets found near you',
    'mandi.open_now': 'Open Now',
    'mandi.closest': 'Closest (Distance)',
    'mandi.get_directions': 'Get Directions',
    'mandi.contact': 'Contact: {name} • {phone}',
    'mandi.specializes': 'Specializes in: {crops}',
    'mandi.open_status': 'OPEN NOW',
    'mandi.closed_status': 'CLOSED (Opens {time})',
    'mandi.km_away': '{km} km away',
    'mandi.view_on_map': 'View on Map',
    'mandi.unavailable': 'Unavailable',
    'mandi.your_location': 'Your Location',
    'mandi.location_not_found': 'Location not found.',
    'mandi.fetch_error': 'Unable to fetch nearby mandis.',
    'mandi.ai_suggestion': 'AI Suggestion: {name} has high demand today.',

    // Voice Commands
    'voice.listening': 'Listening...',
    'voice.no_speech': 'I didn\'t hear anything. Please try again.',
    'voice.price_intro': 'Today\'s market prices are: ',
    'voice.which_crop': 'Which crop would you like to know the price for?',
    'voice.best_price': 'Today, wheat has the highest price at ₹2,450 per quintal with an increasing trend.',
    'voice.sell_advice': 'Based on current trends, it\'s a good time to sell wheat as prices are increasing. For onions, you might want to wait 2-3 days as prices are currently down.',
    'voice.market_info': 'The nearest market is Krishi Upaj Mandi, just 3.2 kilometers away from your location.',
    'voice.weather': 'Today\'s weather is clear with 32 degrees temperature. Good conditions for harvesting.',
    'voice.help': 'You can ask me about crop prices, market locations, selling advice, or weather. Just say \'wheat price\' or \'where should I sell today\'.',
    'voice.not_understood': 'I didn\'t understand that. You can ask about crop prices, market locations, or selling advice.',

    // Profit Calculator
    'profit.title': 'Profit Estimator',
    'profit.subtitle': 'Calculate your potential earnings based on the latest regional market trends and real-time crop pricing.',
    'profit.select_crop': 'Select Crop Type',
    'profit.weight': 'Estimated Weight (quintals)',
    'profit.calculate': 'Calculate My Income',
    'profit.estimated': 'Estimated Earnings',
    'profit.overview': 'Earnings Overview',
    'profit.suggestions': 'Smart Suggestions',

    // Common
    'common.privacy': 'Privacy',
    'common.help': 'Help',
    'common.contact': 'Contact',
    'common.all_rights': 'All rights reserved.',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.close': 'Close',
    'common.select_language': 'Select Language'
  },
  hi: {
    // Navigation
    'nav.prices': 'कीमतें',
    'nav.trends': 'रुझान',
    'nav.profit': 'लाभ',
    'nav.mandi': 'मंडी',
    'nav.profile': 'प्रोफाइल',
    'nav.dashboard': 'डैशबोर्ड',

    // Hero Section
    'hero.main_headline': 'आज की फसल की कीमतें तुरंत जानें — अपनी भाषा में',
    'hero.sub_headline': 'किसानों को अधिकतम लाभ के लिए कब और कहाँ बेचना है, इसमें मदद करना।',
    'hero.voice_first': 'वॉइस-फर्स्ट',
    'hero.smart_decisions': 'स्मार्ट निर्णय',
    'hero.location_aware': 'स्थान-जागरूक',
    'hero.farmer_title': 'किसान के रूप में जारी रखें',
    'hero.farmer_desc': 'कीमतें देखें • वॉइस कमांड • स्मार्ट लाभ टिप्स',
    'hero.farmer_enter': 'अभी शुरू करें',
    'hero.official_title': 'बाजार अधिकारी के रूप में जारी रखें',
    'hero.official_desc': 'कीमतें अपडेट करें • एनालिटिक्स देखें • रिपोर्ट प्रबंधित करें',
    'hero.official_enter': 'पोर्टल में प्रवेश करें',

    // Dashboard
    'dashboard.market_prices': 'बाजार कीमतें',
    'dashboard.market_prices_title': 'बाजार कीमतें मंडी भाव',
    'dashboard.location': 'आजादपुर मंडी, नई दिल्ली',
    'dashboard.location_info': 'आजादपुर मंडी, नई दिल्ली · <span class="font-semibold text-slate-700 dark:text-slate-300">आज</span>',
    'dashboard.today': 'आज',
    'dashboard.updated_ago': '{time} पहले अपडेट किया गया',
    'dashboard.voice_tooltip': 'बोलने के लिए दबाएं · क्लिक करके बोलें',
    'dashboard.alerts': 'चेतावनियां',
    'dashboard.play_all': 'सभी कीमतें चलाएं',

    // Mandi Locator
    'mandi.nearby': 'निकटवर्ती मंडियां',
    'mandi.current_location': 'वर्तमान स्थान: {location}',
    'mandi.change_location': 'स्थान बदलें',
    'mandi.search_placeholder': 'बाजार या पिन कोड खोजें...',
    'mandi.markets_found': 'आपके पास {count} बाजार मिले',
    'mandi.open_now': 'अभी खुला है',
    'mandi.closest': 'निकटतम (दूरी)',
    'mandi.get_directions': 'दिशा निर्देश प्राप्त करें',
    'mandi.contact': 'संपर्क: {name} • {phone}',
    'mandi.specializes': 'विशेषज्ञता: {crops}',
    'mandi.open_status': 'अभी खुला है',
    'mandi.closed_status': 'बंद ({time} पर खुलता है)',
    'mandi.km_away': '{km} किमी दूर',
    'mandi.view_on_map': 'मानचित्र पर देखें',
    'mandi.unavailable': 'अनुपलब्ध',
    'mandi.your_location': 'आपका स्थान',
    'mandi.location_not_found': 'स्थान नहीं मिला।',
    'mandi.fetch_error': 'निकटवर्ती मंडियां लोड नहीं हो सकीं।',
    'mandi.ai_suggestion': 'AI सुझाव: आज {name} की मांग अधिक है।',

    // Voice Commands
    'voice.listening': 'सुन रहे हैं...',
    'voice.no_speech': 'मुझे कुछ सुनाई नहीं दिया। कृपया फिर से कोशिश करें।',
    'voice.price_intro': 'आज की बाजार कीमतें हैं: ',
    'voice.which_crop': 'आप किस फसल की कीमत जानना चाहते हैं?',
    'voice.best_price': 'आज, गेहूँ की कीमत सबसे अधिक ₹2,450 प्रति क्विंटल है और बढ़ती प्रवृत्ति के साथ।',
    'voice.sell_advice': 'वर्तमान प्रवृत्तियों के आधार पर, गेहूँ बेचने का अच्छा समय है क्योंकि कीमतें बढ़ रही हैं। प्याज के लिए, आप 2-3 दिन इंतजार करना चाह सकते हैं क्योंकि कीमतें वर्तमान में कम हैं।',
    'voice.market_info': 'निकटतम बाजार कृषि उपज मंडी है, आपके स्थान से केवल 3.2 किलोमीटर दूर।',
    'voice.weather': 'आज का मौसम साफ है और 32 डिग्री तापमान के साथ। कटाई के लिए अच्छी स्थितियां।',
    'voice.help': 'आप मुझसे फसल कीमतों, बाजार स्थानों, बेचने की सलाह, या मौसम के बारे में पूछ सकते हैं। बस \'गेहूँ कीमत\' या \'आज कहाँ बेचूँ\' कहें।',
    'voice.not_understood': 'मुझे समझ नहीं आया। आप फसल कीमतों, बाजार स्थानों, या बेचने की सलाह के बारे में पूछ सकते हैं।',

    // Profit Calculator
    'profit.title': 'लाभ अनुमानक',
    'profit.subtitle': 'नवीनतम क्षेत्रीय बाजार प्रवृत्तियों और रियल-टाइम फसल मूल्य निर्धारण के आधार पर अपनी संभावित कमाई की गणना करें।',
    'profit.select_crop': 'फसल प्रकार चुनें',
    'profit.weight': 'अनुमानित वजन (क्विंटल)',
    'profit.calculate': 'मेरी आय गणना करें',
    'profit.estimated': 'अनुमानित कमाई',
    'profit.overview': 'कमाई अवलोकन',
    'profit.suggestions': 'स्मार्ट सुझाव',

    // Common
    'common.privacy': 'गोपनीयता',
    'common.help': 'सहायता',
    'common.contact': 'संपर्क',
    'common.all_rights': 'सभी अधिकार सुरक्षित।',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर करें',
    'common.close': 'बंद करें',
    'common.select_language': 'भाषा चुनें'
  },
  mr: {
    // Navigation
    'nav.prices': 'किंमती',
    'nav.trends': 'कलाक्ष',
    'nav.profit': 'नफा',
    'nav.mandi': 'मंडी',
    'nav.profile': 'प्रोफाइल',
    'nav.dashboard': 'डॅशबोर्ड',

    // Hero Section
    'hero.main_headline': 'आजची पिके किंमत त्वरित जाणा — तुमच्या भाषेत',
    'hero.sub_headline': 'शेतकऱ्यांना कमाल नफ्यासाठी कधी आणि कुठे विकायचे यात मदत करणे.',
    'hero.voice_first': 'व्हॉइस-फर्स्ट',
    'hero.smart_decisions': 'स्मार्ट निर्णय',
    'hero.location_aware': 'स्थान-जागरूक',
    'hero.farmer_title': 'शेतकरी म्हणून सुरू ठेवा',
    'hero.farmer_desc': 'किंमती पहा • व्हॉइस कमांड • स्मार्ट नफा टिप्स',
    'hero.farmer_enter': 'आता सुरू करा',
    'hero.official_title': 'बाजार अधिकारी म्हणून सुरू ठेवा',
    'hero.official_desc': 'किंमती अपडेट करा • विश्लेषण पहा • अहवाल व्यवस्थापन करा',
    'hero.official_enter': 'पोर्टलमध्ये प्रवेश करा',

    // Dashboard
    'dashboard.market_prices': 'बाजार किंमती',
    'dashboard.market_prices_title': 'बाजार किंमती मंडी भाव',
    'dashboard.location': 'आझादपूर मंडी, नवी दिल्ली',
    'dashboard.location_info': 'आझादपूर मंडी, नवी दिल्ली · <span class="font-semibold text-slate-700 dark:text-slate-300">आज</span>',
    'dashboard.today': 'आज',
    'dashboard.updated_ago': '{time} आधी अपडेट केले',
    'dashboard.voice_tooltip': 'बोलण्यासाठी दाबा • क्लिक करून बोला',
    'dashboard.alerts': 'चेतावनी',
    'dashboard.play_all': 'सर्व किंमती चालवा',

    // Mandi Locator
    'mandi.nearby': 'जवळच्या मंड्या',
    'mandi.current_location': 'वर्तमान स्थान: {location}',
    'mandi.change_location': 'स्थान बदला',
    'mandi.search_placeholder': 'बाजार किंवा पिन कोड शोधा...',
    'mandi.markets_found': 'तुमच्या जवळ {count} बाजार सापडले',
    'mandi.open_now': 'आता खुले आहे',
    'mandi.closest': 'सर्वात जवळ (अंतर)',
    'mandi.get_directions': 'दिशा निर्देश मिळवा',
    'mandi.contact': 'संपर्क: {name} • {phone}',
    'mandi.specializes': 'विशेषता: {crops}',
    'mandi.open_status': 'आता खुले आहे',
    'mandi.closed_status': 'बंद ({time} ला उघडते)',
    'mandi.km_away': '{km} किमी दूर',
    'mandi.view_on_map': 'नकाशावर पहा',
    'mandi.unavailable': 'अनुपलब्ध',
    'mandi.your_location': 'तुमचे स्थान',
    'mandi.location_not_found': 'स्थान सापडले नाही.',
    'mandi.fetch_error': 'जवळच्या मंड्या लोड होऊ शकत नाहीत.',
    'mandi.ai_suggestion': 'AI सूचना: आज {name} ची मागणी जास्त आहे.',

    // Voice Commands
    'voice.listening': 'ऐकत आहोत...',
    'voice.no_speech': 'मला काही ऐकू आले नाही. कृपया पुन्हा प्रयत्न करा.',
    'voice.price_intro': 'आजच्या बाजारातील किंमती आहेत: ',
    'voice.which_crop': 'तुम्हाला कोणत्या पिकाची किंमत माहित आहे?',
    'voice.best_price': 'आज, गहूची किंमत सर्वाधिक ₹2,450 प्रति क्विंटल आहे आणि वाढत्या प्रवृत्तीसह.',
    'voice.sell_advice': 'वर्तमान प्रवृत्तींच्या आधारावर, गहू विकण्याची चांगली वेळ आहे कारण किंमती वाढत आहेत. कांद्यासाठी, तुम्ही 2-3 दिवस थांबू शकता कारण किंमती सध्या कमी आहेत.',
    'voice.market_info': 'जवळचे बाजार कृषि उपज मंडी आहे, तुमच्या स्थानापासून फक्त 3.2 किलोमीटर दूर.',
    'voice.weather': 'आजचे हवामान स्वच्छ आहे आणि 32 अंश तापमानासह. कापण्यासाठी चांगल्या परिस्थिती.',
    'voice.help': 'तुम्ही मला पिकांच्या किंमती, बाजार स्थाने, विक्री सल्ला, किंवा हवामानाबद्दल विचारू शकता. फक्त \'गहू किंमत\' किंवा \'आज कुठे विकावे\' म्हणा.',
    'voice.not_understood': 'मला समजले नाही. तुम्ही पिकांच्या किंमती, बाजार स्थाने, किंवा विक्री सल्ल्याबद्दल विचारू शकता.',

    // Profit Calculator
    'profit.title': 'नफा अंदाजक',
    'profit.subtitle': 'अद्ययावत क्षेत्रीय बाजार प्रवृत्ती आणि रिअल-टाइम पिक मूल्य निर्धारणाच्या आधारावर तुमची संभाव्य कमाई मोजा.',
    'profit.select_crop': 'पिक प्रकार निवडा',
    'profit.weight': 'अंदाजित वजन (क्विंटल)',
    'profit.calculate': 'माझी उत्पन्न गणना करा',
    'profit.estimated': 'अंदाजित कमाई',
    'profit.overview': 'कमाई अवलोकन',
    'profit.suggestions': 'स्मार्ट सल्ले',

    // Common
    'common.privacy': 'गोपनीयता',
    'common.help': 'मदत',
    'common.contact': 'संपर्क',
    'common.all_rights': 'सर्व हक्क सुरक्षित.',
    'common.loading': 'लोड होत आहे...',
    'common.error': 'त्रुटी',
    'common.cancel': 'रद्द करा',
    'common.save': 'जतन करा',
    'common.edit': 'संपादित करा',
    'common.delete': 'हटवा',
    'common.search': 'शोधा',
    'common.filter': 'फिल्टर करा',
    'common.close': 'बंद करा',
    'common.select_language': 'भाषा निवडा'
  }
};

// Load translations from JSON file (PS: local translation JSON file)
function getTranslationsBasePath() {
  const script = Array.from(document.scripts).find(s => s.src && s.src.includes('main.js'));
  if (!script || !script.src) return 'js/';
  return script.src.replace(/\/[^/]*$/, '/');
}
function loadTranslationsFromJSON() {
  const base = getTranslationsBasePath();
  const url = base + 'translations.json';
  fetch(url)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      if (data && typeof data === 'object' && (data.en || data.hi || data.mr)) {
        translations = data;
        if (typeof updateAllTexts === 'function') updateAllTexts();
      }
    })
    .catch(() => { /* keep fallback */ });
}

// Initialize translations with fallback (used until JSON loads)
function initTranslations() {
  if (Object.keys(translations).length === 0) {
    translations = JSON.parse(JSON.stringify(FALLBACK_TRANSLATIONS));
  }
}

// Get translation with parameter support
function getTranslation(key, params = {}) {
  initTranslations();
  const translation = translations[currentLanguage]?.[key] || translations.en?.[key] || FALLBACK_TRANSLATIONS[currentLanguage]?.[key] || FALLBACK_TRANSLATIONS.en?.[key] || key;

  // Replace parameters like {param}
  return translation.replace(/\{(\w+)\}/g, (match, param) => {
    return params[param] !== undefined ? params[param] : match;
  });
}

// Language display names for dropdown
const languageNames = { en: 'English', hi: 'हिंदी', mr: 'मराठी' };

// Set language — applies to entire site and voice
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang === 'hi' ? 'hi' : lang === 'mr' ? 'mr' : 'en';
  updateAllTexts();
  updateLanguageSelector();
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang } }));

  // Update voice recognition language (if voice script loaded)
  if (typeof recognition !== 'undefined' && recognition) {
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
  }
}

// Update all translatable elements
function updateAllTexts() {
  // Update text content
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    element.textContent = getTranslation(key);
  });

  // Update HTML content
  document.querySelectorAll('[data-translate-html]').forEach(element => {
    const key = element.getAttribute('data-translate-html');
    element.innerHTML = getTranslation(key);
  });

  // Update placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    element.placeholder = getTranslation(key);
  });
}

// Update language selector (pills or dropdown)
function updateLanguageSelector() {
  // Pill buttons (legacy & new premium buttons)
  document.querySelectorAll('[data-lang-btn], .lang-btn').forEach(btn => {
    const lang = btn.getAttribute('data-lang-btn') || btn.getAttribute('data-lang');
    if (lang === currentLanguage) {
      // Legacy classes
      btn.classList.add('active', 'bg-primary', 'text-white');
      btn.classList.remove('text-slate-600', 'dark:text-slate-400');
      // Premium classes
      btn.classList.add('active-lang');
    } else {
      // Legacy classes
      btn.classList.remove('active', 'bg-primary', 'text-white');
      btn.classList.add('text-slate-600', 'dark:text-slate-400');
      // Premium classes
      btn.classList.remove('active-lang');
    }
  });
  // Dropdown: current label and selected option
  const currentEl = document.getElementById('lang-current');
  if (currentEl) currentEl.textContent = languageNames[currentLanguage] || 'English';
  document.querySelectorAll('.lang-option[data-lang]').forEach(opt => {
    const lang = opt.getAttribute('data-lang');
    opt.setAttribute('aria-selected', lang === currentLanguage);
    if (lang === currentLanguage) {
      opt.classList.add('bg-primary/15', 'text-primary');
    } else {
      opt.classList.remove('bg-primary/15', 'text-primary');
    }
  });
  const langSelect = document.getElementById('lang-dropdown');
  if (langSelect && langSelect.tagName === 'SELECT') langSelect.value = currentLanguage;
}

// Theme toggle logic
function initTheme() {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  } else {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  }
}

// Language dropdown: open/close and option click
function initLanguageDropdown() {
  const trigger = document.getElementById('lang-trigger');
  const panel = document.getElementById('lang-panel');
  if (!trigger || !panel) return;
  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    const open = !panel.classList.contains('hidden');
    panel.classList.toggle('hidden', open);
    trigger.setAttribute('aria-expanded', !open);
  });
  document.querySelectorAll('.lang-option[data-lang]').forEach(opt => {
    opt.addEventListener('click', function (e) {
      e.stopPropagation();
      setLanguage(this.getAttribute('data-lang'));
      panel.classList.add('hidden');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', function () {
    panel.classList.add('hidden');
    trigger.setAttribute('aria-expanded', 'false');
  });
}

// Inject compact language dropdown on pages that don't have the full dropdown (e.g. farmer/official)
function injectLanguageSwitcher() {
  if (document.getElementById('lang-dropdown')) return;
  var nav = document.querySelector('header nav, header .flex, nav');
  if (!nav) return;
  var wrap = document.createElement('div');
  wrap.className = 'lang-dropdown relative';
  wrap.id = 'lang-dropdown';
  wrap.innerHTML = '<button type="button" id="lang-trigger" class="lang-trigger flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium" aria-haspopup="listbox" aria-expanded="false"><span class="material-icons text-base">language</span><span id="lang-current">' + (languageNames[currentLanguage] || 'English') + '</span><span class="material-icons text-slate-400 text-base">expand_more</span></button><div id="lang-panel" class="lang-panel absolute top-full right-0 mt-2 min-w-[160px] py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-50 hidden" role="listbox"><button type="button" class="lang-option w-full text-left px-4 py-2 flex items-center gap-2 rounded-lg mx-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors" data-lang="en" role="option">English</button><button type="button" class="lang-option w-full text-left px-4 py-2 flex items-center gap-2 rounded-lg mx-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors" data-lang="hi" role="option">हिंदी</button><button type="button" class="lang-option w-full text-left px-4 py-2 flex items-center gap-2 rounded-lg mx-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors" data-lang="mr" role="option">मराठी</button></div>';
  nav.appendChild(wrap);
  initLanguageDropdown();
  updateLanguageSelector();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  initTranslations();
  loadTranslationsFromJSON();
  initTheme();
  setLanguage(currentLanguage);
  initLanguageDropdown();
  setTimeout(injectLanguageSwitcher, 50);
  document.body.classList.add('kd-ready');
});

// Profile activity stats (for farmer profile page)
const STATS_KEY = 'kisan_drishti_stats';
function getStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  } catch (e) { return {}; }
}
function incrementStat(key) {
  const s = getStats();
  s[key] = (s[key] || 0) + 1;
  try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) { }
}

// Expose functions globally
window.setLanguage = setLanguage;
window.getTranslation = getTranslation;
window.updateAllTexts = updateAllTexts;
window.toggleTheme = toggleTheme;
window.cropData = cropData;
window.getPriceData = getPriceData;
window.savePriceData = savePriceData;
window.incrementStat = incrementStat;
window.getStats = getStats;
