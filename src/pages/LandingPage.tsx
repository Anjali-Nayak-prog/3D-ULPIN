import { LandingNavbar } from '../components/landing/LandingNavbar'
import { Hero } from '../components/landing/Hero'
import { TrustStrip } from '../components/landing/TrustStrip'
import { ProblemSection } from '../components/landing/ProblemSection'
import { SolutionSection } from '../components/landing/SolutionSection'
import { HowItWorks } from '../components/landing/HowItWorks'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { PropertyExplorer } from '../components/landing/PropertyExplorer'
import { TechnologySection } from '../components/landing/TechnologySection'
import { PlatformPreview } from '../components/landing/PlatformPreview'
import { ImpactSection } from '../components/landing/ImpactSection'
import { FinalCTA } from '../components/landing/FinalCTA'
import { LandingFooter } from '../components/landing/LandingFooter'

export function LandingPage() {
  return (
    <div className="landing-bg min-h-screen overflow-x-hidden font-sans text-slate-300">
      <LandingNavbar />
      <main>
        <Hero />
        <TrustStrip />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <FeaturesSection />
        <PropertyExplorer />
        <TechnologySection />
        <PlatformPreview />
        <ImpactSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  )
}