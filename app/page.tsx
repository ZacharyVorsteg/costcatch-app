import {
  Navbar,
  Hero,
  Features,
  ROICalculator,
  Testimonials,
  Pricing,
  Footer,
} from '@/components/landing'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <Features />
        <ROICalculator />
        <Testimonials />
        <Pricing />
        <Footer />
      </div>
    </main>
  )
}
