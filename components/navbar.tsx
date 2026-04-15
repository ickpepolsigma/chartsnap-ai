'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="glass mx-4 mt-4 md:mx-8 md:mt-6 rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white hidden sm:block">
              ChartSnap AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/analyze">Analyze</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/admin">Admin</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <div className="flex items-center gap-2 text-white/60">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </motion.button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="btn-gradient text-sm px-5 py-2.5"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-2 space-y-2 border-t border-white/10 mt-4">
            <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/analyze" onClick={() => setIsMobileMenuOpen(false)}>
              Analyze
            </MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </MobileNavLink>
            <MobileNavLink href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
              Admin
            </MobileNavLink>
            {!isLoading && (
              <>
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <MobileNavLink href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </MobileNavLink>
                )}
              </>
            )}
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-white/60 hover:text-white font-medium transition-colors group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
    >
      {children}
    </Link>
  );
}
