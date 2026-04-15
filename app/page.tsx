'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Zap, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { GradientButton } from '@/components/gradient-button';
import { GlassCard } from '@/components/glass-card';
import CandlestickScene from '@/components/3d-candlestick';
import DecisionBadge3D from '@/components/3d-badge';
import FloatingIcon3D from '@/components/3d-icon';

const features = [
  {
    icon: Upload,
    shape: 'candlestick' as const,
    color: '#10b981',
    title: 'Upload Any Screenshot',
    description: 'Drag and drop your candlestick chart screenshots. Supports PNG and JPEG formats up to 5MB.',
  },
  {
    icon: Sparkles,
    shape: 'arrow' as const,
    color: '#8b5cf6',
    title: 'AI Analysis',
    description: 'Powered by open source AI via Hugging Face. Analyzes patterns, trends, and key levels in seconds.',
  },
  {
    icon: Zap,
    shape: 'chart' as const,
    color: '#f59e0b',
    title: 'Instant Results',
    description: 'Get clear Buy, Sell, or Nothing recommendations with detailed explanations in under 5 seconds.',
  },
];

const examples = [
  {
    decision: 'Buy' as const,
    label: 'BULLISH BREAKOUT',
    reason: 'The chart shows a clear ascending triangle pattern with higher lows consolidating near resistance at $45,200. Volume has been increasing on up-moves, suggesting accumulation. The 20 EMA is providing dynamic support, and price recently broke above the 50 SMA. Candlestick patterns include a strong bullish engulfing followed by three white soldiers, indicating strong buying pressure. Key resistance turned support at $44,800 should hold for continued upside.',
  },
  {
    decision: 'Sell' as const,
    label: 'BEARISH REVERSAL',
    reason: 'A double top formation is clearly visible with rejection at the $52,800 level. RSI divergence shows weakening momentum despite price making marginal new highs. The shooting star candlestick on the 4-hour timeframe confirms rejection of higher prices. Volume profile shows distribution occurring at these levels. Support at $50,200 has been breached, and the 200 SMA is now acting as dynamic resistance overhead.',
  },
  {
    decision: 'Nothing' as const,
    label: 'CONSOLIDATION',
    reason: 'Price is currently trading in a tight range between $38,500 and $41,200, indicating indecision in the market. The Bollinger Bands are squeezing, suggesting a volatility expansion is coming but direction is unclear. Volume is declining, typical of consolidation phases. No clear breakout or breakdown patterns have formed yet. Best to wait for a decisive move outside this range with volume confirmation before taking a position.',
  },
];

export default function HomePage() {
  return (
    <div className="gradient-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <CandlestickScene />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              ChartSnap{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-2xl mx-auto">
              Upload a chart screenshot. Get AI-powered Buy, Sell, or Nothing recommendations in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/analyze">
                <GradientButton size="lg">
                  <span className="flex items-center gap-2">
                    Start Analyzing
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </GradientButton>
              </Link>
              <Link href="/login">
                <button className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10">
                  Sign In
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/60 text-lg">
              Three simple steps to get professional technical analysis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="p-8 h-full hover:scale-[1.02] transition-transform">
                  <div className="mb-6">
                    <FloatingIcon3D shape={feature.shape} color={feature.color} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sample Analyses
            </h2>
            <p className="text-white/60 text-lg">
              See what kind of insights ChartSnap AI provides
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard gradientBorder className="p-6 h-full">
                  <DecisionBadge3D decision={example.decision} />
                  <div className="mt-4">
                    <p className="text-emerald-400 font-semibold text-sm mb-2">{example.label}</p>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {example.reason}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard gradientBorder className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Analyze Your Charts?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of traders using AI-powered technical analysis to make better decisions.
              </p>
              <Link href="/analyze">
                <GradientButton size="lg">
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </GradientButton>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            2024 ChartSnap AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-white/40 hover:text-white/80 text-sm transition-colors">
              Contact
            </Link>
            <Link href="/login" className="text-white/40 hover:text-white/80 text-sm transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DecisionBadge({ decision, label }: { decision: 'Buy' | 'Sell' | 'Nothing'; label: string }) {
  const icons = {
    Buy: TrendingUp,
    Sell: TrendingDown,
    Nothing: Minus,
  };
  const classes = {
    Buy: 'decision-buy',
    Sell: 'decision-sell',
    Nothing: 'decision-nothing',
  };
  const Icon = icons[decision];

  return (
    <div className={`flex items-center gap-2 ${classes[decision]}`}>
      <Icon className="w-4 h-4" />
      <span className="font-semibold tracking-wide">{label}</span>
    </div>
  );
}
