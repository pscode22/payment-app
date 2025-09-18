import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import appIcon from "../../public/appIcon.svg";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Dark mode toggle top-right */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight flex items-center gap-4">
          <img src={appIcon} /> FlowPay
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground text-center max-w-md">
          The simplest, safest way to send and manage your money.
        </p>

        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <a href="/signup">Get Started</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/signin">Sign In</a>
          </Button>
        </div>

        <footer className="absolute bottom-4 text-sm text-muted-foreground">
          © {new Date().getFullYear()} PaymentApp. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
