import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import CompetitiveProgramming from '@/components/CompetitiveProgramming';
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function Home() {
  return (
    <main style={{ backgroundColor: '#121212' }}>
      <Navbar />
      <Hero />
      <Education />
      <Projects />
      <Skills />
      <CompetitiveProgramming />
      <Certificates />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
