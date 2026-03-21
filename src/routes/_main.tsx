import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'

export const Route = createFileRoute('/_main')({
  component: MainLayout,
})

function MainLayout() {
  return (
    <>
      <main className="max-w-[712px] mx-auto md:py-10 px-4 min-h-[calc(100vh-50px-100px)] mb-10">
        <Navbar />
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}
