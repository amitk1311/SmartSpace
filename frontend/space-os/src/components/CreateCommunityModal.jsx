import { useState } from "react";

export default function CreateCommunityModal({ onClose, onCreate, existingCommunities = [] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedCode = code.trim();

    if (!trimmedName) {
      setError("Please enter a community name.");
      return;
    }

    if (!trimmedCode) {
      setError("Please enter a community code.");
      return;
    }

    const normalizedCode = trimmedCode.toUpperCase();
    if (!/^[A-Z0-9]{4,}$/.test(normalizedCode)) {
      setError("Community code must be at least 4 letters or numbers.");
      return;
    }

    const isDuplicateName = existingCommunities.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicateName) {
      setError("Community name already exists. Please choose another.");
      return;
    }

    const newCommunity = {
      name: trimmedName,
      code: normalizedCode,
      description,
    };

    onCreate(newCommunity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 animate-fadeIn">

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Create Community
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Community Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            className="w-full border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-400 outline-none rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Community Code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            className="w-full border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-400 outline-none rounded-lg px-4 py-3"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-400 outline-none rounded-lg px-4 py-3"
          />

        </div>

        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Create
          </button>

        </div>
      </div>
    </div>
  );
}