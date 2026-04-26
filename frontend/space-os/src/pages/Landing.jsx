import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import Stats from "../sections/Stats";
import Features from "../sections/Features";
import HowItWorks from "../sections/HowItWorks";
import Pricing from "../sections/Pricing";
import Demo from "../sections/Demo";
import Newsletter from "../sections/Newsletter";
import Faq from "../sections/Faq";

export default function Landing() {
  return (
    <>
      <Navbar />
      {/* prevents navbar overlap */}
      <main className="pt-16 bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Pricing />
        <Demo />
        <Newsletter />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
