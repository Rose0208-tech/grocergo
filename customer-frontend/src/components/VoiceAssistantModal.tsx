import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  ShoppingBag,
  Layers,
  Clock,
  HelpCircle,
  Globe,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { voiceAssistantService } from '../services/voiceAssistant.js';
import { useCart } from '../contexts/CartContext.js';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OptionCategory = 'quick-add' | 'departments' | 'cart-orders' | 'info' | 'languages';

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMsg, setResponseMsg] = useState(
    'Hello! Tap the microphone to speak, or tap any option below to order.'
  );
  const [manualInput, setManualInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OptionCategory>('quick-add');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isSpeechSupported = voiceAssistantService.checkSupport();

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setResponseMsg('Tap the microphone to speak, or tap any option below.');
    } else {
      voiceAssistantService.stopListening();
      voiceAssistantService.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartListening = async () => {
    if (!isSpeechSupported) return;
    setIsListening(true);
    setTranscript('Listening... Speak now');

    try {
      const recognized = await voiceAssistantService.listen(i18n.language, (interim) => {
        setTranscript(`"${interim}"`);
      });

      setTranscript(`"${recognized}"`);
      setIsListening(false);

      // Process command
      const result = await voiceAssistantService.processCommand(
        recognized,
        i18n.language,
        (path) => {
          navigate(path);
          onClose();
        },
        refreshCart
      );

      setResponseMsg(result.message);
      setIsSpeaking(true);
      const targetLang = result.payload?.lang || i18n.language;
      voiceAssistantService.speak(result.message, targetLang).then(() => {
        setIsSpeaking(false);
      });
    } catch (err: any) {
      setIsListening(false);
      const errMsg = err.message || 'Could not recognize speech. Please speak clearly or tap an option below.';
      setTranscript('');
      setResponseMsg(errMsg);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const command = manualInput.trim();
    setTranscript(`"${command}"`);
    setManualInput('');

    const result = await voiceAssistantService.processCommand(
      command,
      i18n.language,
      (path) => {
        navigate(path);
        onClose();
      },
      refreshCart
    );

    setResponseMsg(result.message);
    setIsSpeaking(true);
    const targetLang = result.payload?.lang || i18n.language;
    voiceAssistantService.speak(result.message, targetLang).then(() => {
      setIsSpeaking(false);
    });
  };

  const handleQuickCommand = async (cmd: string) => {
    setTranscript(`"${cmd}"`);
    const result = await voiceAssistantService.processCommand(
      cmd,
      i18n.language,
      (path) => {
        navigate(path);
        onClose();
      },
      refreshCart
    );
    setResponseMsg(result.message);
    setIsSpeaking(true);
    const targetLang = result.payload?.lang || i18n.language;
    voiceAssistantService.speak(result.message, targetLang).then(() => {
      setIsSpeaking(false);
    });
  };

  const stopAudio = () => {
    voiceAssistantService.stopSpeaking();
    setIsSpeaking(false);
  };

  // Grouped options for iPad touch kiosk
  const optionGroups: Record<OptionCategory, { label: string; icon: any; items: string[] }> = {
    'quick-add': {
      label: 'Instant Add to Basket',
      icon: PlusCircle,
      items: [
        'Change language to Tamil',
        'Add 1kg Potatoes',
        'Add 1kg Tomatoes',
        'Add Toned Fresh Milk',
        'Add Sona Masoori Rice 5kg',
        'Add Sunflower Oil 1L',
        'Add Ponni Rice 5kg',
        'Add Toor Dal 1kg',
        'Add Royal Basmati Rice 1kg'
      ]
    },
    departments: {
      label: 'Browse Departments',
      icon: Layers,
      items: [
        'Show Vegetables',
        'Show Fruits',
        'Show Rice & Dals',
        'Show Milk & Dairy',
        'Show Cooking Oil & Ghee',
        'Show Meat & Seafood',
        'Show Daily Essentials'
      ]
    },
    'cart-orders': {
      label: 'Basket & Orders',
      icon: ShoppingBag,
      items: [
        'Open my cart',
        'Proceed to checkout',
        'What is my latest order status?',
        'Clear cart',
        'Show popular best sellers'
      ]
    },
    info: {
      label: 'Store Info & UPI',
      icon: HelpCircle,
      items: [
        'Free delivery info',
        'How to pay with UPI QR?',
        'Help and customer support',
        'Today deals and offers'
      ]
    },
    languages: {
      label: 'Change Language',
      icon: Globe,
      items: [
        'Change language to Tamil',
        'Change language to Hindi',
        'Change language to Telugu',
        'Change language to Kannada',
        'Change language to Malayalam',
        'Change language to English'
      ]
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#218838] text-white p-5 flex justify-between items-center border-b border-emerald-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg tracking-tight">GrocerGo Voice Kiosk Assistant</h3>
              <p className="text-[11px] text-emerald-100 font-semibold">
                Tap & speak in English, தமிழ், हिन्दी, తెలుగు, ಕನ್ನಡ, മലയാളം
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {isSpeaking && (
              <button
                onClick={stopAudio}
                title="Stop Audio"
                className="p-2 text-amber-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-2xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Animated Microphone Action */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative">
              {isListening && (
                <>
                  <div className="absolute -inset-4 rounded-full bg-emerald-400 opacity-40 animate-ping" />
                  <div className="absolute -inset-8 rounded-full bg-green-300 opacity-20 animate-pulse" />
                </>
              )}
              <button
                onClick={handleStartListening}
                disabled={isListening}
                className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all transform active:scale-95 border-4 border-white ${
                  isListening
                    ? 'bg-rose-500 ring-8 ring-rose-100 scale-105'
                    : 'bg-gradient-to-br from-[#218838] to-[#14532D] hover:scale-105 ring-8 ring-emerald-100 shadow-green-900/30'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-8 h-8 animate-pulse text-white" />
                    <span className="text-[10px] font-black mt-1 uppercase tracking-wider">Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 text-amber-300 animate-pulse" />
                    <span className="text-[10px] font-black mt-1 uppercase tracking-wider">Tap & Speak</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] font-extrabold text-gray-500">
              {isListening ? 'Speak now (e.g. "Change language to Tamil")...' : 'Say: "Change language to Tamil", "Add potatoes", "Show fruits"'}
            </p>
          </div>

          {/* Real-Time Transcript Display */}
          {transcript && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 max-w-md mx-auto text-center shadow-inner">
              <span className="text-xs font-black text-emerald-900 italic">
                {transcript}
              </span>
            </div>
          )}

          {/* Assistant Response Box */}
          <div className="bg-gradient-to-r from-emerald-50/80 via-white to-amber-50/50 border border-emerald-200/90 rounded-2xl p-4 flex items-start space-x-3 text-left shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-[#14532D] uppercase tracking-wider mb-0.5">GrocerGo Response:</p>
              <p className="text-xs sm:text-sm text-gray-800 font-bold leading-relaxed">
                {responseMsg}
              </p>
            </div>
          </div>

          {/* Featured Quick Voice Commands Bar */}
          <div className="bg-gradient-to-r from-emerald-50 via-amber-50/40 to-green-50 border border-emerald-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
            <span className="text-[11px] font-black uppercase text-[#14532D] flex items-center gap-1.5 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Commands:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleQuickCommand('Change language to Tamil')}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center space-x-1.5 active:scale-95 transition-all group"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>"Change language to Tamil"</span>
                <span className="text-[10px] bg-white/20 px-1 py-0.5 rounded font-bold">தமிழ்</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickCommand('Add 1kg Potatoes')}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-gray-800 rounded-xl text-xs font-extrabold border border-emerald-200 shadow-sm active:scale-95 transition-all"
              >
                <span>"Add 1kg Potatoes"</span>
              </button>
            </div>
          </div>

          {/* Quick Option Category Tabs */}
          <div>
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1.5 border-b border-gray-100">
              {(Object.keys(optionGroups) as OptionCategory[]).map((catKey) => {
                const group = optionGroups[catKey];
                const Icon = group.icon;
                const isActive = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-3 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 flex-shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#14532D] text-white shadow-md'
                        : 'bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Option Chips */}
            <div className="pt-3">
              <div className="flex flex-wrap gap-2">
                {optionGroups[selectedCategory].items.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickCommand(cmd)}
                    className="px-3 py-2 bg-white hover:bg-emerald-50 text-gray-800 hover:text-[#14532D] rounded-2xl text-xs font-extrabold transition-all border border-emerald-200/80 shadow-sm hover:shadow hover:border-emerald-400 active:scale-95 flex items-center space-x-1.5 group"
                  >
                    <span>"{cmd}"</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fallback Manual Text Input */}
          <form
            onSubmit={handleManualSubmit}
            className="flex items-center space-x-2 pt-3 border-t border-gray-100"
          >
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder='Or type here: e.g. "Change language to Tamil", "Add 2kg tomatoes"...'
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#218838] focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#218838] hover:bg-[#14532D] text-white rounded-2xl font-black text-xs transition-all shadow-md active:scale-95 flex items-center space-x-1"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
