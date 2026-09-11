import { useNavigate } from 'react-router-dom'
import { ArrowRight, Fingerprint } from 'lucide-react'
import { useReveal } from './useReveal'

export function FinalCTA() {
  const ref = useReveal()
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      {/* Background */}
      <div className="landing-grid absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/[0.12] blur-[140px]"
        aria-hidden="true"
      />
      {/* Spatial particles */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(251,191,36,0.18) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(6,182,212,0.2) 1.5px, transparent 1.5px), radial-gradient(circle at 70% 75%, rgba(139,92,246,0.16) 1px, transparent 1px), radial-gradient(circle at 30% 80%, rgba(16,185,129,0.14) 1px, transparent 1px), radial-gradient(circle at 55% 45%, rgba(59,130,246,0.18) 1px, transparent 1px)',
          backgroundSize: '120px 120px, 160px 160px, 140px 140px, 100px 100px, 180px 180px',
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <span className="reveal mx-auto inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-300">
          <Fingerprint size={13} className="text-cyan-400" />
          Ready When You Are
        </span>
        <h2 className="reveal mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ transitionDelay: '80ms' }}>
          Ready to Map
          <br />
          <span className="text-gradient-blue-cyan">the Third Dimension?</span>
        </h2>
        <p className="reveal mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 lg:text-lg" style={{ transitionDelay: '160ms' }}>
          Explore a new generation of land administration built for vertical
          cities.
        </p>

        <div className="reveal mt-9" style={{ transitionDelay: '240ms' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-base font-semibold text-white shadow-glow transition-all hover:bg-primary-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-[0.98]"
          >
            Launch 3D ULPIN Platform
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="reveal mt-6 text-xs uppercase tracking-[0.25em] text-slate-500" style={{ transitionDelay: '320ms' }}>
          Surface. Vertical. Underground. — One Unified Spatial System.
        </p>
      </div>
    </section>
  )
}