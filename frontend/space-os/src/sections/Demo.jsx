export default function Demo() {
  return (
    <section className="relative overflow-hidden py-20">

      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-green-50 to-emerald-100"></div>

      {/* CURVED GREEN SHAPE */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-green-200 opacity-40 blur-3xl -z-10"></div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          See SmartSpace in Action
        </h2>

        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Experience how SmartSpace transforms campus space management with our
          interactive demo. No signup required.
        </p>

        {/* FEATURE LIST */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10 text-left md:text-center">
          {[
            "Interactive dashboard preview",
            "Real-time booking simulation",
            "Analytics and reporting demo",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 justify-center">
              <span className="text-green-600 text-xl">✔</span>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-7 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-green-500 to-green-600 shadow-md hover:scale-105 transition">
            Start Live Demo
          </button>

          <button className="px-7 py-3 rounded-lg border border-green-600 text-green-700 font-medium hover:bg-green-50 transition">
            Watch Video
          </button>
        </div>

        {/* DEMO CARD */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg max-w-xl mx-auto p-6 text-left">

          <div className="flex gap-2 mb-4">
            <span className="w-3 h-3 bg-red-400 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-green-400 rounded-full"></span>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="font-semibold text-green-700">Demo Mode Active</p>
            <p className="text-sm text-gray-500">
              Experience SmartSpace features in real-time
            </p>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Demo Progress</span>
            <span>75%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="w-[75%] h-2 bg-green-600 rounded-full"></div>
          </div>

        </div>
      </div>
    </section>
  );
}