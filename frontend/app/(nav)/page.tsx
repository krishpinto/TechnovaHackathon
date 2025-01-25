import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-6">Welcome to ModernAuthUI</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        A modern authentication UI example built with Next.js, Tailwind CSS, and
        shadcn/ui components.
      </p>
      <div className="space-x-4">
        <Link href="/sign-up">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}