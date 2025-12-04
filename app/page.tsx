import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsSection } from "@/components/StatsSection";
import { AboutSection } from "@/components/AboutSection";
import { ValuesPhilosophySection } from "@/components/ValuesPhilosophySection";
import { ServicesSection } from "@/components/ServicesSection";
import { MissionOffersSection } from "@/components/MissionOffersSection";
import { RecognitionsSection } from "@/components/RecognitionsSection";
import { ProcessSection } from "@/components/ProcessSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TeamSection } from "@/components/TeamSection";
import { ContactSection } from "@/components/ContactSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsSection />
      <AboutSection />
      <ValuesPhilosophySection />
      <ServicesSection />
      <MissionOffersSection />
      <RecognitionsSection />
      <ProcessSection />
      <TestimonialsSection />
      <TeamSection />
      <ContactSection />
      <PartnersCarousel />
      <Footer />
    </main>
  );
}

