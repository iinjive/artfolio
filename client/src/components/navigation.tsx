import { motion } from "framer-motion";

export default function Navigation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 glass-effect"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center items-center">
        <div className="hidden md:flex space-x-32">
          <button 
            onClick={() => scrollToSection('about')} 
            className="relative group hover:text-accent-500 transition-colors font-sans font-light text-lg tracking-wider"
            data-testid="button-about"
          >
            <span className="relative">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </button>
          <button 
            onClick={() => scrollToSection('portfolio')} 
            className="relative group hover:text-accent-500 transition-colors font-sans font-light text-lg tracking-wider"
            data-testid="button-portfolio"
          >
            <span className="relative">
              Portfolio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="relative group hover:text-accent-500 transition-colors font-sans font-light text-lg tracking-wider"
            data-testid="button-contact"
          >
            <span className="relative">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
