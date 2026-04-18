import { useTranslations } from "next-intl";
import Hero      from "@/components/Hero";
import Services  from "@/components/Services";
import WhyUs     from "@/components/WhyUs";
import Process   from "@/components/Process";
import Feedback  from "@/components/Feedback";
import Contact   from "@/components/Contact";
import Footer    from "@/components/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params; // ensure params resolved

  return (
    <main>
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <Feedback />
      <Contact />
      <Footer />
    </main>
  );
}