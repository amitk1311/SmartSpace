import { useState } from "react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How fast setup?",
      summary: "Ready to launch in under 5 minutes.",
      details:
        "SmartSpace is built for fast onboarding — create your first community, add spaces, and start booking immediately without complicated setup."
    },
    {
      question: "Large universities supported?",
      summary: "Yes — built to scale.",
      details:
        "The platform supports campus-wide deployments with multiple buildings, departments, and thousands of users while keeping performance smooth."
    },
    {
      question: "Integrations?",
      summary: "Google, Microsoft, and more.",
      details:
        "Connect with existing campus tools, calendar platforms, and collaboration suites so bookings work with the systems your students already use."
    },
    {
      question: "Support?",
      summary: "24/7 priority assistance.",
      details:
        "Get fast answers from our support team through chat, email, or guided onboarding — ideal for high-demand campus communities."
    },
    {
      question: "Is data secure?",
      summary: "Encrypted, audited, and protected.",
      details:
        "We use modern encryption, access controls, and audit logging to keep your campus data safe and compliant."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50">

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-[0.3em] mb-3">
            Need answers?
          </p>
          <h2 className="text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mt-4">
            Discover how SmartSpace helps universities launch communities fast, keep bookings secure, and scale with campus demand.
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <button
                key={faq.question}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`group w-full text-left rounded-3xl border transition shadow-sm ${
                  isOpen ? "border-green-200 bg-white shadow-lg" : "border-transparent bg-white/80 hover:border-green-200"
                } p-6 flex flex-col gap-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-gray-900">{faq.question}</p>
                    <p className="mt-2 text-sm text-gray-600">{faq.summary}</p>
                  </div>
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                      isOpen ? "border-green-600 bg-green-600 text-white" : "border-green-200 bg-white text-green-600 group-hover:border-green-600"
                    }`}
                  >
                    <span className="text-lg font-bold leading-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </span>
                </div>

                {isOpen && (
                  <div className="text-sm text-gray-600 leading-7 border-t border-green-100 pt-4 mt-2">
                    {faq.details}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
}
