import './globals.css';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DashboardPreview from '@/components/DashboardPreview';
import AIIntelligence from '@/components/AIIntelligence';
import AI_Search from '@/components/AI_Search';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <DashboardPreview />
        <AIIntelligence />
        <AI_Search />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
