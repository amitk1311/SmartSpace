import { useEffect, useState } from "react";

function Counter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = end / (duration / 16);

    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [end]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const stats = [
    {
      label: "Spaces Managed",
      value: 500,
      suffix: "+",
      color: "from-emerald-500 to-teal-600",
      percent: 80
    },
    {
      label: "Active Users",
      value: 1000,
      suffix: "+",
      color: "from-purple-500 to-pink-500",
      percent: 90
    },
    {
      label: "Universities",
      value: 50,
      suffix: "+",
      color: "from-emerald-500 to-teal-500",
      percent: 60
    },
    {
      label: "System Uptime",
      value: 99,
      suffix: ".9%",
      color: "from-orange-500 to-red-500",
      percent: 99
    }
  ];

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">

        {/* heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Trusted Performance Metrics
          </h2>
          <p className="text-gray-600 text-lg">
            Real numbers showing SmartSpace impact across campuses
          </p>
        </div>

        {/* cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition group"
            >
              {/* value */}
              <h3 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                <Counter end={stat.value} suffix={stat.suffix} />
              </h3>

              {/* label */}
              <p className="text-gray-600 font-medium mb-6">
                {stat.label}
              </p>

              {/* progress bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                  style={{ width: stat.percent + "%" }}
                ></div>
              </div>

              {/* percentage text */}
              <div className="text-sm text-gray-500 mt-2">
                {stat.percent}% growth
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
