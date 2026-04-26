import { useState, useEffect } from "react";
import { api, getCurrentUserId } from "../services/api";
import CreateCommunityModal from "../components/CreateCommunityModal";

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(/\s+/);
  if (parts.length < 4) return 0;
  const hour = parts[0];
  const minute = parts[2];
  const period = parts[3];
  let h = Number(hour);
  if (h === 12) h = 0;
  if (period === "PM") h += 12;
  return h * 60 + Number(minute);
};

export default function DashboardHome() {
  const userId = getCurrentUserId();
  const [allCommunities, setAllCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [dashboardSpaces, setDashboardSpaces] = useState([]);
  const [dashboardBookings, setDashboardBookings] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [createError, setCreateError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [communities, dashboardData] = await Promise.all([
        api.communities.list(),
        api.dashboard.get()
      ]);
      
      setAllCommunities(communities || []);
      
      const joined = (communities || []).filter((c) =>
        c.members && c.members.some((m) => m._id === userId || m === userId)
      );
      setJoinedCommunities(joined);
      
      if (dashboardData) {
        setDashboardSpaces(dashboardData.spaces || []);
        setDashboardBookings(dashboardData.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    setCreateError("");
  };
  const closeCreateModal = () => setShowCreateModal(false);

  const handleCreateCommunity = async (community) => {
    try {
      const newCommunity = await api.communities.create(
        community.name,
        community.code,
        community.description,
        "General"
      );
      setAllCommunities((prev) => [newCommunity, ...prev]);
      setJoinedCommunities((prev) => [newCommunity, ...prev]);
      closeCreateModal();
      fetchData(); // Refresh dashboard data
    } catch (err) {
      setCreateError(err.message || "Failed to create community");
    }
  };

  const openJoinModal = () => {
    setShowJoinModal(true);
    setJoinName("");
    setJoinCode("");
    setJoinError("");
  };

  const closeJoinModal = () => setShowJoinModal(false);

  const handleJoin = async () => {
    const name = joinName.trim();
    const code = joinCode.trim().toUpperCase();

    if (!name || !code) {
      setJoinError("Please enter community name and code.");
      return;
    }

    const community = allCommunities.find(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.code === code
    );

    if (!community) {
      setJoinError("Community not found with given name/code.");
      return;
    }

    if (joinedCommunities.some((c) => c._id === community._id)) {
      setJoinError("Already joined this community.");
      return;
    }

    try {
      await api.communities.join(community._id);
      setJoinedCommunities((prev) => [...prev, community]);
      closeJoinModal();
      fetchData(); // Refresh dashboard data
    } catch (err) {
      setJoinError(err.message || "Failed to join community");
    }
  };

  // Compute derived data
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const spacesWithStatus = dashboardSpaces.map(space => {
    const activeBooking = dashboardBookings.find(b => {
      if ((b.spaceId?._id || b.spaceId) !== space._id) return false;
      const startMins = timeToMinutes(b.startTime);
      const endMins = timeToMinutes(b.endTime);
      return currentMinutes >= startMins && currentMinutes < endMins;
    });
    return { ...space, inUse: !!activeBooking, currentBooking: activeBooking };
  });

  const activeSessionsCount = spacesWithStatus.filter(s => s.inUse).length;
  const availableSpacesCount = spacesWithStatus.length - activeSessionsCount;

  // Simple recent feed (last 3 bookings)
  const recentBookings = [...dashboardBookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="space-y-12">

      {/* QUICK ACTIONS FIRST */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={openCreateModal}
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
          >
            Create Community
          </button>

          <button
            onClick={openJoinModal}
            className="border border-green-600 text-green-600 px-6 py-3 rounded-xl hover:bg-green-50 transition"
          >
            Join Community
          </button>
        </div>

        {showCreateModal && (
          <CreateCommunityModal
            onClose={closeCreateModal}
            onCreate={handleCreateCommunity}
            existingCommunities={allCommunities}
          />
        )}

        {createError && (
          <p className="text-sm text-red-600 mt-3">{createError}</p>
        )}

        {showJoinModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Join Community</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={joinName}
                  onChange={(e) => {
                    setJoinName(e.target.value);
                    setJoinError("");
                  }}
                  placeholder="Community Name"
                  className="w-full border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-400 outline-none rounded-lg px-4 py-3"
                />
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value);
                    setJoinError("");
                  }}
                  placeholder="Community Code"
                  className="w-full border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-400 outline-none rounded-lg px-4 py-3"
                />
                {joinError && <p className="text-sm text-red-600">{joinError}</p>}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeJoinModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoin}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* REAL-TIME GRID */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Real-Time Space Grid
        </h2>

        {spacesWithStatus.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow border border-green-100 text-gray-500">
            No spaces found. Join or create a community and add spaces.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {spacesWithStatus.map((space) => {
              const capacityPercent = space.inUse ? 100 : 0; // Simple representation
              
              return (
                <div key={space._id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 border border-green-100">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-semibold">{space.name}</h3>
                    <span className={`text-sm font-medium ${space.inUse ? "text-yellow-600" : "text-green-600"}`}>
                      {space.inUse ? "In Use" : "Available"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Community: {space.communityId?.name}</p>
                  <p className="text-sm text-gray-500 mb-3">Capacity: {space.capacity}</p>
                  
                  {space.inUse && space.currentBooking && (
                    <p className="text-xs text-gray-400 mb-3">
                      Booked until {space.currentBooking.endTime}
                    </p>
                  )}
                  
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${space.inUse ? "bg-yellow-500" : "bg-green-500"}`} 
                      style={{ width: `${space.inUse ? 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DAILY ACTIVITY */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Daily Activity
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border border-green-100">
            <h3 className="text-gray-500 text-sm">Active Sessions</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{activeSessionsCount}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-green-100">
            <h3 className="text-gray-500 text-sm">Available Spaces</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{availableSpacesCount}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-green-100">
            <h3 className="text-gray-500 text-sm">Total Today's Bookings</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {dashboardBookings.length}
            </p>
          </div>
        </div>
      </div>

      {/* RECENT FEED */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Feed</h2>
        <div className="bg-white p-6 rounded-2xl shadow border border-green-100">
          {recentBookings.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent bookings today.</p>
          ) : (
            <ul className="space-y-4 text-gray-700 text-sm">
              {recentBookings.map((booking, index) => (
                <li key={booking._id} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700 text-xs">
                    {index + 1}
                  </span>
                  <div>
                    <span className="block">
                      Booking created for <strong>{booking.spaceId?.name || "a space"}</strong>
                    </span>
                    <span className="text-xs text-gray-400">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
}