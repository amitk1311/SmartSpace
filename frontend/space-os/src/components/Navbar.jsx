import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <a
          href="#home"
          onClick={closeMenu}
          className="text-2xl font-bold text-emerald-600"
        >
          SmartSpace
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">

          <a href="#features" className="hover:text-emerald-600 transition">Features</a>
          <a href="#how" className="hover:text-emerald-600 transition">How It Works</a>
          <a href="#pricing" className="hover:text-emerald-600 transition">Pricing</a>
          <a href="#faq" className="hover:text-emerald-600 transition">FAQ</a>

          <Link to="/login" className="hover:text-emerald-600 transition">
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="flex flex-col px-6 py-5 gap-4 font-medium text-gray-700">

            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how" onClick={closeMenu}>How It Works</a>
            <a href="#pricing" onClick={closeMenu}>Pricing</a>
            <a href="#faq" onClick={closeMenu}>FAQ</a>

            <Link to="/login" onClick={closeMenu} className="pt-2 border-t">
              Login
            </Link>

            <Link
              to="/signup"
              onClick={closeMenu}
              className="bg-emerald-600 text-white text-center py-3 rounded-lg mt-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
