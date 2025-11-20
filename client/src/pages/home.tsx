import { useEffect, useState, useRef } from "react";
import { Navigation } from "../components/Navigation";
import { poems } from "../lib/poems";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import textureImg from "@assets/generated_images/abstract_literary_texture_with_ink_and_paper.png";
import landscapeImg from "@assets/generated_images/moody_warm_brown_minimal_landscape.png";
import shadowImg from "@assets/generated_images/elegant_shadow_of_a_plant_on_a_wall.png";

// Map images to poems (cycling through them)
const poemImages: Record<string, string> = {
  "1": textureImg,
  "2": landscapeImg,
  "3": shadowImg,
  "4": textureImg // Reuse for the 4th one
};

export default function Home() {
  const [activePoemId, setActivePoemId] = useState<string>(poems[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Robust scroll detection for active poem
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const viewportCenter = container.getBoundingClientRect().top + container.clientHeight / 2;
      let closestPoemId = activePoemId;
      let minDistance = Infinity;

      poems.forEach((poem) => {
        const element = document.getElementById(`poem-${poem.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(elementCenter - viewportCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestPoemId = poem.id;
          }
        }
      });

      if (closestPoemId !== activePoemId) {
        setActivePoemId(closestPoemId);
      }
    };

    // Throttle with requestAnimationFrame for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll);
    // Initial check
    handleScroll();

    return () => container.removeEventListener("scroll", onScroll);
  }, [activePoemId]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-screen bg-background text-foreground font-serif selection:bg-accent/20 overflow-hidden flex flex-col">
      <Navigation />
      
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden pt-[72px] md:pt-[88px]">
        {/* Mobile Visual Header (Fixed Layout Top) */}
        <div className="md:hidden h-[40vh] w-full relative shrink-0 z-0 overflow-hidden border-b border-border/40 bg-secondary/30">
           <AnimatePresence mode="wait">
            <motion.img
              key={activePoemId}
              src={poemImages[activePoemId]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              alt="Poem visual"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
           </AnimatePresence>
           <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Desktop Visual Sidebar (Left Panel) */}
        <div className="hidden md:flex w-1/2 h-full flex-col justify-center items-center p-12 border-r border-border/40 overflow-hidden bg-secondary/30 relative">
          <div className="relative w-full h-full max-w-md max-h-[60vh] aspect-[3/4] overflow-hidden shadow-2xl z-10">
             <AnimatePresence mode="wait">
              <motion.img
                key={activePoemId}
                src={poemImages[activePoemId]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                alt="Poem visual"
                className="absolute inset-0 w-full h-full object-cover"
              />
             </AnimatePresence>
             <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
          </div>
          <div className="absolute bottom-8 left-12 text-xs font-sans tracking-widest text-muted-foreground uppercase z-10">
             Selected Works 2024-2025
          </div>
        </div>

        {/* Scrollable Content (Right/Bottom Panel) */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 w-full md:w-1/2 overflow-y-auto bg-background relative z-10"
        >
          <div className="max-w-2xl mx-auto px-6 py-16 md:px-16 md:py-32 flex flex-col gap-32 md:gap-48">
            {poems.map((poem) => (
              <article 
                key={poem.id} 
                id={`poem-${poem.id}`}
                data-poem-id={poem.id}
                className="flex flex-col gap-6 transition-all duration-700"
                style={{ 
                  opacity: activePoemId === poem.id ? 1 : 0.3,
                  transform: activePoemId === poem.id ? 'scale(1)' : 'scale(0.98)',
                  filter: activePoemId === poem.id ? 'blur(0px)' : 'blur(1px)',
                }}
              >
                <header className="flex flex-col gap-4">
                  <span className="text-xs font-sans font-bold tracking-widest text-accent uppercase border-b border-accent/20 pb-2 w-fit">
                    {poem.date}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-medium leading-tight text-primary">
                    {poem.title}
                  </h2>
                </header>
                
                <div className="w-12 h-[1px] bg-border my-2" />
                
                <div className="prose prose-lg prose-p:font-serif prose-p:text-xl prose-p:leading-loose prose-p:text-foreground/90 whitespace-pre-line">
                  {poem.content}
                </div>
              </article>
            ))}
            
            <footer className="pt-24 pb-12 border-t border-border flex justify-between items-end">
              <div className="flex flex-col gap-2">
                <span className="font-display text-2xl">Kasra Mikaili</span>
                <span className="text-sm text-muted-foreground font-sans">© 2025 All Rights Reserved.</span>
              </div>
              <button 
                onClick={scrollToTop}
                className="text-sm font-sans uppercase tracking-widest hover:text-accent transition-colors"
              >
                Back to Top
              </button>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
