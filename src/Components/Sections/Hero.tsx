// src/components/sections/Hero.tsx
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaUrl: string;
    backgroundImage?: string;
    stats?: Array<{ label: string; value: string }>;
  };
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:100px_100px] opacity-20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/5 rounded-3xl blur-3xl -rotate-6" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-3xl blur-3xl rotate-12" />

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Trust Indicators */}
        <div className="flex flex-wrap gap-6 justify-center mb-12 max-w-2xl mx-auto">
          {data.stats?.map((stat, i) => (
            <div key={i} className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 bg-clip-text">
          {data.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 font-medium mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
          {data.subtitle}
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <a
            href={data.ctaUrl}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-6 px-12 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 border-2 border-transparent hover:border-indigo-400/50 backdrop-blur-sm"
          >
            <span>{data.ctaText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="flex items-center gap-3 text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-xl hover:bg-white/50 backdrop-blur-sm cursor-pointer">
            <Play className="w-6 h-6" />
            <span className="font-medium text-sm">Watch Video</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};
