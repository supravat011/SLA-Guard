import React from 'react';
import { ShieldCheck, Activity, Bell, Zap, ChevronRight, Globe, BarChart2, Shield } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-space-900 selection:bg-brand-500 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-space-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20 shadow-glow">
              <ShieldCheck className="w-6 h-6 text-brand-400" />
            </div>
            <span className="font-bold text-xl text-white tracking-wide">SLA<span className="text-brand-400">Guard</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Mission</a>
            <a href="#solutions" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#pricing" className="hover:text-white transition-colors">Access</a>
          </div>
          <button
            onClick={onLogin}
            className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 hover:border-brand-400/50 transition-all"
          >
            Launch Console
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden pt-20 pb-32 lg:pt-40">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse shadow-glow"></span>
            System Status: Nominal
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-8 leading-tight">
            Predict & Prevent <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-purple-500">SLA Breaches</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed">
            The next-generation command center for service reliability. Monitor timers, forecast risks, and automate responses with military-grade precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-500 transition-all shadow-glow border border-brand-400/20 flex items-center justify-center gap-2 group"
            >
              Initiate Monitoring <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-transparent text-slate-300 border border-slate-700 font-semibold rounded-lg hover:bg-white/5 hover:border-slate-500 transition-all hover:text-white">
              View Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Grid Overlay */}
      {/* Removed external noise.svg - using CSS pattern instead */}

      {/* Stats Strip */}
      <div className="border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-1">99.9%</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Uptime Guaranteed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-brand-400 mb-1">&lt;10ms</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Latency</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-1">24/7</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Active Monitoring</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-400 mb-1">AI</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Risk Prediction</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-4">Core Capabilities</h2>
            <p className="text-slate-400">Advanced tools engineered for high-velocity service teams.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-space-800/40 p-8 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all hover:bg-space-800/60 group backdrop-blur-sm">
              <div className="w-12 h-12 bg-brand-500/10 rounded-lg flex items-center justify-center mb-6 border border-brand-500/20 group-hover:shadow-glow transition-all">
                <Activity className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Tracking</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Visualize SLA timers with nanosecond precision. Progress bars update instantly to show safe, warning, and breach states.
              </p>
            </div>

            <div className="bg-space-800/40 p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all hover:bg-space-800/60 group backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 border border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Predictive AI</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Proprietary algorithms analyze trajectory to identify breach risks before they occur, enabling pre-emptive strikes.
              </p>
            </div>

            <div className="bg-space-800/40 p-8 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all hover:bg-space-800/60 group backdrop-blur-sm">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 border border-amber-500/20 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Automated Defense</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Smart escalation protocols deploy countermeasures and notify command instantly when thresholds are crossed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;