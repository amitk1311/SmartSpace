import { useState } from "react";

export default function AddSpaceModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");

  const spaceTypes = [
    "Cafeteria",
    "Lecture Hall",
    "Seminar Hall",
    "Open Ground",
    "Parking Area"
  ];

  const [startHour, setStartHour] = useState("09");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");

  const [endHour, setEndHour] = useState("05");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState("PM");

  const hours = [
    "01","02","03","04","05","06",
    "07","08","09","10","11","12"
  ];

  const minutes = [
    "00","05","10","15","20","25",
    "30","35","40","45","50","55"
  ];

  const handleSubmit = () => {
    if (!name || !type || !capacity) return;

    const space = {
      id: Date.now(),
      name,
      type,
      capacity,
      startTime: `${startHour}:${startMinute} ${startPeriod}`,
      endTime: `${endHour}:${endMinute} ${endPeriod}`,
      status: "available"
    };

    onCreate(space);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-xl">

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6">
          Add Space
        </h2>

        {/* Space Name */}
        <input
          type="text"
          placeholder="Space Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-green-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-green-500"
        />

        {/* Space Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-green-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-green-500"
        >
          <option value="">Select Space Type</option>
          {spaceTypes.map((spaceType) => (
            <option key={spaceType} value={spaceType}>
              {spaceType}
            </option>
          ))}
        </select>

        {/* Capacity */}
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full border border-green-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-green-500"
        />

        {/* Time Section */}
        <div className="flex flex-col gap-6 mb-6">

          {/* Open Time */}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Open Time
            </p>

            <div className="flex flex-wrap items-center gap-3 bg-gray-50 border border-green-200 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 min-w-[10rem] flex-1">
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-16 min-w-[4rem] bg-transparent outline-none"
                >
                  {hours.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>

                <span className="text-gray-400">:</span>

                <select
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  className="w-16 min-w-[4rem] bg-transparent outline-none"
                >
                  {minutes.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <select
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
                className="w-20 min-w-[4.5rem] bg-green-50 border border-green-200 rounded-lg px-2 py-1"
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

          {/* Close Time */}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Close Time
            </p>

            <div className="flex flex-wrap items-center gap-3 bg-gray-50 border border-green-200 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 min-w-[10rem] flex-1">
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="w-16 min-w-[4rem] bg-transparent outline-none"
                >
                  {hours.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>

                <span className="text-gray-400">:</span>

                <select
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  className="w-16 min-w-[4rem] bg-transparent outline-none"
                >
                  {minutes.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <select
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value)}
                className="w-20 min-w-[4.5rem] bg-green-50 border border-green-200 rounded-lg px-2 py-1"
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Create
          </button>

        </div>

      </div>
    </div>
  );
}