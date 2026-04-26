export default function Sidebar({
  active,
  setActive,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}) {
  const menu = ["Dashboard", "Community", "Bookings", "Analytics", "Settings"];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0
          z-50
          w-64
          h-screen
          bg-white
          border-r border-green-100
          shadow-md md:shadow-none
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:flex-shrink-0
        `}
      >
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="h-16 flex items-center px-6 text-2xl font-bold text-green-600 border-b border-green-100">
            SmartSpace
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menu.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActive(item);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    active === item
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-700 hover:bg-green-50"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-green-100">
            <button
              onClick={onLogout}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}