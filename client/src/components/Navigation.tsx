import { Link } from "wouter";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-background/95 backdrop-blur-md border-b border-border/40 py-4 md:py-6 px-6 md:px-12 flex justify-between items-center transition-all duration-300 shadow-sm">
      <Link href="/" className="text-lg tracking-wide font-display font-semibold text-foreground hover:text-accent transition-colors">
        Kasra Mikaili
      </Link>
      
      <div className="flex gap-4 md:gap-8 text-xs md:text-sm uppercase tracking-widest font-sans text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Poems</Link>
        <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
      </div>
    </nav>
  );
}
