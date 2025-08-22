import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSection() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [consoleComplete, setConsoleComplete] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  const [titlePosition, setTitlePosition] = useState("center");
  const [showArrow, setShowArrow] = useState(false);
  const [arrowBounceComplete, setArrowBounceComplete] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const messages = [
    "> Profile: Mark Raevski - Technical Art, Environment Art."
  ];

  const getRandomDelay = () => {
    const baseDelay = 20; // 2x faster than before
    const variation = Math.random() * 30;
    const pause = Math.random() < 0.1 ? 100 : 0;
    return baseDelay + variation + pause;
  };

  // Font loading effect
  useEffect(() => {
    const checkFonts = async () => {
      try {
        // Wait for both fonts to load
        await document.fonts.load('900 1em BasementGrotesque');
        await document.fonts.load('400 1em Inter');
        // Small delay to ensure everything is rendered
        setTimeout(() => {
          setFontsLoaded(true);
        }, 100);
      } catch (error) {
        // Fallback - show content after a delay even if font loading fails
        setTimeout(() => {
          setFontsLoaded(true);
        }, 500);
      }
    };
    
    // Check if fonts are already loaded
    if (document.fonts.check('900 1em BasementGrotesque') && document.fonts.check('400 1em Inter')) {
      setFontsLoaded(true);
    } else {
      checkFonts();
    }
  }, []);

  useEffect(() => {
    // Don't start animation until fonts are loaded
    if (!fontsLoaded) return;
    
    // Check if animation should be skipped using sessionStorage (resets on tab close)
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setConsoleComplete(true);
      setShowTitle(true);
      setShowLogo(true);
      setShowSubtitle(true);
      setTitlePosition("down");
      setAnimationComplete(true);
      return;
    }

    let timeout: NodeJS.Timeout;

    if (currentIndex < messages.length) {
      const message = messages[currentIndex];
      const charIndex = currentText.length;

      if (charIndex < message.length) {
        timeout = setTimeout(() => {
          setCurrentText(message.substring(0, charIndex + 1));
        }, getRandomDelay());
      } else {
        timeout = setTimeout(() => {
          if (currentIndex === messages.length - 1) {
            // All messages complete, wait 0.5 second then mark console as complete
            setTimeout(() => {
              setConsoleComplete(true);
            }, 500);
          } else {
            setCurrentIndex(currentIndex + 1);
            setCurrentText("");
          }
        }, 300);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, messages, fontsLoaded]);

  const CubeLogo = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" className="mx-auto">
      <defs>
        <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(36, 42%, 65%)" />
          <stop offset="100%" stopColor="hsl(36, 42%, 75%)" />
        </linearGradient>
      </defs>
      <g transform="translate(24,6)">
        <polygon points="-18,12 0,0 18,12 0,24" fill="url(#cubeGradient)" opacity="0.9"/>
        <polygon points="-18,12 0,24 0,42 -18,30" fill="hsl(36, 42%, 55%)" opacity="0.7"/>
        <polygon points="18,12 0,24 0,42 18,30" fill="hsl(36, 42%, 50%)" opacity="0.8"/>
      </g>
    </svg>
  );

  // Show loading screen until fonts are loaded
  if (!fontsLoaded) {
    return (
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="text-center max-w-6xl mx-auto px-6 -mt-16">
          <div className="opacity-0">Loading...</div>
        </div>
      </section>
    );
  }

  // If animation is complete, render static version to prevent glitches
  if (animationComplete) {
    return (
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="text-center max-w-6xl mx-auto px-6 -mt-16">
          <div className="space-y-6">
            {/* Static logo container */}
            <div className="relative h-20 flex items-center justify-center">
              <div className="absolute">
                <CubeLogo />
              </div>
            </div>

            {/* Static title section - using motion.div to maintain exact positioning */}
            <motion.div 
              className="space-y-6"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
            >
              <h1 className="text-6xl md:text-8xl font-title font-bold text-gradient whitespace-nowrap overflow-visible" data-testid="text-hero-title">
                MARK RAEVSKI
              </h1>

              <motion.p 
                className="text-xl md:text-2xl font-title text-accent-500 font-light"
                data-testid="text-hero-subtitle"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0 }}
                style={{ 
                  willChange: 'auto',
                  transform: 'translate3d(0, 0, 0)', // Force exact positioning
                  backfaceVisibility: 'hidden' // Prevent sub-pixel rendering
                }}
              >
                Technical Artist • Environment Artist
              </motion.p>
            </motion.div>
          </div>

          {/* Static down arrow */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group flex flex-col items-center text-slate-400 hover:text-accent-500 transition-colors cursor-pointer"
              data-testid="button-scroll-down"
            >
              <div className="w-6 h-6 text-slate-400 group-hover:text-accent-500 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Render animated version only on first visit
  return (
    <section className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="text-center max-w-6xl mx-auto px-6 -mt-16">
        {/* Structured layout to prevent overlapping */}
        <div className="space-y-6">
          {/* Console/Logo/Title container */}
          <div className="relative h-20 flex items-center justify-center">
            {/* Console Animation - step 1-4 */}
            <AnimatePresence onExitComplete={() => {
              // Step 5: Empty space for 0.5 second, then show title
              setTimeout(() => {
                setShowTitle(true);
                // Step 9: After title appears, slide it down
                setTimeout(() => {
                  setTitlePosition("down");
                  // Step 11: After title slides down, show logo at original position
                  setTimeout(() => {
                    setShowLogo(true);
                    // Step 13: After logo appears, wait longer for suspense then show subtitle
                    setTimeout(() => {
                      setShowSubtitle(true);
                      // Step 15: After subtitle appears, show bouncing arrow
                      setTimeout(() => {
                        setShowArrow(true);
                        // Step 17: After arrow bounces, complete all animations
                        setTimeout(() => {
                          setArrowBounceComplete(true);
                          setAnimationComplete(true);
                          sessionStorage.setItem('hasSeenIntro', 'true');
                        }, 2000); // Time for arrow to complete its bounce sequence
                      }, 800); // Delay after subtitle appears
                    }, 1000);
                  }, 400);
                }, 500);
              }, 500);
            }}>
              {!consoleComplete && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-mono text-2xl text-accent-500"
                >
                  <span data-testid="text-terminal">
                    {currentText}
                    <span className="typing-cursor">█</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logo appears at console position when title is down */}
            {titlePosition === "down" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                className="absolute"
              >
                <CubeLogo />
              </motion.div>
            )}
          </div>

          {/* Title section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: showTitle ? 1 : 0,
              y: titlePosition === "center" ? -80 : 0
            }}
            transition={{ 
              opacity: { duration: 0.8 },
              y: { duration: 0.8 }
            }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-title font-bold text-gradient whitespace-nowrap overflow-visible" data-testid="text-hero-title">
              MARK RAEVSKI
            </h1>

            {/* Subtitle appears after logo completes with dramatic suspense */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: showSubtitle ? 1 : 0,
                y: showSubtitle ? 0 : 10
              }}
              transition={{ 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for ultra smooth animation
                delay: 0
              }}
              style={{ 
                willChange: 'opacity, transform',
                transform: 'translate3d(0, 0, 0)', // Ensure consistent transform baseline
                backfaceVisibility: 'hidden' // Prevent sub-pixel rendering
              }}
              className="text-xl md:text-2xl font-title text-accent-500 font-light"
              data-testid="text-hero-subtitle"
            >
              Technical Artist • Environment Artist
            </motion.p>
          </motion.div>



        </div>

        {/* Bouncing down arrow appears after subtitle - positioned at bottom center */}
        {showArrow && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: 1, 
              y: 0 
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <button
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group flex flex-col items-center text-slate-400 hover:text-accent-500 transition-colors cursor-pointer"
              data-testid="button-scroll-down"
            >
              <motion.div
                animate={
                  arrowBounceComplete 
                    ? { y: 0 } // Static position after bounce completes
                    : { y: [0, -12, 0, -8, 0, -4, 0] } // Bouncing sequence
                }
                transition={
                  arrowBounceComplete
                    ? { duration: 0 } // No animation when static
                    : { 
                        duration: 1.8, 
                        ease: "easeOut", 
                        times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1] // Timing for each bounce
                      }
                }
                style={{ 
                  willChange: arrowBounceComplete ? 'auto' : 'transform',
                  transform: 'translate3d(0, 0, 0)',
                  backfaceVisibility: 'hidden'
                }}
                className="w-6 h-6 text-slate-400 group-hover:text-accent-500 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </motion.div>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
