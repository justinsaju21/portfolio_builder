import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingContent } from "@/components/landing/LandingContent";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <LandingContent />
      <Footer />
    </main>
  );
}
