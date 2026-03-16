import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Compass } from 'lucide-react';

const InteractiveHero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[hsl(var(--hero-bg-light))] to-[hsl(var(--hero-bg-lighter))]">
      {/* Animated fog blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fog-blob fog-blob-1" />
        <div className="fog-blob fog-blob-2" />
        <div className="fog-blob fog-blob-3" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 sm:py-32 flex items-center justify-center min-h-screen">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--accent-cyan))]/10 text-[hsl(var(--accent-cyan))] text-sm font-medium mb-6 transition-transform hover:scale-105">
            <Compass className="h-4 w-4" />
            Discover Your Future Career
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[hsl(var(--text-dark))] mb-6 leading-tight">
            Explore Careers That
            <br />
            <span className="text-[hsl(var(--accent-cyan))]">Match Your Goals</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-[hsl(var(--text-gray))] mb-8 leading-relaxed max-w-2xl mx-auto">
            Get instant insights into job roles, required skills, salary ranges, and growth trends across diverse career fields. Start your journey in under 10 seconds.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-base group bg-[hsl(var(--accent-cyan))] hover:bg-[hsl(var(--accent-cyan))]/90 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Link to="/fields" className="flex items-center gap-2">
                Start Exploring
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base bg-white/80 backdrop-blur-sm border-[hsl(var(--text-dark))]/20 text-[hsl(var(--text-dark))] hover:bg-white/90 transition-all"
            >
              <Link to="/fields">Browse All Fields</Link>
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .fog-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }
        .fog-blob-1 {
          width: 600px;
          height: 600px;
          background: hsl(var(--accent-cyan));
          top: -100px;
          left: -150px;
          animation: float1 12s ease-in-out infinite;
        }
        .fog-blob-2 {
          width: 500px;
          height: 500px;
          background: hsl(195 85% 70%);
          bottom: -80px;
          right: -100px;
          animation: float2 15s ease-in-out infinite;
        }
        .fog-blob-3 {
          width: 400px;
          height: 400px;
          background: hsl(187 92% 65%);
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
          animation: float3 10s ease-in-out infinite;
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, -30px) scale(1.08); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-45%) scale(1.12); }
        }
      `}</style>
    </section>
  );
};

export default InteractiveHero;
