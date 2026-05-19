import { draftMode } from "next/headers"
import { cookies } from "next/headers"
import { getSiteContent } from "@/lib/content"
import Navbar       from "@/components/navbar"
import Hero         from "@/components/hero"
import About        from "@/components/about"
import Menu         from "@/components/menu"
import Stats        from "@/components/stats"
import Specials     from "@/components/specials"
import Testimonials from "@/components/testimonials"
import Gallery      from "@/components/gallery"
import Reservation  from "@/components/reservation"
import Footer       from "@/components/footer"
import DraftBanner  from "@/components/draft-banner"

export default async function Home() {
  const { isEnabled: isDraft } = await draftMode()
  const cookieStore = await cookies()
  const previewToken = isDraft ? cookieStore.get("preview-token")?.value : undefined

  const content = await getSiteContent(previewToken)

  return (
    <>
      {isDraft && <DraftBanner />}
      <Navbar />
      <Hero content={content} />
      <About content={content} />
      <Menu />
      <Stats />
      <Specials />
      <Testimonials />
      <Gallery />
      <Reservation content={content} />
      <Footer content={content} />
    </>
  )
}
