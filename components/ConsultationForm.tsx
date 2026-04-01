"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  message: string;
};

const services = [
  "USA – Tourist / B1-B2 Visa",
  "USA – Work Visa (H1-B, L1)",
  "USA – Student Visa (F1)",
  "Canada – Express Entry (ITA)",
  "Canada – Study / Work Permit",
  "Canada – Permanent Residency",
  "Mexico – Temporary / Permanent Residency",
  "Other",
];

export default function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // TODO: connect to your email API (Resend etc.)
    await new Promise((r) => setTimeout(r, 1200));
    console.log(data);
    setSubmitted(true);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-teal-500/60 transition-colors duration-200";
  const errorClass = "text-red-400 text-xs mt-1 font-body";

  return (
    <section id="contact" className="py-24 relative">
      {/* Glow behind form */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-teal-500 text-sm font-body tracking-widest uppercase mb-3">Get Started</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Book Your Free Consultation
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-teal-500 to-gold-500 mx-auto mb-4" />
          <p className="text-white/50 font-body">
            Tell us about your situation. We'll get back to you within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-heading text-2xl font-semibold text-white mb-2">Request Received!</h3>
            <p className="text-white/50 font-body">We'll contact you within 24 hours to schedule your free consultation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 md:p-10 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <input {...register("fullName", { required: "Full name is required" })}
                  placeholder="Full Name *" className={inputClass} />
                {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
              </div>
              <div>
                <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email" } })}
                  placeholder="Email Address *" type="email" className={inputClass} />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <input {...register("phone")} placeholder="Phone / WhatsApp" className={inputClass} />
              </div>
              <div>
                <input {...register("country", { required: "Country of origin is required" })}
                  placeholder="Your Country of Origin *" className={inputClass} />
                {errors.country && <p className={errorClass}>{errors.country.message}</p>}
              </div>
            </div>

            {/* Service select */}
            <div>
              <select {...register("service", { required: "Please select a service" })}
                className={`${inputClass} appearance-none`}
                defaultValue="">
                <option value="" disabled>Select Service *</option>
                {services.map((s) => (
                  <option key={s} value={s} className="bg-navy-900">{s}</option>
                ))}
              </select>
              {errors.service && <p className={errorClass}>{errors.service.message}</p>}
            </div>

            {/* Message */}
            <div>
              <textarea {...register("message")} placeholder="Tell us about your situation (optional)"
                rows={4} className={`${inputClass} resize-none`} />
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white py-4 rounded-md font-body font-medium text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/20">
              {isSubmitting ? "Sending..." : "Send My Request →"}
            </button>

            <p className="text-center text-white/30 text-xs font-body">
              Your information is 100% confidential and never shared.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}