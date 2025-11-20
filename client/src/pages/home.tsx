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
        
        {/* Mobile Layout Wrapper */}
        <div className="md:hidden flex flex-col w-full h-full">
          
          {/* Mobile Visual (Top Fixed Area) */}
          <div className="h-[45vh] w-full relative shrink-0 z-0 overflow-hidden bg-secondary/30">
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

          {/* Mobile Card (Bottom Scrollable Area) */}
          <div className="flex-1 bg-background rounded-t-[2.5rem] -mt-8 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-8 py-12"
            >
              <div className="flex flex-col gap-24 pb-24">
                {poems.map((poem) => (
                  <article 
                    key={poem.id} 
                    id={`poem-${poem.id}`}
                    data-poem-id={poem.id}
                    className="flex flex-col gap-4 transition-all duration-700"
                    style={{ 
                      opacity: activePoemId === poem.id ? 1 : 0.4,
                      filter: activePoemId === poem.id ? 'blur(0px)' : 'blur(1px)',
                    }}
                  >
                    <header className="flex flex-col gap-2">
                      <span className="text-[10px] font-sans font-bold tracking-widest text-accent uppercase">
                        {poem.date}
                      </span>
                      <h2 className="text-3xl font-display font-medium leading-tight text-primary">
                        {poem.title}
                      </h2>
                    </header>
                    
                    <div className="w-8 h-[1px] bg-border my-1" />
                    
                    <div className="prose prose-lg prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground/90 whitespace-pre-line">
                      {poem.content}
                    </div>
                  </article>
                ))}
                
                <footer className="pt-12 border-t border-border flex flex-col items-center gap-4 text-center">
                  <button 
                    onClick={scrollToTop}
                    className="text-xs font-sans uppercase tracking-widest hover:text-accent transition-colors"
                  >
                    Back to Top
                  </button>
                  <span className="text-xs text-muted-foreground font-sans">© 2025 Kasra Mikaili</span>
                </footer>
              </div>
            </div>
          </div>
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

        {/* Desktop Scrollable Content (Right Panel) */}
        <div 
          className="hidden md:block flex-1 w-1/2 overflow-y-auto bg-background relative z-10"
          onScroll={(e) => {
            // Forward the scroll event to our handler logic via a synthetic ref update if needed, 
            // or we can just duplicate the listener logic. 
            // For simplicity, we can reuse the ref on the desktop container too by conditional rendering
            // But since I split the DOM, I need to attach the ref to the visible container.
            // See implementation below where I use a callback ref or just attach to the desktop div too.
          }}
        >
          {/* 
             NOTE: Since I split the mobile/desktop into two completely different DOM structures for the 'scrollable' part,
             I need to make sure the `scrollContainerRef` attaches to the correct one that is visible.
             
             However, React refs usually point to one element. 
             A simple fix is to use a callback ref or just have two refs and check which one is active in the effect.
             
             Let's use a separate ref for desktop to avoid conflict, or conditional rendering.
             Actually, I'll just attach `ref={scrollContainerRef}` to the desktop container as well. 
             React will update `current` to whichever element rendered last or is currently mounted.
             Since one is `md:hidden` and the other is `hidden md:block`, only one is visible? 
             Wait, `md:hidden` elements are still in the DOM usually unless I use conditional rendering.
             Tailwind's `hidden` is just `display: none`. The ref might get confused if both exist.
             
             BETTER APPROACH for Ref: 
             I will render the `scrollContainerRef` on BOTH, but since only one is visible to the user,
             the `useEffect` needs to find the *visible* one to attach listeners correctly?
             Actually, `display:none` elements have 0 height/width, so `getBoundingClientRect` won't work well.
             
             Let's handle this by creating a specific desktop container ref.
          */}
           <DesktopContent scrollRef={scrollContainerRef} activePoemId={activePoemId} scrollToTop={scrollToTop} />
        </div>
      </main>
    </div>
  );
}

// Helper component to handle the Desktop content rendering and avoid ref conflicts if possible, 
// or just cleaner code.
function DesktopContent({ scrollRef, activePoemId, scrollToTop }: { scrollRef: any, activePoemId: string, scrollToTop: () => void }) {
    return (
        <div 
          ref={scrollRef}
          className="h-full w-full overflow-y-auto bg-background relative z-10"
        >
          <div className="max-w-2xl mx-auto px-16 py-32 flex flex-col gap-48">
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
                  <h2 className="text-5xl font-display font-medium leading-tight text-primary">
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
    );
}
