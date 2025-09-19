import { Button } from "@/components/ui/button";
import appIcon from "../assets/appIcon.svg";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight flex items-center gap-4">
        <img src={appIcon} alt="app icon" className="h-10 w-10" />
        FlowPay
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-md">
        The simplest, safest way to send and manage your money.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <a href="/signup">Get Started</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="/signin">Sign In</a>
        </Button>
      </div>
    </div>
  );
}
