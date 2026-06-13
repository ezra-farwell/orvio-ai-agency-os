import { Link } from "@tanstack/react-router";
import { Wordmark } from "./primitives";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-text-muted">The agency OS with AI built in.</p>
          <p className="mt-8 text-xs text-text-faint">© 2026 Orvio</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm md:justify-self-center">
          <Link to="/" hash="two-layers" className="text-text-muted hover:text-foreground">Product</Link>
          <Link to="/" hash="features" className="text-text-muted hover:text-foreground">Features</Link>
          <Link to="/pricing" className="text-text-muted hover:text-foreground">Pricing</Link>
          <Link to="/demo" className="text-text-muted hover:text-foreground">Demo</Link>
          <Link to="/signup" className="text-text-muted hover:text-foreground">Sign in</Link>
          <Link to="/signup" className="text-text-muted hover:text-foreground">Sign up</Link>
        </div>
        <div className="space-y-2 text-sm md:justify-self-end">
          <a href="mailto:ezra@scaledsolutions.net" className="block text-text-muted hover:text-foreground">
            ezra@scaledsolutions.net
          </a>
          <a href="#" className="block text-text-muted hover:text-foreground">Privacy Policy</a>
          <a href="#" className="block text-text-muted hover:text-foreground">Terms of Service</a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-5 py-6 text-center text-xs text-text-faint sm:px-8">
          Built for agencies that are serious about scale.
        </div>
      </div>
    </footer>
  );
}
