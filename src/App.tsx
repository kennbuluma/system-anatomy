import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'landing' | 'chat'>('landing');
  const [preloadPrompt, setPreloadPrompt] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-[#00ff00] selection:text-black">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage 
              onStart={() => setView('chat')} 
              onSetPreloadPrompt={(prompt) => setPreloadPrompt(prompt)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ChatInterface 
              onBack={() => setView('landing')} 
              preloadPrompt={preloadPrompt}
              onClearPreloadPrompt={() => setPreloadPrompt('')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
