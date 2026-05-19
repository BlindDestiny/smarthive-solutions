import { draftMode } from "next/headers"
import { cookies } from "next/headers"
import { getSiteContent } from "@/lib/content"
import Navbar       from "@/components/navbar"
import Hero         from "@/components/hero"
import About        from "@/components/about"
import Menu         from "@/components/menu"
import Events       from "@/components/events"
import Gallery      from "@/components/gallery"
import Testimonials from "@/components/testimonials"
import Reservation  from "@/components/reservation"
import Footer       from "@/components/footer"
import DraftBanner  from "@/components/draft-banner"

export default async function Home() {
  const { isEnabled: isDraft } = await draftMode()
  const cookieStore = await cookies()
  const previewToken = isDraft ? cookieStore.get("preview-token")?.value : undefined

  const content = await getSiteContent(previewToken)

  return (
    <main>
      {isDraft && <DraftBanner />}
      <Navbar />
      <Hero content={content} />
      <About content={content} />
      <Menu />
      <Events />
      <Gallery />
      <Testimonials />
      <Reservation content={content} />
      <Footer content={content} />
    </main>
  )
}
