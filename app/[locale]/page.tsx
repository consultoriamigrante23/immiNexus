import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import FeedbackSection from "@/components/Feedback";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import Chatbot from "@/components/Chatbot";
import CookieBanner from "@/components/CookieBanner";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Process />
        <FeedbackSection />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
      <Chatbot />
      <CookieBanner />
    </>
  );
}