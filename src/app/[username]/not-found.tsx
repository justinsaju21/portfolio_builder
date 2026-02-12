import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center mx-auto mb-6">
                    <FileQuestion className="w-10 h-10 text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio Not Found</h1>
                <p className="text-foreground-muted mb-8">
                    This portfolio doesn&apos;t exist yet. Maybe the username is incorrect, or the user hasn&apos;t created their portfolio.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/">
                        <Button>Go Home</Button>
                    </Link>
                    <Link href="/signup">
                        <Button variant="secondary">Create Your Portfolio</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
