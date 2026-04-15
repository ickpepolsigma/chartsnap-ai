'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, FileText, Mail, RefreshCw, Trash2, LogOut } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { GradientButton } from '@/components/gradient-button';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

interface Analysis {
  id: string;
  userId: string;
  user: User;
  decision: string;
  reason: string;
  imagePath: string;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

type Tab = 'users' | 'analyses' | 'messages';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify');
      setIsAdmin(res.ok);
      if (!res.ok) {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (activeTab === 'users') {
        const res = await fetch('/api/admin/users', { headers });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } else if (activeTab === 'analyses') {
        const res = await fetch('/api/admin/analyses', { headers });
        if (res.ok) {
          const data = await res.json();
          setAnalyses(data.analyses || []);
        }
      } else if (activeTab === 'messages') {
        const res = await fetch('/api/admin/messages', { headers });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string, type: Tab) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      const endpoint = type === 'users' ? `/api/admin/users/${id}` :
        type === 'analyses' ? `/api/admin/analyses/${id}` :
          `/api/admin/messages/${id}`;

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (isChecking) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-white/20 border-t-emerald-500 rounded-full"
        />
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabs = [
    { id: 'users' as Tab, label: 'Users', icon: Users, count: users.length },
    { id: 'analyses' as Tab, label: 'Analyses', icon: FileText, count: analyses.length },
    { id: 'messages' as Tab, label: 'Messages', icon: Mail, count: messages.length },
  ];

  return (
    <div className="gradient-bg min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Admin Dashboard
              </h1>
              <p className="text-white/60 text-lg">
                View and manage ChartSnap AI data
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </motion.div>

        <GlassCard className="mb-6">
          <div className="flex gap-2 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white capitalize">{activeTab}</h2>
            <GradientButton onClick={fetchData} size="sm">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </GradientButton>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-2 border-white/20 border-t-emerald-500 rounded-full"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'users' && users.length === 0 && (
                <p className="text-white/40 text-center py-8">No users found</p>
              )}
              {activeTab === 'analyses' && analyses.length === 0 && (
                <p className="text-white/40 text-center py-8">No analyses found</p>
              )}
              {activeTab === 'messages' && messages.length === 0 && (
                <p className="text-white/40 text-center py-8">No messages found</p>
              )}

              {activeTab === 'users' && users.map((u) => (
                <div key={u.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-white font-medium">{u.email}</p>
                      {u.emailVerified ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                          Not Verified
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-sm mt-1">Created: {new Date(u.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => deleteItem(u.id, 'users')}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {activeTab === 'analyses' && analyses.map((a) => (
                <div key={a.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${a.decision === 'Buy' ? 'bg-emerald-500/20 text-emerald-400' :
                        a.decision === 'Sell' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                        {a.decision}
                      </span>
                      <p className="text-white/40 text-sm mt-1">{a.user?.email}</p>
                    </div>
                    <button
                      onClick={() => deleteItem(a.id, 'analyses')}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white/80 text-sm">{a.reason}</p>
                  <p className="text-white/40 text-xs mt-2">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
              ))}

              {activeTab === 'messages' && messages.map((m) => (
                <div key={m.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{m.name}</p>
                      <p className="text-white/40 text-sm">{m.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-white/40 text-xs">{new Date(m.createdAt).toLocaleString()}</p>
                      <button
                        onClick={() => deleteItem(m.id, 'messages')}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
