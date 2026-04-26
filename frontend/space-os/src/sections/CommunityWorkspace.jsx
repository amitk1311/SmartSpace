import { useState, useEffect } from "react";
import { api, getCurrentUserId } from "../services/api";

export default function CommunityWorkspace({ community, onBack }) {
  const userId = getCurrentUserId();
  const isOwner = typeof community.ownerId === "object" 
    ? community.ownerId._id === userId 
    : community.ownerId === userId;
  
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [newRoom, setNewRoom] = useState({ name: "", capacity: "", amenities: "" });
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDeleteSpaceConfirm, setShowDeleteSpaceConfirm] = useState(null);

  const [spaceForm, setSpaceForm] = useState({
    name: "",
    description: "",
    type: "",
    capacity: "",
    openHour: "",
    openMinute: "",
    openPeriod: "AM",
    closeHour: "",
    closeMinute: "",
    closePeriod: "PM",
  });

  const spaceTypes = [
    "Cafeteria",
    "Lecture Hall",
    "Seminar Hall",
    "Open Ground",
    "Parking Area"
  ];

  const [bookingForm, setBookingForm] = useState({
    date: "",
    startHour: "",
    startMinute: "",
    startPeriod: "AM",
    endHour: "",
    endMinute: "",
    endPeriod: "PM",
  });

  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [dateBookings, setDateBookings] = useState([]);
  const [loadingDateBookings, setLoadingDateBookings] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    if (selectedSpace && bookingForm.date) {
      fetchDateBookings(selectedSpace._id, bookingForm.date);
    } else {
      setDateBookings([]);
    }
  }, [selectedSpace, bookingForm.date]);

  const fetchDateBookings = async (spaceId, dateStr) => {
    try {
      setLoadingDateBookings(true);
      const data = await api.bookings.getByDate(spaceId, dateStr);
      // Filter out cancelled bookings just in case
      setDateBookings((data || []).filter(b => b.status === "confirmed"));
    } catch (err) {
      console.error("Failed to fetch date bookings", err);
    } finally {
      setLoadingDateBookings(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const data = await api.spaces.list(community._id);
      setSpaces(data || []);
    } catch (err) {
      console.error("Failed to fetch spaces:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = ({ hour, minute, period }) => {
    if (!hour || !minute || !period) return "";
    return `${String(hour).padStart(2, "0")} : ${String(minute).padStart(2, "0")} ${period}`;
  };

  const to24Minutes = ({ hour, minute, period }) => {
    let h = Number(hour);
    if (h === 12) h = 0;
    if (period === "PM") h += 12;
    return h * 60 + Number(minute);
  };

  const handleCreateSpace = async () => {
    if (!spaceForm.name || !spaceForm.type || !spaceForm.capacity || !spaceForm.openHour || !spaceForm.closeHour) {
      alert("Please fill all required fields");
      return;
    }

    const openMinutes = to24Minutes({
      hour: spaceForm.openHour,
      minute: spaceForm.openMinute,
      period: spaceForm.openPeriod,
    });
    const closeMinutes = to24Minutes({
      hour: spaceForm.closeHour,
      minute: spaceForm.closeMinute,
      period: spaceForm.closePeriod,
    });

    if (closeMinutes <= openMinutes) {
      alert("Closing time must be after opening time");
      return;
    }

    const open = formatTime({
      hour: spaceForm.openHour,
      minute: spaceForm.openMinute,
      period: spaceForm.openPeriod,
    });
    const close = formatTime({
      hour: spaceForm.closeHour,
      minute: spaceForm.closeMinute,
      period: spaceForm.closePeriod,
    });

    try {
      const newSpace = await api.spaces.create(
        community._id,
        spaceForm.name,
        spaceForm.description,
        spaceForm.type,
        Number(spaceForm.capacity),
        open,
        close
      );
      setSpaces((prev) => [...prev, newSpace]);
      setSpaceForm({
        name: "",
        description: "",
        type: "",
        capacity: "",
        openHour: "",
        openMinute: "",
        openPeriod: "AM",
        closeHour: "",
        closeMinute: "",
        closePeriod: "PM",
      });
      setShowCreateSpaceModal(false);
      // Refetch to ensure backend is in sync
      await fetchSpaces();
    } catch (err) {
      alert(err.message || "Failed to create space");
    }
  };

  const handleDeleteSpace = async (spaceId) => {
    try {
      await api.spaces.delete(spaceId);
      setSpaces((prev) => prev.filter((s) => s._id !== spaceId));
      setShowDeleteSpaceConfirm(null);
      // Refetch to ensure backend is in sync
      await fetchSpaces();
    } catch (err) {
      alert(err.message || "Failed to delete space");
    }
  };

  const handleAddRoom = async () => {
    if (!newRoom.name || !newRoom.capacity) {
      alert("Please enter room name and capacity");
      return;
    }

    try {
      const amenitiesList = newRoom.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);

      await api.rooms.create(selectedSpace._id, newRoom.name, Number(newRoom.capacity), amenitiesList);

      // Refresh spaces to get updated room list
      await fetchSpaces();
      setNewRoom({ name: "", capacity: "", amenities: "" });
      setShowAddRoomModal(false);
    } catch (err) {
      alert(err.message || "Failed to add room");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await api.rooms.delete(roomId);
      await fetchSpaces();
    } catch (err) {
      alert(err.message || "Failed to delete room");
    }
  };

  const handleBookSpace = async () => {
    const isCafeteria = selectedSpace.type === "Cafeteria";

    if (!bookingForm.date || !bookingForm.startHour || (!isCafeteria && !bookingForm.endHour)) {
      setBookingError("Please fill all booking fields");
      return;
    }

    const startMinutes = to24Minutes({
      hour: bookingForm.startHour,
      minute: bookingForm.startMinute,
      period: bookingForm.startPeriod,
    });
    
    let endMinutes = 0;
    if (!isCafeteria) {
      endMinutes = to24Minutes({
        hour: bookingForm.endHour,
        minute: bookingForm.endMinute,
        period: bookingForm.endPeriod,
      });

      if (startMinutes >= endMinutes) {
        setBookingError("End time must be after start time");
        return;
      }
    }

    const startTime = formatTime({
      hour: bookingForm.startHour,
      minute: bookingForm.startMinute,
      period: bookingForm.startPeriod,
    });
    const endTime = isCafeteria ? startTime : formatTime({
      hour: bookingForm.endHour,
      minute: bookingForm.endMinute,
      period: bookingForm.endPeriod,
    });

    if (selectedSpace.type === "Cafeteria" && !selectedTable) {
      setBookingError("Please select a table from the grid");
      return;
    }

    try {
      await api.bookings.create(
        community._id,
        selectedSpace._id,
        null, // No room id
        selectedSpace.type === "Cafeteria" ? selectedTable : null,
        bookingForm.date,
        startTime,
        endTime
      );

      setBookingSuccess("Space booked successfully!");
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess("");
        setBookingForm({
          date: "",
          startHour: "",
          startMinute: "",
          startPeriod: "AM",
          endHour: "",
          endMinute: "",
          endPeriod: "PM",
        });
        setBookingError("");
        setSelectedSpace(null);
        setSelectedTable(null);
        // Refetch to ensure backend is in sync
        fetchSpaces();
      }, 1500);
    } catch (err) {
      setBookingError(err.message || "Failed to book space");
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading spaces...</p>
      </div>
    );
  }

  // Show booking modal if space is selected
  if (selectedSpace && showBookingModal) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 my-8">
          <h2 className="text-xl font-semibold mb-2">Book {selectedSpace.name}</h2>
          <p className="text-gray-600 text-sm mb-1">Type: {selectedSpace.type}</p>
          <p className="text-gray-600 text-sm mb-4">Available: {selectedSpace.open} - {selectedSpace.close}</p>
          
          {bookingError && <p className="text-red-600 text-sm mb-3">{bookingError}</p>}
          {bookingSuccess && <p className="text-green-600 text-sm mb-3">{bookingSuccess}</p>}

          {bookingForm.date && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Existing Bookings for {bookingForm.date}:</p>
              {loadingDateBookings ? (
                <p className="text-xs text-gray-500">Loading...</p>
              ) : dateBookings.length === 0 ? (
                <p className="text-xs text-green-600 font-medium">Space is completely free on this date!</p>
              ) : (
                <ul className="text-xs text-red-600 space-y-1">
                  {dateBookings.map((b) => (
                    <li key={b._id} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {b.startTime} - {b.endTime}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {selectedSpace.type === "Cafeteria" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Booking Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <div className="flex gap-2">
                  <select
                    value={bookingForm.startHour}
                    onChange={(e) => setBookingForm({ ...bookingForm, startHour: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="">HH</option>
                    {[...Array(12)].map((_, i) => {
                      const v = String(i + 1).padStart(2, "0");
                      return <option key={v} value={v}>{v}</option>;
                    })}
                  </select>
                  <select
                    value={bookingForm.startMinute}
                    onChange={(e) => setBookingForm({ ...bookingForm, startMinute: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="">MM</option>
                    {["00", "15", "30", "45"].map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={bookingForm.startPeriod}
                    onChange={(e) => setBookingForm({ ...bookingForm, startPeriod: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">End time is automatically set to 1 hour after start time.</p>
              </div>

              {bookingForm.date && bookingForm.startHour && bookingForm.startMinute && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Select a Table</label>
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded"></div> Available</span>
                      <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-600 rounded"></div> Booked</span>
                      <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 ring-1 ring-green-600 rounded"></div> Selected</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1">
                    {Array.from({ length: selectedSpace.capacity }, (_, i) => i + 1).map(tableNum => {
                      const startMinutes = to24Minutes({
                        hour: bookingForm.startHour,
                        minute: bookingForm.startMinute,
                        period: bookingForm.startPeriod,
                      });
                      const endMinutes = startMinutes + 60;
                      
                      const isBooked = dateBookings.some(b => {
                        if (b.tableNumber !== tableNum) return false;
                        const bStart = timeToMinutes(b.startTime);
                        const bEnd = timeToMinutes(b.endTime);
                        return startMinutes < bEnd && endMinutes > bStart;
                      });

                      const isSelected = selectedTable === tableNum;

                      return (
                        <button
                          key={tableNum}
                          onClick={() => !isBooked && setSelectedTable(tableNum)}
                          disabled={isBooked}
                          className={`w-full aspect-square rounded text-xs font-bold transition-all ${
                            isBooked 
                              ? "bg-green-600 text-white cursor-not-allowed opacity-90" 
                              : isSelected 
                                ? "bg-green-400 text-white ring-2 ring-green-600 shadow-md transform scale-105" 
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          }`}
                        >
                          {tableNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Booking Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <div className="flex gap-2">
                  <select
                    value={bookingForm.startHour}
                    onChange={(e) => setBookingForm({ ...bookingForm, startHour: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="">HH</option>
                    {[...Array(12)].map((_, i) => {
                      const v = String(i + 1).padStart(2, "0");
                      return (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={bookingForm.startMinute}
                    onChange={(e) => setBookingForm({ ...bookingForm, startMinute: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="">MM</option>
                    {["00", "15", "30", "45"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={bookingForm.startPeriod}
                    onChange={(e) => setBookingForm({ ...bookingForm, startPeriod: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <div className="flex gap-2">
                  <select
                    value={bookingForm.endHour}
                    onChange={(e) => setBookingForm({ ...bookingForm, endHour: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="">HH</option>
                    {[...Array(12)].map((_, i) => {
                      const v = String(i + 1).padStart(2, "0");
                      return (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={bookingForm.endMinute}
                    onChange={(e) => setBookingForm({ ...bookingForm, endMinute: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="">MM</option>
                    {["00", "15", "30", "45"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={bookingForm.endPeriod}
                    onChange={(e) => setBookingForm({ ...bookingForm, endPeriod: e.target.value })}
                    className="flex-1 border border-green-200 rounded-lg px-2 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>


            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setSelectedSpace(null);
                setSelectedTable(null);
                setShowBookingModal(false);
                setBookingError("");
                setBookingSuccess("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleBookSpace}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show spaces list
  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={onBack} className="text-green-600 mb-6 hover:underline">
        ← Back to Communities
      </button>

      <h1 className="text-3xl font-bold text-gray-800">{community.name}</h1>
      <p className="text-gray-500 mt-2">{community.description}</p>

      <div className="mt-8">
        {isOwner && (
          <button
            onClick={() => setShowCreateSpaceModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
          >
            + Create Space
          </button>
        )}
      </div>

      {/* Spaces Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {spaces.length === 0 ? (
          <div className="bg-white border border-green-100 rounded-2xl p-6 shadow text-gray-500">
            No spaces created yet.
          </div>
        ) : (
          spaces.map((space) => (
            <div
              key={space._id}
              className="bg-white p-6 rounded-2xl shadow border border-green-100"
            >
              <h3 className="text-lg font-semibold text-gray-800">{space.name}</h3>
              <p className="text-gray-500 mt-2">Type: {space.type || "N/A"}</p>
              <p className="text-gray-500">Capacity: {space.capacity}</p>
              <p className="text-gray-400 text-sm mt-2">
                Available: {space.open} - {space.close}
              </p>
              
              {space.todayBookings && space.todayBookings.length > 0 && (
                <div className="mt-3 mb-2 p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs font-semibold text-red-700 mb-1">Booked Today:</p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {space.todayBookings.map(b => (
                      <li key={b._id} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {b.startTime} - {b.endTime}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => {
                    setSelectedSpace(space);
                    setShowBookingModal(true);
                  }}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-medium"
                >
                  Book Space
                </button>
                {isOwner && (
                  <button
                    onClick={() => setShowDeleteSpaceConfirm(space._id)}
                    className="w-full mt-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Space Modal */}
      {showCreateSpaceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 my-8">
            <h2 className="text-xl font-semibold mb-4">Create Space</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Space Name"
                value={spaceForm.name}
                onChange={(e) => setSpaceForm({ ...spaceForm, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Description"
                value={spaceForm.description}
                onChange={(e) => setSpaceForm({ ...spaceForm, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <select
                value={spaceForm.type}
                onChange={(e) => setSpaceForm({ ...spaceForm, type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Space Type</option>
                {spaceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Capacity"
                value={spaceForm.capacity}
                onChange={(e) => setSpaceForm({ ...spaceForm, capacity: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium">Open Time</label>
                  <div className="flex gap-1">
                    <select
                      value={spaceForm.openHour}
                      onChange={(e) => setSpaceForm({ ...spaceForm, openHour: e.target.value })}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    >
                      <option value="">HH</option>
                      {[...Array(12)].map((_, i) => {
                        const v = String(i + 1).padStart(2, "0");
                        return (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={spaceForm.openMinute}
                      onChange={(e) => setSpaceForm({ ...spaceForm, openMinute: e.target.value })}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    >
                      <option value="">MM</option>
                      {["00", "15", "30", "45"].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={spaceForm.openPeriod}
                      onChange={(e) => setSpaceForm({ ...spaceForm, openPeriod: e.target.value })}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium">Close Time</label>
                  <div className="flex gap-1">
                    <select
                      value={spaceForm.closeHour}
                      onChange={(e) => setSpaceForm({ ...spaceForm, closeHour: e.target.value })}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    >
                      <option value="">HH</option>
                      {[...Array(12)].map((_, i) => {
                        const v = String(i + 1).padStart(2, "0");
                        return (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={spaceForm.closeMinute}
                      onChange={(e) => setSpaceForm({ ...spaceForm, closeMinute: e.target.value })}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    >
                      <option value="">MM</option>
                      {["00", "15", "30", "45"].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={spaceForm.closePeriod}
                      onChange={(e) => setSpaceForm({ ...spaceForm, closePeriod: e.target.value })}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateSpaceModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSpace}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Space Confirmation */}
      {showDeleteSpaceConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Space</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this space? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteSpaceConfirm(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSpace(showDeleteSpaceConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
