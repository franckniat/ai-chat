import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="font-display text-3xl font-bold tracking-tight">
        This page doesn&apos;t exist
      </h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        The link may be outdated, or the page may have been moved.
      </p>
      <div className="mt-2 flex gap-2">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/chat">Go to chat</Link>
        </Button>
      </div>
    </div>
  );
}
