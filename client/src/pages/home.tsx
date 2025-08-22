import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import PortfolioSection from "@/components/portfolio-section";
import ContactSection from "@/components/contact-section";

export default function Home() {

  return (
    <div data-testid="main-content">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-dark-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 mb-4 md:mb-0">
            © 2024 Mark Raevski. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-accent-500 transition-colors" data-testid="link-artstation">
              <i className="fab fa-artstation"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-accent-500 transition-colors" data-testid="link-linkedin">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-accent-500 transition-colors" data-testid="link-instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
