import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

export function renderFormattedAIText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="text-[#e8e6e0] font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={partIdx}>{part}</span>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

interface FloatingAIAssistantProps {
  onOpenCommandCenter?: () => void;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  onOpenCommandCenter,
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-landing',
      role: 'ai',
      text: "Namaste! 🙏 I'm **UNISELL AI**. Ask me how our 5 AI Agents automate Amazon, Flipkart, Meesho & ONDC, or test a live store query!",
      time: 'Just now',
    },
  ]);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, chatBusy, chatOpen]);

  const getTimeStr = () =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride !== undefined ? textOverride : chatInput).trim();
    if (!text) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    if (textOverride === undefined) {
      setChatInput('');
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      time: getTimeStr(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setChatBusy(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-landing')
        .slice(-6)
        .map((m) => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyPayload }),
        signal: controller.signal,
      });

      const data = await res.json();
      const reply =
        data.reply ||
        'I have analyzed your multi-channel store metrics across Amazon, Flipkart, Meesho & ONDC.';

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          text: reply,
          time: getTimeStr(),
        },
      ]);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'ai',
          text: 'Unable to reach UNISELL AI right now. Please try again.',
          time: getTimeStr(),
        },
      ]);
    } finally {
      if (abortRef.current === controller) {
        setChatBusy(false);
        setTimeout(() => chatInputRef.current?.focus(), 60);
      }
    }
  };

  return (
    <>
      {chatOpen && (
        <div
          data-testid="landing-ai-chat-panel"
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[390px] bg-[#0f1420] border border-[#c9a84c]/40 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col z-[1000] overflow-hidden unisell-fade-up"
        >
          <div
            className="px-4 py-3.5 border-b border-white/10 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.14), transparent)',
            }}
          >
            <div className="w-9 h-9 rounded-full bg-[#c9a84c]/15 border-2 border-[#c9a84c]/40 flex items-center justify-center text-base shrink-0 unisell-pulse">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#c9a84c]">UNISELL AI Assistant</div>
              <div className="text-[0.68rem] text-[#3ecf8e] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" />
                <span>Gemini AI · Live Store Advisor</span>
              </div>
            </div>
            {onOpenCommandCenter && (
              <button
                type="button"
                onClick={onOpenCommandCenter}
                className="text-[11px] font-mono-code text-[#c9a84c] hover:underline bg-transparent border-none cursor-pointer"
              >
                Dashboard ↗
              </button>
            )}
            <button
              type="button"
              aria-label="Close AI Assistant"
              onClick={() => setChatOpen(false)}
              className="bg-transparent border-none text-[#8a8c96] hover:text-[#e8e6e0] cursor-pointer text-base p-1"
            >
              ✕
            </button>
          </div>

          <div ref={chatScrollRef} className="h-[310px] overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 items-end ${
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    m.role === 'ai'
                      ? 'bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c]'
                      : 'bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] text-[#090d18]'
                  }`}
                >
                  {m.role === 'ai' ? 'U' : 'Y'}
                </div>
                <div className="max-w-[83%]">
                  <div
                    className={`px-3.5 py-2.5 text-xs leading-relaxed break-words ${
                      m.role === 'ai'
                        ? 'bg-[#161d2e] text-[#a8aab8] rounded-tl-xs rounded-tr-xl rounded-br-xl rounded-bl-xl'
                        : 'bg-[#c9a84c]/20 border border-[#c9a84c]/35 text-[#e8e6e0] rounded-tl-xl rounded-tr-xs rounded-br-xl rounded-bl-xl'
                    }`}
                  >
                    {renderFormattedAIText(m.text)}
                  </div>
                  <div
                    className={`text-[0.6rem] text-[#8a8c96] mt-1 ${
                      m.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {chatBusy && (
              <div className="flex gap-2.5 items-end">
                <div className="w-6 h-6 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] flex items-center justify-center text-xs font-bold">
                  U
                </div>
                <div className="bg-[#161d2e] px-3.5 py-2.5 rounded-tl-xs rounded-tr-xl rounded-br-xl rounded-bl-xl flex gap-1.5 items-center">
                  <span className="unisell-typing-dot" />
                  <span className="unisell-typing-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="unisell-typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Buttons */}
          <div className="px-4 pb-2.5 flex flex-wrap gap-1.5">
            {[
              {
                label: '📊 Best platform?',
                prompt: 'What is my best performing platform this month?',
              },
              {
                label: '📦 Restock alerts',
                prompt: 'Which products should I restock urgently?',
              },
              {
                label: '⚡ Auto-list kurti',
                prompt: 'Help me list a Rajasthani mirror work kurti priced at ₹1,599 across all platforms',
              },
              {
                label: '📈 Boost Meesho',
                prompt: 'How can I improve my Meesho sales this month?',
              },
            ].map((qb) => (
              <button
                key={qb.label}
                type="button"
                onClick={() => sendMessage(qb.prompt)}
                className="bg-[#161d2e] border border-white/10 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] rounded-full px-2.5 py-1 text-[0.7rem] text-[#a8aab8] cursor-pointer transition-colors whitespace-nowrap"
              >
                {qb.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 border-t border-white/10 flex gap-2 items-center"
          >
            <input
              ref={chatInputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask UNISELL AI anything..."
              aria-label="Ask UNISELL AI Assistant"
              className="flex-1 bg-[#161d2e] border border-white/10 focus:border-[#c9a84c]/50 rounded-lg px-3.5 py-2 text-xs text-[#e8e6e0] outline-none"
            />
            <button
              type="submit"
              disabled={chatBusy}
              aria-label="Send AI message"
              className="w-9 h-9 rounded-lg bg-[#c9a84c] hover:bg-[#e8c97a] disabled:opacity-50 text-[#090d18] border-none cursor-pointer flex items-center justify-center text-sm font-bold shrink-0"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {!chatOpen && (
        <button
          type="button"
          aria-label="Ask UNISELL AI"
          onClick={() => setChatOpen(true)}
          className="fixed bottom-5 right-5 z-[999] inline-flex items-center gap-2 rounded-full bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] px-4 py-3 font-bold text-xs shadow-[0_4px_25px_rgba(201,168,76,0.45)] transition-transform hover:scale-105 cursor-pointer border-none"
        >
          <span className="text-base">🤖</span>
          <span>Ask UNISELL AI</span>
        </button>
      )}
    </>
  );
};
