import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 pt-24 sm:pt-28 pb-20 overflow-hidden">

      {/* background glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 blur-3xl opacity-30 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 blur-3xl opacity-30 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-start lg:items-center">

        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Manage Campus Spaces
            <span className="block text-emerald-600">Effortlessly</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
            SmartSpace helps universities and teams manage seminar halls,
            meeting rooms, study spaces and resources with real-time booking,
            analytics and smart automation.
          </p>

          {/* bullet points */}
          <div className="mt-8 space-y-3 text-gray-700 text-sm sm:text-base">
            <p>✔ Real-time availability tracking</p>
            <p>✔ Automated booking system</p>
            <p>✔ Time-limit enforcement</p>
          </div>

          {/* buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

            <Link
              to="/signup"
              className="px-7 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
            >
              Get Started Free →
            </Link>

            <Link
              to="/login"
              className="px-7 py-3 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Sign In
            </Link>

          </div>
        </div>

        {/* RIGHT DASHBOARD PREVIEW */}
        <div className="relative mt-12 lg:mt-0">

          {/* card 1 */}
          <div className="bg-white rounded-xl shadow-xl p-4 mb-4 hover:scale-[1.02] transition">

            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Seminar Hall A</h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                Available
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">Capacity: 100</p>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="w-1/3 h-2 bg-emerald-500 rounded-full"></div>
            </div>
          </div>

          {/* card 2 */}
          <div className="bg-white rounded-xl shadow-xl p-4 mb-4 hover:scale-[1.02] transition">

            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Study Room 3</h3>
              <span className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
                In Use
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">Capacity: 8</p>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="w-4/5 h-2 bg-yellow-500 rounded-full"></div>
            </div>
          </div>

          {/* card 3 */}
          <div className="bg-white rounded-xl shadow-xl p-4 hover:scale-[1.02] transition">

            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Meeting Room 2</h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                Reserved
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">Capacity: 12</p>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="w-full h-2 bg-emerald-500 rounded-full"></div>
            </div>
          </div>

          {/* bottom detail boxes (match screenshot layout) */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* box 1: activity */}
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 border border-emerald-50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                    Today&apos;s Activity
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Building: Beta</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">247</p>
                  <p className="text-xs text-gray-500 mt-1">Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-500">89</p>
                  <p className="text-xs text-gray-500 mt-1">In Use</p>
                </div>
              </div>
            </div>

            {/* box 2: mini stats */}
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 border border-emerald-50">
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 text-lg">
                    ⚡
                  </div>
                  <p className="font-semibold text-gray-800">85%</p>
                  <p className="text-[11px] text-gray-500">Faster Booking</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 text-lg">
                    📊
                  </div>
                  <p className="font-semibold text-gray-800">24/7</p>
                  <p className="text-[11px] text-gray-500">Real-time Sync</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 text-lg">
                    👥
                  </div>
                  <p className="font-semibold text-gray-800">1K+</p>
                  <p className="text-[11px] text-gray-500">Active Users</p>
                </div>
              </div>
            </div>
          </div>

      </div>
      </div>

      </section>
  );
}
