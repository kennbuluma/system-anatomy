import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import { AnimatePresence, motion } from 'motion/react';
import { Audit, User, PaymentInfo } from './types';

const initialAudits: Audit[] = [
  {
    id: 'audit-free-001',
    type: 'free',
    title: 'Initial System Health Audit',
    status: 'Completed',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    fixedCost: 0,
    outcomeSummary: 'Identified database lock contention, cache inefficiencies, and API throughput saturation.',
    recommendedRemedies: ['Run targeted query optimization', 'Add memcached/Redis layer', 'Review connection pool sizing']
  },
  {
    id: 'audit-deep-002',
    type: 'deep',
    title: 'Deep Architectural Analysis',
    status: 'Scheduled',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    fixedCost: 720,
    outcomeSummary: 'Awaiting full professional review to validate system redesign recommendations.',
    recommendedRemedies: ['Design service boundary refactor', 'Implement event-driven ingestion', 'Formalize recovery procedures']
  }
];

const initialUser: User = {
  name: 'Kenn Buluma',
  email: 'kenn@example.com'
};

const initialPaymentInfo: PaymentInfo = {
  billingName: 'Kenn Buluma',
  cardBrand: 'Visa',
  last4: '4242',
  expiry: '08/27'
};

export default function App() {
  const [view, setView] = useState<'landing' | 'chat' | 'dashboard' | 'auth'>('landing');
  const [preloadPrompt, setPreloadPrompt] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [audits, setAudits] = useState<Audit[]>(initialAudits);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleRequestDeepAudit = () => {
    const newAudit: Audit = {
      id: `audit-deep-${Date.now()}`,
      type: 'deep',
      title: 'Deep Professional Analysis',
      status: 'Requires Payment',
      createdAt: Date.now(),
      fixedCost: 720,
      outcomeSummary: 'Deep audit requested; payment required to activate a professional analysis engagement.',
      recommendedRemedies: []
    };
    setAudits(prev => [newAudit, ...prev]);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
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
              onGoToAuth={() => setView('auth')}
            />
          </motion.div>
        )}

        {view === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <ChatInterface 
              onBack={() => setView('landing')} 
              preloadPrompt={preloadPrompt}
              onClearPreloadPrompt={() => setPreloadPrompt('')}
            />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard
              user={user!}
              audits={audits}
              paymentInfo={paymentInfo}
              onRequestDeepAudit={handleRequestDeepAudit}
              onSignOut={() => {
                setUser(null);
                setPaymentInfo(null);
                setView('landing');
              }}
            />
          </motion.div>
        )}

        {view === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard
              user={user}
              audits={audits}
              paymentInfo={paymentInfo}
              onSignOut={() => setView('landing')}
              onLogin={handleLogin}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
