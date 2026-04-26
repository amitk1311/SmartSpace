import { useState, useEffect } from "react";
import { api, getCurrentUserId } from "../services/api";

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

export default function BookingHistory() {
  const userId = getCurrentUserId();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, upcoming, past, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.bookings.list(userId);
      console.log("Fetched bookings:", data);
      setBookings(data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await api.bookings.cancel(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  const isBookingPast = (booking) => {
    const now = new Date();
    const bookingDate = new Date(booking.bookingDate);
    // Add the start time minutes to the booking date (which is at midnight)
    const startMins = timeToMinutes(booking.startTime);
    bookingDate.setHours(Math.floor(startMins / 60), startMins % 60, 0, 0);
    return bookingDate < now;
  };

  const filterBookings = () => {
    return bookings.filter((booking) => {
      const isPast = isBookingPast(booking);
      const isCancelled = booking.status === "cancelled";
      const isConfirmed = booking.status === "confirmed";

      switch (filter) {
        case "upcoming":
          return !isPast && isConfirmed;
        case "past":
          return isPast && isConfirmed;
        case "cancelled":
          return isCancelled;
        case "all":
        default:
          return true;
      }
    });
  };

  const filteredBookings = filterBookings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "all"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "upcoming"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("past")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "past"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Past
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "cancelled"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow">
          <p className="text-gray-600 text-lg">
            {filter === "all"
              ? "No bookings found."
              : `No ${filter} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isPast = isBookingPast(booking);
            return (
              <div
                key={booking._id}
                className={`bg-white rounded-2xl p-6 shadow border-l-4 ${
                  booking.status === "cancelled"
                    ? "border-l-red-600 opacity-60"
                    : isPast
                    ? "border-l-purple-600"
                    : "border-l-blue-600"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {booking.spaceId?.name || "Unknown Space"}
                    </h2>
                    {booking.roomName && (
                      <p className="text-gray-600 mt-1">Room: {booking.roomName}</p>
                    )}
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${
                      booking.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : isPast
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {booking.status === "cancelled"
                      ? "Cancelled"
                      : isPast
                      ? "Past"
                      : "Upcoming"}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Date</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Time</p>
                    <p className="text-gray-900 font-semibold">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Community</p>
                    <p className="text-gray-900 font-semibold">
                      {booking.communityId?.name || "Unknown Community"}
                    </p>
                  </div>
                </div>

                {booking.status === "confirmed" && !isPast && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
