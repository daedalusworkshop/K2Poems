import { Link } from "wouter";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40 py-6 px-8 md:px-12 flex justify-between items-center transition-all duration-300">
      <Link href="/" className="text-lg tracking-wide font-display font-semibold text-foreground hover:text-accent transition-colors">
        Kasra Mikaili
      </Link>
      
      <div className="flex gap-8 text-sm uppercase tracking-widest font-sans text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Poems</Link>
        <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
      </div>
    </nav>
  );
}
