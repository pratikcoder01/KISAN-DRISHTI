/**
 * KISAN-DRISHTI — Voice-First Interaction System
 * Complete voice command and text-to-speech functionality
 */

function getCropData() { return typeof getPriceData === 'function' ? getPriceData() : cropData; }

// Voice Recognition Setup
let recognition = null;
let isListening = false;
let speechSynthesis = window.speechSynthesis;

// Initialize voice recognition
function initVoiceRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'mr' ? 'mr-IN' : 'en-IN';
    
    recognition.onstart = function() {
      isListening = true;
      updateVoiceUI(true);
      showListeningFeedback();
    };
    
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript.toLowerCase();
      processVoiceCommand(transcript);
    };
    
    recognition.onerror = function(event) {
      console.error('Voice recognition error:', event.error);
      isListening = false;
      updateVoiceUI(false);
      hideListeningFeedback();
      
      if (event.error === 'no-speech') {
        speak(getTranslation('voice.no_speech') || "I didn't hear anything. Please try again.");
      }
    };
    
    recognition.onend = function() {
      isListening = false;
      updateVoiceUI(false);
      hideListeningFeedback();
    };
  }
}

// Voice Command Processing
function processVoiceCommand(transcript) {
  console.log('Voice command:', transcript);
  
  // Check for crop-specific price queries
  const data = getCropData();
  for (const [cropKey, cropInfo] of Object.entries(data)) {
    const cropNames = [
      cropInfo.name.en.toLowerCase(),
      cropInfo.name.hi.toLowerCase(),
      cropInfo.name.mr.toLowerCase()
    ];
    
    if (cropNames.some(name => transcript.includes(name))) {
      speakPriceInfo(cropKey, cropInfo.price, cropInfo.trend);
      return;
    }
  }
  
  // General price queries
  if (transcript.includes('price') || transcript.includes('bhav') || transcript.includes('daam') || transcript.includes('कीमत') || transcript.includes('किंमत')) {
    // Find highest price crop
    let highestPriceCrop = null;
    let highestPrice = 0;
    
    for (const [cropKey, cropInfo] of Object.entries(data)) {
      if (cropInfo.price > highestPrice) {
        highestPrice = cropInfo.price;
        highestPriceCrop = cropKey;
      }
    }
    
    if (highestPriceCrop) {
      const crop = data[highestPriceCrop];
      const cropName = crop.name[currentLanguage] || crop.name.en;
      speak(getTranslation('voice.best_price') || `Today, ${cropName} has the highest price at ₹${crop.price} per quintal with an ${crop.trendDirection === 'up' ? 'increasing' : 'decreasing'} trend.`);
    }
  }
  
  // Best price queries
  else if (transcript.includes('best') || transcript.includes('highest') || transcript.includes('sabse zyada') || transcript.includes('सर्वात') || transcript.includes('सबसे ज्यादा')) {
    // Find highest price crop
    let highestPriceCrop = null;
    let highestPrice = 0;
    
    for (const [cropKey, cropInfo] of Object.entries(data)) {
      if (cropInfo.price > highestPrice) {
        highestPrice = cropInfo.price;
        highestPriceCrop = cropKey;
      }
    }
    
    if (highestPriceCrop) {
      const crop = data[highestPriceCrop];
      const cropName = crop.name[currentLanguage] || crop.name.en;
      speak(getTranslation('voice.best_price') || `Today, ${cropName} has the highest price at ₹${crop.price} per quintal with an ${crop.trendDirection === 'up' ? 'increasing' : 'decreasing'} trend.`);
    }
  }
  
  // Selling advice
  else if (transcript.includes('sell') || transcript.includes('bechu') || transcript.includes('sell today') || transcript.includes('बेचूं') || transcript.includes('विकावे')) {
    // Get crops with 'sell_today' suggestion
    const sellTodayCrops = Object.entries(getCropData())
      .filter(([_, cropInfo]) => cropInfo.suggestion === 'sell_today')
      .map(([cropKey, cropInfo]) => ({
        key: cropKey,
        name: cropInfo.name[currentLanguage] || cropInfo.name.en,
        price: cropInfo.price,
        trend: cropInfo.trend
      }));
    
    // Get crops with 'wait' suggestion
    const waitCrops = Object.entries(cropData)
      .filter(([_, cropInfo]) => cropInfo.suggestion.includes('wait'))
      .map(([cropKey, cropInfo]) => ({
        key: cropKey,
        name: cropInfo.name[currentLanguage] || cropInfo.name.en,
        price: cropInfo.price,
        trend: cropInfo.trend
      }));
    
    let advice = getTranslation('voice.sell_advice') || "Based on current trends, ";
    
    if (sellTodayCrops.length > 0) {
      advice += `it's a good time to sell ${sellTodayCrops.map(c => c.name).join(', ')} as prices are increasing`;
    }
    
    if (waitCrops.length > 0) {
      if (sellTodayCrops.length > 0) advice += ". For ";
      else advice += "For ";
      advice += `${waitCrops.map(c => c.name).join(', ')}, you might want to wait 2-3 days as prices are currently down`;
    }
    
    speak(advice + ".");
  }
  
  // Market location
  else if (transcript.includes('market') || transcript.includes('mandi') || transcript.includes('where') || transcript.includes('बाजार') || transcript.includes('कुठे')) {
    speak(getTranslation('voice.market_info') || "The nearest market is Krishi Upaj Mandi, just 3.2 kilometers away from your location.");
  }
  
  // Weather
  else if (transcript.includes('weather') || transcript.includes('mausam') || transcript.includes('हवामान')) {
    speak(getTranslation('voice.weather') || "Today's weather is clear with 32 degrees temperature. Good conditions for harvesting.");
  }
  
  // Help
  else if (transcript.includes('help') || transcript.includes('madad') || transcript.includes('kya karu') || transcript.includes('मदत') || transcript.includes('काय करू')) {
    const cropNames = Object.values(getCropData()).map(crop => crop.name[currentLanguage] || crop.name.en).slice(0, 3).join(', ');
    speak(getTranslation('voice.help') || `You can ask me about crop prices, market locations, selling advice, or weather. Just say '${cropNames} price' or 'where should I sell today'.`);
  }
  
  else {
    speak(getTranslation('voice.not_understood') || "I didn't understand that. You can ask about crop prices, market locations, or selling advice.");
  }
}

// Text-to-Speech Functions
function speak(text, options = {}) {
  if (!speechSynthesis) return;
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'mr' ? 'mr-IN' : 'en-US';
  utterance.rate = options.rate || 0.9;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;
  
  speechSynthesis.speak(utterance);
}

function speakPriceInfo(cropKey, price, trend) {
  const info = typeof getCropData !== 'undefined' && getCropData()[cropKey]
    ? getCropData()[cropKey]
    : null;
  const cropName = info ? (info.name[currentLanguage] || info.name.en) : (cropKey.charAt(0).toUpperCase() + cropKey.slice(1));
  const trendText = trend.startsWith('+') ? 'increasing' : 'decreasing';
  const message = `${cropName} price is ₹${price} per quintal, with a ${trendText} trend of ${trend} rupees.`;
  speak(message);
}

// Voice UI Updates
function updateVoiceUI(listening) {
  const micButtons = document.querySelectorAll('.voice-mic-btn');
  micButtons.forEach(btn => {
    if (listening) {
      btn.classList.add('listening');
      btn.innerHTML = '<span class="material-icons text-3xl">mic</span>';
    } else {
      btn.classList.remove('listening');
      btn.innerHTML = '<span class="material-icons text-3xl">mic</span>';
    }
  });
}

// Visual Feedback
function showListeningFeedback() {
  const feedback = document.createElement('div');
  feedback.id = 'voice-feedback';
  feedback.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 flex items-center gap-3';
  feedback.innerHTML = `
    <div class="voice-wave">
      <div class="wave-bar"></div>
      <div class="wave-bar"></div>
      <div class="wave-bar"></div>
      <div class="wave-bar"></div>
    </div>
    <span class="text-slate-700 dark:text-slate-300 font-medium">${getTranslation('voice.listening') || 'Listening...'}</span>
  `;
  
  document.body.appendChild(feedback);
  
  // Add wave animation
  const style = document.createElement('style');
  style.textContent = `
    .voice-wave {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .wave-bar {
      width: 3px;
      height: 20px;
      background: #0d5c0d;
      border-radius: 2px;
      animation: wave 1s ease-in-out infinite;
    }
    .wave-bar:nth-child(2) { animation-delay: 0.1s; }
    .wave-bar:nth-child(3) { animation-delay: 0.2s; }
    .wave-bar:nth-child(4) { animation-delay: 0.3s; }
    @keyframes wave {
      0%, 100% { height: 10px; }
      50% { height: 25px; }
    }
  `;
  document.head.appendChild(style);
}

function hideListeningFeedback() {
  const feedback = document.getElementById('voice-feedback');
  if (feedback) {
    feedback.remove();
  }
}

// Voice Command Trigger
function toggleVoiceRecognition() {
  if (!recognition) {
    initVoiceRecognition();
  }
  
  if (isListening) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

// Add voice button to all pages
function addVoiceButtonToPage() {
  // Check if voice button already exists
  if (document.querySelector('.voice-mic-btn')) return;
  
  const voiceBtn = document.createElement('button');
  voiceBtn.className = 'voice-mic-btn fixed bottom-24 sm:bottom-20 right-4 w-16 h-16 sm:w-20 sm:h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 pulse-mic focus:outline-none focus:ring-4 focus:ring-primary/30 border-4 border-white dark:border-slate-800 z-[60]';
  voiceBtn.innerHTML = '<span class="material-icons text-3xl">mic</span>';
  voiceBtn.setAttribute('aria-label', 'Voice Assistant');
  voiceBtn.onclick = toggleVoiceRecognition;
  
  document.body.appendChild(voiceBtn);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    addVoiceButtonToPage();
    initVoiceRecognition();
  }, 500);
});

// Keyboard shortcut for voice (Ctrl/Cmd + V)
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
    e.preventDefault();
    toggleVoiceRecognition();
  }
});

// Speak all prices function
function speakAllPrices() {
  let message = getTranslation('voice.price_intro') || "Today's market prices are: ";
  
  Object.entries(getCropData()).forEach(([cropKey, cropInfo], index) => {
    const cropName = cropInfo.name[currentLanguage] || cropInfo.name.en;
    const trendText = cropInfo.trendDirection === 'up' ? 'increasing' : 'decreasing';
    message += `${cropName}: ₹${cropInfo.price} per quintal, ${trendText} by ${cropInfo.trend} rupees`;
    if (index < Object.keys(getCropData()).length - 1) message += ". ";
  });
  
  speak(message);
}

// Individual price speaking function (uses current language for crop name)
function speakPrice(cropKey, price, trend) {
  const info = typeof getCropData !== 'undefined' && getCropData()[cropKey] ? getCropData()[cropKey] : null;
  const cropName = info ? (info.name[currentLanguage] || info.name.en) : (cropKey.charAt(0).toUpperCase() + cropKey.slice(1));
  const trendText = trend.startsWith('+') ? 'increasing' : 'decreasing';
  const message = `${cropName} price is ₹${price} per quintal, with a ${trendText} trend of ${trend} rupees.`;
  speak(message);
}

// Expose functions globally
window.toggleVoiceRecognition = toggleVoiceRecognition;
window.speak = speak;
window.speakAllPrices = speakAllPrices;
window.speakPrice = speakPrice;
