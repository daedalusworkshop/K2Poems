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

  // Robust scroll detection for active poem
  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
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

    window.addEventListener("scroll", onScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [activePoemId]);

  return (
    <div className="min-h-screen bg-background text-foreground font-serif selection:bg-accent/20">
      <Navigation />
      
      <main className="flex flex-col md:flex-row min-h-screen">
        {/* Mobile Visual Header (Fixed) */}
        <div className="md:hidden fixed top-0 left-0 w-full h-[50vh] z-0 overflow-hidden">
           <AnimatePresence mode="wait">
            <motion.img
              key={activePoemId}
              src={poemImages[activePoemId]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              alt="Poem visual"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
           </AnimatePresence>
           <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
        </div>

        {/* Desktop Visual Sidebar (Sticky) */}
        <div className="hidden md:flex w-1/2 h-screen sticky top-0 left-0 flex-col justify-center items-center p-12 border-r border-border/40 overflow-hidden bg-secondary/30">
          <div className="relative w-full h-full max-w-md max-h-[60vh] aspect-[3/4] overflow-hidden shadow-2xl">
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
          <div className="absolute bottom-8 left-12 text-xs font-sans tracking-widest text-muted-foreground uppercase">
             Selected Works 2024-2025
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="w-full md:w-1/2 relative z-10">
          {/* Spacer for Mobile to reveal fixed image */}
          <div className="md:hidden h-[40vh]" />
          
          {/* Content Container */}
          <div className="bg-background md:bg-transparent min-h-[60vh] rounded-t-[2.5rem] md:rounded-none shadow-[0_-20px_40px_rgba(0,0,0,0.05)] md:shadow-none border-t border-border/20 md:border-none px-6 py-16 md:p-0">
            <div className="max-w-2xl mx-auto md:px-16 md:py-32 flex flex-col gap-32 md:gap-48">
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
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm font-sans uppercase tracking-widest hover:text-accent transition-colors"
                >
                  Back to Top
                </button>
              </footer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
