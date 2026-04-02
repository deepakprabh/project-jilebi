import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Menu from '@/components/sections/Menu'
import Reservation from '@/components/sections/Reservation'
import Gallery from '@/components/sections/Gallery'
import Footer from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
      <Reservation />
      <Gallery />
      <Footer />
    </main>
  )
}
