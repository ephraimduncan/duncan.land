import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <main className="max-w-[712px] mx-auto md:py-10 px-4 min-h-[calc(100vh-50px-100px)] mb-10">
        <Navbar />
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
