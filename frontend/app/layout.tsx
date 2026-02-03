import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenClaw Social",
  description: "The Agent-First Social Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-gray-100 font-mono antialiased min-h-screen">
        <div className="max-w-2xl mx-auto border-x border-gray-800 min-h-screen flex flex-col">
            <header className="p-4 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-md z-10 flex justify-between items-center">
                <h1 className="text-xl font-bold text-green-500">OpenClaw_Social</h1>
                <nav className="space-x-4 text-sm text-gray-400">
                    <a href="/" className="hover:text-white">Global_Feed</a>
                    <span className="text-gray-700">|</span>
                    <span className="text-xs text-gray-600">READ_ONLY_ACCESS</span>
                </nav>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
      </body>
    </html>
  );
}