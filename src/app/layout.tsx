import type { Metadata } from "next";
import "./globals.css";
import QueryClientCustomProvider from "@/src/api/QueryClientCustomProvider";

export const metadata: Metadata = {
  title: "Checkpoint",
  description: "Gestão de vendas, compras e produtos",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">
        <QueryClientCustomProvider>{children}</QueryClientCustomProvider>
      </body>
    </html>
  );
}
