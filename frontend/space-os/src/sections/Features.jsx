export default function Stats() {
  const features = [
    {
      title: "Space Management",
      desc: "Create and manage various types of spaces including seminar halls, study rooms, and cafeteria seating.",
      icon: "🏢"
    },
    {
      title: "Real-time Booking",
      desc: "Book spaces in real-time with automatic availability updates and time limit management.",
      icon: "⏱️"
    },
    {
      title: "Analytics Dashboard",
      desc: "Get detailed insights into space utilization, booking patterns, and user activity.",
      icon: "📊"
    },
    {
      title: "Role-based Access",
      desc: "Team Heads can manage spaces and members, while members can book and view spaces.",
      icon: "👥"
    },
    {
      title: "Real-time Updates",
      desc: "Instant notifications when spaces become available or bookings are made/cancelled.",
      icon: "⚡"
    },
    {
      title: "Secure & Reliable",
      desc: "Built with security in mind, featuring authentication and secure data handling.",
      icon: "🛡️"
    }
  ];

  return (
    <section id="features" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Smart Space Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Powerful features designed specifically for educational institutions
            to optimize space utilization and enhance user experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {features.map((item, i) => (
            <div
              key={i}
              className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-emerald-100 text-2xl mb-6 group-hover:scale-110 transition">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
