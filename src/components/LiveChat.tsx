import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Send, Check } from 'lucide-react';

export const LiveChat: React.FC = () => {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'support' | 'client'; time: string }[]>([
    {
      text: "As-salamu Alaykum! Welcome to ARISAN BD. I'm Jesan, your custom jewel concierge. Searching for traditional Eid collections or bridal emeralds today?",
      sender: 'support',
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newMsg = {
      text: userText,
      sender: 'client' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');

    // Trigger simulation
    setIsTyping(true);
  };

  useEffect(() => {
    if (!isTyping) return;

    const timer = setTimeout(() => {
      const lastClientMsg = messages[messages.length - 1]?.text.toLowerCase() || '';
      let replyText = "That sounds lovely! Allow me to guide you to our Shop Tab to view real-time availability of physical emeralds. Do you have a specific metal budget?";

      if (lastClientMsg.includes('ring') || lastClientMsg.includes('emerald royale')) {
        replyText = "Emerald Royale Ring is our #1 Best Seller right now! It features thick 18K plating over hypoallergenic core, with real Colombian visual depth. You can add to cart and pick Cash on Delivery.";
      } else if (lastClientMsg.includes('bangle') || lastClientMsg.includes('aurum')) {
        replyText = "The Aurum Minimal Bangle is perfect for daily luxury wear. Available in M and L sizes in 22K gold plating.";
      } else if (lastClientMsg.includes('eid') || lastClientMsg.includes('discount')) {
        replyText = "Use coupon 'EID2026' during checkout to get an instant 15% discount on orders over 2,000 BDT! Plus, we offer free shipping above 3000 BDT.";
      } else if (lastClientMsg.includes('owner') || lastClientMsg.includes('founder')) {
        replyText = "Our founder is Md Tarikul Alam Jesan. He envisions a highly transparent online jewellery channel in Bangladesh. Check out 'About Owner' tab for his bio.";
      }

      setMessages((prev) => [
        ...prev,
        {
          text: replyText,
          sender: 'support',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isTyping, messages]);

  const whatsappLink = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20ARISAN%20BD%2C%20I%20am%20interested%20in%20your%20premium%20jewellery%20collection.`;

  return (
    <div className="fixed bottom-6 right-6 z-55 flex flex-col items-end">
      {/* Mini Chat Widget */}
      {isOpen && (
        <div className="bg-stone-950 border border-stone-800 rounded-lg shadow-2xl w-80 md:w-96 mb-4 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-emerald-950 p-4 flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                  alt="Md Tarikul Alam Jesan"
                  className="w-10 h-10 object-cover rounded-full border border-amber-400"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-stone-950"></span>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-stone-100">Md Tarikul Alam Jesan</h4>
                <p className="text-[10px] text-amber-400 font-sans tracking-wider uppercase font-medium">Founder & Curator</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick WhatsApp Redirect Section */}
          <div className="bg-stone-900/60 p-2.5 text-center border-b border-stone-900">
            <span className="text-[10px] text-stone-400">Prefer direct desktop link?</span>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1 text-[11px] bg-emerald-500 text-stone-950 font-bold px-2 py-0.5 rounded-full hover:opacity-90 cursor-pointer text-center"
            >
              WhatsApp Main Line
            </a>
          </div>

          {/* Messages display */}
          <div className="flex-1 p-4 h-64 overflow-y-auto space-y-3 flex flex-col bg-stone-950/80">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`max-w-[75%] rounded-lg p-3 text-xs leading-relaxed ${
                  m.sender === 'support'
                    ? 'bg-stone-900 border border-stone-850 text-stone-250 self-start'
                    : 'bg-emerald-850 text-stone-100 border border-emerald-800 self-end'
                }`}
              >
                <p className="text-left whitespace-pre-line">{m.text}</p>
                <span className="block text-[8px] text-stone-500 text-right mt-1.5 font-mono">{m.time}</span>
              </div>
            ))}
            {isTyping && (
              <div className="bg-stone-900 text-stone-400 self-start text-[11px] italic px-3 py-1.5 rounded-lg border border-stone-850 flex items-center gap-1">
                Jesan is typing
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-stone-900 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-stone-950 border border-stone-800 rounded px-3 py-2 text-xs text-stone-150 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="p-2 bg-amber-500 hover:bg-amber-600 rounded text-stone-950 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Main Trigger Button */}
      <div className="flex gap-2">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-emerald-500 hover:bg-emerald-600 text-stone-950 rounded-full shadow-2xl transition-all duration-300 hover:scale-115 flex items-center justify-center"
          title="Direct WhatsApp Support"
        >
          <svg className="w-6 h-6 fill-stone-950" viewBox="0 0 448 512">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </a>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-full shadow-2xl transition-all duration-300 hover:scale-115 flex items-center justify-center cursor-pointer"
          title="ARISAN BD Helper Desk"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
