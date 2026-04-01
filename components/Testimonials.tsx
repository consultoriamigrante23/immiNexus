"use client";
import { useState } from "react";

const testimonials = [
  {
    name: "Carlos M.",
    country: "🇲🇽 → 🇺🇸",
    text: "ImmiNexus made my H1-B process completely stress-free. They handled everything, communicated clearly at every step, and I got my visa approved first try.",
    rating: 5,
  },
  {
    name: "Fatima R.",
    country: "🇲🇦 → 🇨🇦",
    text: "I was lost with Express Entry until I found ImmiNexus. They optimized my profile, guided my document prep, and I received my ITA within 3 months.",
    rating: 5,
  },
  {
    name: "Diego L.",
    country: "🇧🇷 → 🇲🇽",
    text: "Professional, fast, and trustworthy. My temporary residency was approved with no issues. I highly recommend ImmiNexus to anyone navigating Mexican immigration.",
    rating: 5,
  },
  {
    name: "Priya S.",
    country: "🇮🇳 → 🇺🇸",
    text: "The team at ImmiNexus is exceptional. They knew exactly what documents I needed for my F1 visa and prepared me perfectly for the interview.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="py-24 bg-navy-900/50 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-teal-500 text-sm font-body tracking-widest uppercase mb-3">Client Stories</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Real People. Real Results.
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-teal-500 to-gold-500 mx-auto" />
        </div>

        {/* Featured testimonial */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="glass rounded-2xl p-8 md:p-12 text-center relative">
            <div className="text-teal-500 text-5xl font-heading leading-none mb-6">"</div>
            <p className="font-heading text-xl md:text-2xl text-white/90 leading-relaxed italic mb-8">
              {testimonials[active].text}
            </p>
            <div className="flex justify-center gap-1 mb-4">
              {Array(testimonials[active].rating).fill(null).map((_, i) => (
                <span key={i} className="text-gold-400 text-lg">★</span>
              ))}
            </div>
            <div className="font-heading text-lg font-semibold text-white">{testimonials[active].name}</div>
            <div className="text-white/40 text-sm font-body mt-1">{testimonials[active].country}</div>
          </div>
        </div>

        {/* Selector dots */}
        <div className="flex justify-center gap-6">
          {testimonials.map((t, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`glass rounded-xl px-5 py-3 text-sm font-body transition-all duration-200 ${active === i ? "border-teal-500/60 text-teal-400" : "text-white/40 hover:text-white/70"}`}>
              {t.name} {t.country.split(" → ")[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
    </section>
  );
}