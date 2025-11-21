import { useEffect, useState, useRef } from "react";
import { Navigation } from "../components/Navigation";
import { AnimationSettings, AnimationConfig } from "../components/AnimationSettings";
import { poems } from "../lib/poems";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import beekeeperImg from "@assets/generated_images/beekeeper.png";
import landscapeImg from "@assets/generated_images/moody_warm_brown_minimal_landscape.png";
import shadowImg from "@assets/generated_images/elegant_shadow_of_a_plant_on_a_wall.png";
import textureImg from "@assets/generated_images/abstract_literary_texture_with_ink_and_paper.png";

// Map images to poems (cycling through them)
const poemImages: Record<string, string> = {
  "1": beekeeperImg,
  "2": landscapeImg,
  "3": shadowImg,
  "4": textureImg
};

const getLineHeightValue = (lineHeight: string) => {
  switch (lineHeight) {
    case "snug": return "1.375";
    case "normal": return "1.5";
    case "relaxed": return "1.625";
    case "loose": return "2";
    default: return "1.625";
  }
};

export default function Home() {
  const [activePoemId, setActivePoemId] = useState<string>(poems[0].id);
  const [showAnimationSettings, setShowAnimationSettings] = useState(false);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>({
    imageTransitions: true,
    imageFadeSpeed: 0.5,
    imageEasing: "easeInOut",
    imageTransitionMode: "fadeOut",
    imageScale: false,
    imageScaleAmount: 1.05,
    imageOpacity: 0.9,
    imageBlur: 0,
    poemFadeEffect: true,
    poemTransitionSpeed: 500,
    poemOpacityInactive: 0.3,
    poemBlurInactive: 1,
    poemScaleInactive: 0.98,
    smoothScrolling: true,
    textLetterSpacing: 0,
    textLineHeight: "loose",
    titleFontWeight: "500",
    bodyFontSize: 20,
    dateUppercase: true,
    showDivider: true,
    borderOpacity: 1,
  });

  // Listen for "/help" command to show animation settings
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Track key sequence for "/help"
      const target = e.target as HTMLElement;
      // Only listen if not in an input/textarea
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // Simple approach: listen for "/" key to toggle
      if (e.key === '/') {
        e.preventDefault();
        setShowAnimationSettings(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // IntersectionObserver to detect active poem based on image visibility
  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("data-poem-id");

        // 🔍 DEBUG: See what the observer is detecting
        console.log('📊 Intersection Observer:', {
          poemId: id,
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          elementType: entry.target.id,
          boundingRect: entry.boundingClientRect,
          rootBounds: entry.rootBounds,
        });

        // Trigger when image is significantly visible
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          if (id) {
            console.log('✅ ACTIVATING POEM:', id);
            setActivePoemId(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null, // Viewport
      rootMargin: "-30% 0px -30% 0px", // Focus area when image is in middle portion
      threshold: [0.3, 0.5, 0.7]
    });

    // Observe image containers on mobile, poem articles on desktop
    poems.forEach((poem) => {
      const imageElement = document.getElementById(`image-${poem.id}`);
      const poemElement = document.getElementById(`poem-${poem.id}`);

      // On mobile, observe images; on desktop, observe poems
      if (window.innerWidth < 768 && imageElement) {
        console.log('👀 Observing IMAGE for poem:', poem.id);
        observer.observe(imageElement);
      } else if (poemElement) {
        console.log('👀 Observing POEM ARTICLE for poem:', poem.id);
        observer.observe(poemElement);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-serif selection:bg-accent/20">
      <Navigation />
      
      <main className="flex flex-col md:flex-row min-h-screen">

        {/*
           DESKTOP: Sticky Sidebar
           Standard split screen behavior
        */}
        <div className="hidden md:flex w-1/2 h-screen sticky top-0 left-0 flex-col justify-center items-center p-12 border-r border-border/40 overflow-hidden bg-secondary/30">
          <div className="relative w-full h-full max-w-md max-h-[60vh] aspect-[3/4] overflow-hidden shadow-2xl">
             {animationConfig.imageTransitions ? (
               <AnimatePresence
                 mode={
                   animationConfig.imageTransitionMode === "crossfade" ? "sync" :
                   animationConfig.imageTransitionMode === "fadeOut" ? "popLayout" :
                   "wait"
                 }
               >
                <motion.img
                  key={activePoemId}
                  src={poemImages[activePoemId]}
                  initial={{
                    opacity: 0,
                    scale: animationConfig.imageScale ? animationConfig.imageScaleAmount : 1
                  }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: animationConfig.imageFadeSpeed,
                    ease: animationConfig.imageEasing
                  }}
                  alt="Poem visual"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: animationConfig.imageOpacity, filter: `blur(${animationConfig.imageBlur}px)` }}
                />
               </AnimatePresence>
             ) : (
               <img
                 src={poemImages[activePoemId]}
                 alt="Poem visual"
                 className="absolute inset-0 w-full h-full object-cover"
                 style={{ opacity: animationConfig.imageOpacity, filter: `blur(${animationConfig.imageBlur}px)` }}
               />
             )}
             <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
          </div>
          <div className="absolute bottom-8 left-12 text-xs font-sans tracking-widest text-muted-foreground uppercase">
             Selected Works 2024-2025
          </div>
        </div>

        {/*
           SCROLLABLE CONTENT (Both Mobile & Desktop)
           Mobile: Each poem has its image directly above it with spacing
           Desktop: Standard right column
        */}
        <div className="w-full md:w-1/2 relative">
          {/* Mobile: Add padding to prevent navbar overlap on first image */}
          <div className="md:hidden h-20" />

          <div className="max-w-2xl mx-auto px-6 pb-12 md:px-16 md:py-32 flex flex-col md:gap-[60vh] md:pb-[40vh]">
            {poems.map((poem, index) => (
              <div key={poem.id} className="flex flex-col">
                {/* MOBILE: Image above each poem with generous spacing */}
                <div
                  id={`image-${poem.id}`}
                  data-poem-id={poem.id}
                  className="md:hidden mb-16"
                  style={{
                    // 🔍 DEBUG: Red border shows what's being observed
                    border: '3px solid red',
                    position: 'relative'
                  }}
                >
                  <div className="relative w-full h-[50vh] overflow-hidden shadow-2xl mb-20">
                    {animationConfig.imageTransitions ? (
                      <AnimatePresence
                        mode={
                          animationConfig.imageTransitionMode === "crossfade" ? "sync" :
                          animationConfig.imageTransitionMode === "fadeOut" ? "popLayout" :
                          "wait"
                        }
                      >
                        <motion.img
                          key={activePoemId === poem.id ? activePoemId : 'inactive'}
                          src={poemImages[poem.id]}
                          initial={{
                            opacity: 0,
                            scale: animationConfig.imageScale ? animationConfig.imageScaleAmount : 1
                          }}
                          animate={{ opacity: activePoemId === poem.id ? 1 : 0.4, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: animationConfig.imageFadeSpeed,
                            ease: animationConfig.imageEasing
                          }}
                          alt="Poem visual"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ opacity: animationConfig.imageOpacity, filter: `blur(${animationConfig.imageBlur}px)` }}
                        />
                      </AnimatePresence>
                    ) : (
                      <img
                        src={poemImages[poem.id]}
                        alt="Poem visual"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          opacity: activePoemId === poem.id ? animationConfig.imageOpacity : 0.4,
                          filter: `blur(${animationConfig.imageBlur}px)`
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/60" />
                  </div>
                </div>

                {/* Poem Content */}
                <article
                  id={`poem-${poem.id}`}
                  data-poem-id={poem.id}
                  className="flex flex-col gap-6 min-h-[50vh] justify-center mb-32 md:mb-0"
                  style={animationConfig.poemFadeEffect ? {
                    opacity: activePoemId === poem.id ? 1 : animationConfig.poemOpacityInactive,
                    transform: activePoemId === poem.id ? 'scale(1)' : `scale(${animationConfig.poemScaleInactive})`,
                    filter: activePoemId === poem.id ? 'blur(0px)' : `blur(${animationConfig.poemBlurInactive}px)`,
                    transition: `all ${animationConfig.poemTransitionSpeed}ms ease-out`,
                  } : {}}
                >
                  <header className="flex flex-col gap-4">
                    <span
                      className={`text-xs font-sans font-bold tracking-widest text-accent border-b border-accent/20 pb-2 w-fit ${animationConfig.dateUppercase ? 'uppercase' : ''}`}
                    >
                      {poem.date}
                    </span>
                    <h2
                      className="text-4xl md:text-5xl font-display leading-tight text-primary"
                      style={{ fontWeight: animationConfig.titleFontWeight }}
                    >
                      {poem.title}
                    </h2>
                  </header>

                  {animationConfig.showDivider && (
                    <div
                      className="w-12 h-[1px] bg-border my-2"
                      style={{ opacity: animationConfig.borderOpacity }}
                    />
                  )}

                  <div
                    className="prose prose-lg prose-p:font-serif prose-p:text-foreground/90 whitespace-pre-line"
                    style={{
                      fontSize: `${animationConfig.bodyFontSize}px`,
                      letterSpacing: `${animationConfig.textLetterSpacing}em`,
                      lineHeight: getLineHeightValue(animationConfig.textLineHeight),
                    }}
                  >
                    {poem.content}
                  </div>
                </article>
              </div>
            ))}

            <footer className="pt-24 pb-12 border-t border-border flex justify-between items-end">
              <div className="flex flex-col gap-2">
                <span className="font-display text-2xl">Kasra Mikaili</span>
                <span className="text-sm text-muted-foreground font-sans">© 2025 All Rights Reserved.</span>
              </div>
              <button
                onClick={() => window.scrollTo({
                  top: 0,
                  behavior: animationConfig.smoothScrolling ? 'smooth' : 'auto'
                })}
                className="text-sm font-sans uppercase tracking-widest hover:text-accent transition-colors"
              >
                Back to Top
              </button>
            </footer>
          </div>
        </div>
      </main>

      {showAnimationSettings && (
        <AnimationSettings
          config={animationConfig}
          onConfigChange={setAnimationConfig}
        />
      )}
    </div>
  );
}
