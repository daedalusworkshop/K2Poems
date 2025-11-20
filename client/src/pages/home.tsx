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

  // Reverting to IntersectionObserver as it felt more natural to the user
  useEffect(() => {
    const observers = new Map();
    
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // Trigger when 50% of the poem is visible
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const id = entry.target.getAttribute("data-poem-id");
          if (id) setActivePoemId(id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null, // Viewport
      rootMargin: "-20% 0px -20% 0px", // Focus area in the middle
      threshold: [0.2, 0.4, 0.6, 0.8]
    });

    poems.forEach((poem) => {
      const element = document.getElementById(`poem-${poem.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-serif selection:bg-accent/20">
      <Navigation />
      
      <main className="flex flex-col md:flex-row min-h-screen">
        
        {/* 
           MOBILE: Fixed Background Image 
           This stays fixed at z-0. The content scrolls OVER it.
        */}
        <div className="md:hidden fixed top-0 left-0 w-full h-[50vh] z-0">
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
           <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/60" />
        </div>

        {/* 
           DESKTOP: Sticky Sidebar
           Standard split screen behavior
        */}
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

        {/* 
           SCROLLABLE CONTENT (Both Mobile & Desktop)
           Mobile: Has a top spacer so you see the image first, then cards scroll over.
           Desktop: Standard right column.
        */}
        <div className="w-full md:w-1/2 relative z-10">
          
          {/* Mobile Spacer - pushes content down so we see the fixed image initially */}
          <div className="md:hidden h-[45vh]" />
          
          {/* Content Wrapper with Card styling for Mobile */}
          <div className="bg-background md:bg-transparent min-h-[60vh] rounded-t-[2.5rem] md:rounded-none shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-none border-t border-border/20 md:border-none px-6 py-12 md:p-0">
            <div className="max-w-2xl mx-auto md:px-16 md:py-32 flex flex-col gap-[60vh] pb-[40vh]">
              {poems.map((poem) => (
                <article 
                  key={poem.id} 
                  id={`poem-${poem.id}`}
                  data-poem-id={poem.id}
                  className="flex flex-col gap-6 transition-all duration-700 min-h-[50vh] justify-center"
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
