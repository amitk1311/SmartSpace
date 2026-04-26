import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter email");
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <section className="py-24 bg-transparent">

      <div className="max-w-4xl mx-auto text-center px-6">

        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Stay Updated with SmartSpace
        </h2>

        <p className="text-gray-600 mb-10">
          Get the latest features, updates, and campus space management tips.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <button
            type="submit"
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            Subscribe
          </button>
        </form>

        {/* Note */}
        <p className="text-sm text-gray-500 mt-6">
          No spam. Unsubscribe anytime.
        </p>

      </div>
    </section>
  );
}
