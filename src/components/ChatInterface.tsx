import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Plus, Settings, User, Activity, Terminal, ArrowLeft, Trash2, Cpu, BarChart3 } from 'lucide-react';
import { Message, ChatSession } from '../types';
import { generateChatResponseStream } from '../services/geminiService';

interface ChatInterfaceProps {
  onBack: () => void;
  preloadPrompt?: string;
  onClearPreloadPrompt?: () => void;
}

export default function ChatInterface({ onBack, preloadPrompt, onClearPreloadPrompt }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isTyping]);

  // Handle preload estimation diagnostics from LandingPage
  useEffect(() => {
    if (preloadPrompt && preloadPrompt.trim()) {
      // Create a new triage session
      const newSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: newSessionId,
        title: 'Triage Audit Specimen',
        messages: [],
        createdAt: Date.now(),
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSessionId);
      setInput(preloadPrompt);
      
      // Clean up preload trigger
      if (onClearPreloadPrompt) {
        onClearPreloadPrompt();
      }
    }
  }, [preloadPrompt, onClearPreloadPrompt]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New System Audit',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleSend = async () => {
    if (!input.trim() || !currentSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMessage],
          title: s.messages.length === 0 ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : s.title
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    setInput('');
    setIsTyping(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: [...s.messages, assistantMessage] };
      }
      return s;
    }));

    try {
      const currentMessages = updatedSessions.find(s => s.id === currentSessionId)?.messages || [];
      const stream = generateChatResponseStream(currentMessages);
      
      let fullContent = '';
      for await (const chunk of stream) {
        fullContent += chunk;
        setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => 
                m.id === assistantMessageId ? { ...m, content: fullContent } : m
              )
            };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#e0e0e0] overflow-hidden font-mono">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-72 border-r border-[#ffffff10] flex flex-col bg-[#0a0a0a] z-20"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tighter">
            <Activity className="w-5 h-5 text-[#00ff00]" />
            <span className="uppercase">Anatomy</span>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-[#ffffff05] rounded-full transition-colors">
            <ArrowLeft className="w-4 h-4 opacity-40" />
          </button>
        </div>

        <button 
          onClick={createNewSession}
          className="mx-4 mb-6 flex items-center justify-center gap-2 p-3 border border-[#00ff0030] rounded-none hover:bg-[#00ff0005] transition-all group"
        >
          <Plus className="w-4 h-4 text-[#00ff00]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">New Audit</span>
        </button>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`group flex items-center justify-between p-3 border ${
                currentSessionId === session.id ? 'bg-[#00ff0005] border-[#00ff0050]' : 'border-transparent hover:border-[#ffffff10]'
              } cursor-pointer transition-all`}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase truncate">{session.title}</span>
                <span className="text-[9px] opacity-30 uppercase tracking-wider">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={(e) => deleteSession(session.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-[#ffffff10] flex items-center gap-3">
          <div className="w-8 h-8 border border-[#ffffff20] flex items-center justify-center">
            <User className="w-4 h-4 opacity-50" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase">Engineer</p>
            <p className="text-[9px] opacity-30 uppercase">Consultant</p>
          </div>
          <Settings className="w-4 h-4 opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Technical Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {!currentSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md"
            >
              <div className="w-16 h-16 border border-[#00ff0030] flex items-center justify-center mx-auto mb-6">
                <Terminal className="w-8 h-8 text-[#00ff00]" />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tighter mb-4">System Anatomy Audit</h2>
              <p className="text-[#e0e0e060] text-xs leading-relaxed mb-8 uppercase tracking-wider">
                Describe your system architecture, bottlenecks, or failures for a preliminary technical assessment.
              </p>
              <button 
                onClick={createNewSession}
                className="px-8 py-3 bg-[#00ff00] text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#00cc00] transition-all"
              >
                Initialize Protocol
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-[#ffffff10] flex items-center px-8 justify-between z-10 bg-[#0a0a0a90] backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#00ff00] animate-pulse" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">{currentSession.title}</h3>
              </div>
              <div className="flex items-center gap-6 opacity-30 text-[9px] uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3" />
                  <span>Analysis Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3" />
                  <span>Telemetry Sync</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12 z-10 custom-scrollbar">
              <AnimatePresence initial={false}>
                {currentSession.messages.map((message, index) => (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, x: message.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] flex gap-6 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' ? 'border-[#ffffff20]' : 'border-[#00ff0030] text-[#00ff00]'
                      }`}>
                        {message.role === 'user' ? <User className="w-4 h-4 opacity-50" /> : <Activity className="w-4 h-4" />}
                      </div>
                      <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-5 border ${
                          message.role === 'user' 
                            ? 'bg-[#ffffff03] border-[#ffffff10] text-[#e0e0e0]' 
                            : 'bg-transparent border-transparent text-[#e0e0e0] text-sm leading-relaxed'
                        }`}>
                          <div className="whitespace-pre-wrap">
                            {message.content || (isTyping && index === currentSession.messages.length - 1 ? (
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-[#00ff00] animate-pulse" />
                                <div className="w-1 h-1 bg-[#00ff00] animate-pulse [animation-delay:0.2s]" />
                                <div className="w-1 h-1 bg-[#00ff00] animate-pulse [animation-delay:0.4s]" />
                              </div>
                            ) : message.content)}
                          </div>
                        </div>
                        <span className="text-[9px] opacity-20 mt-3 uppercase tracking-widest">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 z-10">
              <div className="max-w-4xl mx-auto relative">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="INPUT SYSTEM DATA OR QUERY..."
                  className="w-full bg-[#ffffff03] border border-[#ffffff10] rounded-none p-5 pr-16 focus:outline-none focus:border-[#00ff0050] transition-all resize-none min-h-[60px] max-h-[200px] custom-scrollbar text-xs uppercase tracking-wider"
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className={`absolute right-4 bottom-4 p-2 transition-all ${
                    input.trim() && !isTyping 
                      ? 'text-[#00ff00] opacity-100' 
                      : 'text-white opacity-10 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-center gap-8 mt-6 opacity-20 text-[8px] font-bold uppercase tracking-[0.4em]">
                <span>Analysis Engine: Gemini 3 Flash</span>
                <span>Audit Protocol: V2.4.0</span>
                <span>Status: Operational</span>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffffff10;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00ff0030;
        }
      `}</style>
    </div>
  );
}
