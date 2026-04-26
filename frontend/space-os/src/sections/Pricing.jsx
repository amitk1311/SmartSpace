export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      desc: "Best for small teams getting started",
      highlight: false,
      features: [
        "Up to 50 users",
        "20 spaces",
        "Basic analytics",
        "Email support",
        "Community access",
      ],
      button: "Get Started",
    },
    {
      name: "Professional",
      price: "₹499/mo",
      desc: "Perfect for growing institutions",
      highlight: true,
      features: [
        "Up to 200 users",
        "Unlimited spaces",
        "Advanced analytics",
        "Priority support",
        "Real-time booking system",
        "Team role management",
      ],
      button: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For large organizations",
      highlight: false,
      features: [
        "Unlimited users",
        "Unlimited spaces",
        "Custom analytics",
        "Dedicated manager",
        "API access",
        "Custom integrations",
      ],
      button: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-transparent px-6">
      <div className="max-w-7xl mx-auto text-center">

        {/* Title */}
        <h2 className="text-4xl font-bold mb-4">
          Simple <span className="text-emerald-600">Pricing</span>
        </h2>
        <p className="text-gray-600 mb-16">
          Choose the perfect plan for your institution
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 transition transform hover:-translate-y-2
              ${
                plan.highlight
                  ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-2xl scale-105"
                  : "bg-white shadow-lg"
              }`}
            >

              {/* Badge */}
              {plan.highlight && (
                <div className="mb-4 inline-block px-3 py-1 text-xs font-semibold bg-yellow-300 text-black rounded-full">
                  MOST POPULAR
                </div>
              )}

              {/* Name */}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="text-4xl font-bold mb-2">{plan.price}</div>

              {/* Desc */}
              <p
                className={`mb-6 ${
                  plan.highlight ? "text-emerald-100" : "text-gray-500"
                }`}
              >
                {plan.desc}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">

                    {/* Tick Icon */}
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                      ${
                        plan.highlight
                          ? "bg-white text-emerald-600"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`w-full py-3 rounded-xl font-semibold transition
                ${
                  plan.highlight
                    ? "bg-white text-emerald-600 hover:bg-gray-100"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
