export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Account",
      description:
        "Sign up as an Admin or Team Lead and set up your workspace in seconds.",
    },
    {
      title: "Add & Configure Spaces",
      description:
        "Create seminar halls, meeting rooms or study areas and define capacity, timing and booking rules.",
    },
    {
      title: "Invite Team Members",
      description:
        "Share your workspace code and allow members to join and start booking instantly.",
    },
    {
      title: "Track & Optimize Usage",
      description:
        "Monitor bookings, peak hours and performance insights through analytics dashboard.",
    },
  ];

  return (
    <section id="how" className="bg-transparent py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          How <span className="text-emerald-600">SmartSpace</span> Works
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          Get started in just a few simple steps and transform how your organization manages shared spaces.
        </p>

        {/* Timeline */}
        <div className="relative">

          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-emerald-100 h-full"></div>

          <div className="space-y-16">

            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-center md:items-start ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Circle */}
                <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="mt-6 md:mt-0 md:w-1/2 md:px-10">
                  <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
