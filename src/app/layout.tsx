import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastContainer } from "@/components/Toast";

export const metadata: Metadata = {
  title: "PullGame — Implement ML Papers, One Function at a Time",
  description:
    "Practice implementing machine learning paper concepts through micro-tasks with unit tests. Master attention mechanisms, optimizers, normalization layers, and more.",
  keywords: ["machine learning", "deep learning", "practice", "transformers", "attention", "implementation"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 160px)", position: "relative", zIndex: 1 }}>
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
