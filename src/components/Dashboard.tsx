import React, { useState } from 'react';
import { Audit, PaymentInfo, User } from '../types';
import { CheckCircle, User as UserIcon } from 'lucide-react';

interface DashboardProps {
  user?: User | null;
  audits: Audit[];
  paymentInfo?: PaymentInfo | null;
  onRequestDeepAudit?: () => void;
  onSignOut: () => void;
  onLogin?: (user: User) => void;
}

export default function Dashboard({ user, audits, paymentInfo, onRequestDeepAudit, onSignOut, onLogin }: DashboardProps) {
  const [showAuth, setShowAuth] = useState(!user);

  const loginWithProvider = (provider: string) => {
    const providerName = provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'Microsoft';
    onLogin?.({ name: `${providerName} User`, email: `user@${provider}.example.com` });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">System Anatomy</p>
            <h1 className="text-3xl font-bold tracking-tight">Audit Dashboard</h1>
            <p className="mt-2 text-sm text-[#3f3f3f] max-w-2xl">Monitor active assessments, payment status, and suggested refactors for your systems.</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {user ? (
              <div className="flex items-center gap-3 border border-[#d5d5d5] p-4">
                <UserIcon className="w-5 h-5" />
                <div>
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-[11px] uppercase opacity-60">{user.email}</p>
                </div>
              </div>
            ) : null}
            <div className="border border-[#d5d5d5] px-4 py-3 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">My Account</span>
            </div>
          </div>
        </div>

        {showAuth ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
            <div className="border border-[#d5d5d5] p-6">
              <h2 className="text-xl font-bold mb-4">Login / Signup</h2>
              <p className="text-sm text-[#4d4d4d] mb-6">Use an authentication provider to sign in and track your audit progress.</p>
              <div className="space-y-4">
                <button
                  onClick={() => loginWithProvider('google')}
                  className="w-full px-6 py-3 bg-black text-white uppercase text-[10px] tracking-[0.35em] font-bold"
                >
                  Continue with Google
                </button>
                <button
                  onClick={() => loginWithProvider('github')}
                  className="w-full px-6 py-3 border border-[#d5d5d5] uppercase text-[10px] tracking-[0.35em] font-bold"
                >
                  Continue with GitHub
                </button>
                <button
                  onClick={() => loginWithProvider('microsoft')}
                  className="w-full px-6 py-3 border border-[#d5d5d5] uppercase text-[10px] tracking-[0.35em] font-bold"
                >
                  Continue with Microsoft
                </button>
              </div>
            </div>
            <div className="border border-[#d5d5d5] p-6 bg-[#f7f7f7]">
              <h2 className="text-xl font-bold mb-4">Why sign up?</h2>
              <ul className="space-y-3 text-sm text-[#333333]">
                <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-black" /> Track free and paid audits from one place.</li>
                <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-black" /> Access professional deep audit purchase flow.</li>
                <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-black" /> Activate deep audit purchase when needed.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
              <div className="border border-[#d5d5d5] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Current Plan</p>
                    <h2 className="text-2xl font-bold">Audit Workflow</h2>
                  </div>
                  <span className="px-3 py-1 border border-[#d5d5d5] uppercase text-[10px] tracking-[0.35em]">Audit Management</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 border border-[#e5e5e5]">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Free Audit</p>
                    <p className="mt-2 text-sm font-bold">Fixed cost: $0</p>
                    <p className="text-sm text-[#4d4d4d] mt-2">AI-generated initial problem discovery and architecture insights.</p>
                  </div>
                  <div className="p-4 border border-[#e5e5e5]">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Deep Audit</p>
                    <p className="mt-2 text-sm font-bold">Fixed cost: $720</p>
                    <p className="text-sm text-[#4d4d4d] mt-2">Professional deep analysis with actionable refactor and rebuild planning.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-none border border-[#d5d5d5] px-4 py-4">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Latest Outcome</div>
                    <p className="mt-3 text-sm text-[#2d2d2d]">{audits[0]?.outcomeSummary}</p>
                  </div>
                  <div className="rounded-none border border-[#d5d5d5] px-4 py-4">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Suggested Remediation</div>
                    <ul className="mt-3 list-disc list-inside text-sm text-[#2d2d2d] space-y-2">
                      {audits[0]?.recommendedRemedies.map((remedy) => (
                        <li key={remedy}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-[#d5d5d5] p-6 space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Billing</p>
                  <div className="mt-3 text-sm text-[#2d2d2d]">{paymentInfo ? `${paymentInfo.cardBrand} •••• ${paymentInfo.last4}` : 'No payment method saved.'}</div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Status</p>
                  <div className="mt-3 text-sm font-bold text-[#1a1a1a]">{audits[0]?.status}</div>
                </div>

                <button
                  onClick={onRequestDeepAudit}
                  className="w-full px-6 py-3 bg-black text-white uppercase text-[10px] font-bold tracking-[0.35em]"
                >
                  Request Deep Audit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
              <div className="border border-[#d5d5d5] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Audit History</p>
                    <h2 className="text-xl font-bold">Your System Assessments</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  {audits.map((audit) => (
                    <div key={audit.id} className="border border-[#e5e5e5] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold">{audit.title}</p>
                          <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d] mt-1">{audit.type === 'free' ? 'Free Audit' : 'Deep Audit'}</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">{audit.status}</span>
                      </div>
                      <p className="mt-3 text-sm text-[#3b3b3b]">{audit.outcomeSummary}</p>
                      <div className="mt-3 text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Remedies</div>
                      <ul className="mt-2 list-disc list-inside text-sm text-[#2d2d2d] space-y-1">
                        {audit.recommendedRemedies.map((item) => (<li key={item}>{item}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#d5d5d5] p-6 bg-[#f7f7f7]">
                <h2 className="text-xl font-bold mb-4">Audit Workflow</h2>
                <div className="space-y-4">
                  <div className="border border-[#e5e5e5] p-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Stage 1</p>
                    <p className="mt-2 text-sm">Free audit by AI to surface initial problems and pain points.</p>
                  </div>
                  <div className="border border-[#e5e5e5] p-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Stage 2</p>
                    <p className="mt-2 text-sm">If the system needs improvement, you can purchase a deep analysis at fixed cost.</p>
                  </div>
                  <div className="border border-[#e5e5e5] p-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#4d4d4d]">Stage 3</p>
                    <p className="mt-2 text-sm">Review recommended rebuilds, refactors, and remediation actions after professional analysis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
