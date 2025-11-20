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

  // Function to handle intersection of poems
  useEffect(() => {
    const observers = new Map();
    
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const id = entry.target.getAttribute("data-poem-id");
          if (id) setActivePoemId(id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Active when in the middle 20% of screen
      threshold: [0.1, 0.5, 0.9]
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
      
      <main className="flex flex-col md:flex-row min-h-screen pt-24 md:pt-0">
        {/* Left Side - Visual Sticky */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-screen sticky top-0 left-0 flex flex-col justify-center items-center p-12 border-b md:border-b-0 md:border-r border-border/40 overflow-hidden bg-secondary/30">
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
             
             {/* Overlay Gradient */}
             <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
          </div>
          
          <div className="absolute bottom-8 left-12 text-xs font-sans tracking-widest text-muted-foreground uppercase">
             Selected Works 2024-2025
          </div>
        </div>

        {/* Right Side - Scrollable Content */}
        <div className="w-full md:w-1/2 relative z-10">
          <div className="max-w-2xl mx-auto px-8 md:px-16 py-24 md:py-32 flex flex-col gap-32 md:gap-48">
            {poems.map((poem) => (
              <article 
                key={poem.id} 
                id={`poem-${poem.id}`}
                data-poem-id={poem.id}
                className="flex flex-col gap-6 transition-opacity duration-500"
                style={{ 
                  opacity: activePoemId === poem.id ? 1 : 0.4,
                  transform: activePoemId === poem.id ? 'translateY(0)' : 'translateY(0)',
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
      </main>
    </div>
  );
}
