import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearAuth } from "../services/api";
import Sidebar from "../components/Sidebar";
import DashboardHome from "../sections/DashboardHome";
import CommunitySection from "../sections/CommunitySection";
import AnalyticsSection from "../sections/AnalyticsSection";
import SettingsSection from "../sections/SettingsSection";
import BookingHistory from "../pages/BookingHistory";

export default function DashboardLayout() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch communities on component mount and whenever active changes
    fetchCommunities();
    fetchNotifications();
  }, [active]);

  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.list();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleMarkRead = async () => {
    try {
      await api.notifications.markRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const data = await api.communities.list();
      console.log("Fetched communities:", data);
      setCommunities(data || []);
    } catch (err) {
      console.error("Failed to fetch communities:", err);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = (community) => {
    setCommunities((prev) => [community, ...prev]);
    setActive("Community");
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    setActive("Dashboard");
    setCommunities([]);
    clearAuth();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white via-green-50 to-green-100">

      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* Header */}
        <div className="sticky top-0 z-40 h-14 md:h-16 bg-white/95 backdrop-blur-sm border-b border-green-100 flex items-center justify-between px-4 md:px-8 shadow-sm">

          {/* Left Section */}
          <div className="flex items-center gap-4 min-w-0">

            {/* Hamburger (Mobile Only) */}
            <button
              className="md:hidden bg-green-600 text-white p-2 rounded-lg flex items-center justify-center"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>

            {/* Page Title */}
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
              {active}
            </h1>

          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0 relative">

            <button
              onClick={() => {
                setShowNotifications((s) => !s);
              }}
              className="text-gray-600 hover:text-green-600 transition text-sm md:text-base relative"
            >
              🔔
              {notifications.some(n => !n.isRead) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <div className="w-8 h-8 md:w-9 md:h-9 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              A
            </div>

          </div>
        </div>

        <div className="relative">
          {showNotifications && (
            <div className="absolute right-4 top-4 z-50 w-80 bg-white border border-green-100 shadow-xl rounded-2xl p-0 overflow-hidden animate-fadeIn">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                {notifications.some(n => !n.isRead) && (
                  <button 
                    onClick={handleMarkRead}
                    className="text-xs text-green-600 hover:text-green-800 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 p-6 text-center">No new notifications yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {notifications.map(n => (
                      <li key={n._id} className={`p-4 hover:bg-gray-50 transition ${!n.isRead ? "bg-green-50/50" : ""}`}>
                        <p className={`text-sm ${!n.isRead ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 px-3 py-8 md:px-6">

          {active === "Dashboard" && (
            <DashboardHome
              communities={communities}
              onCreateCommunity={handleCreateCommunity}
            />
          )}

          {active === "Community" && (
            <CommunitySection
              communities={communities}
              onCreateCommunity={handleCreateCommunity}
            />
          )}

          {active === "Bookings" && <BookingHistory />}

          {active === "Analytics" && <AnalyticsSection />}

          {active === "Settings" && <SettingsSection />}

        </div>

      </div>
    </div>
  );
}