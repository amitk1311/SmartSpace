import { useState } from "react";

export default function SettingsSection() {
  const [notifications, setNotifications] = useState(true);
  const [updates, setUpdates] = useState(false);

  return (
    <div className="w-full space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <p className="text-gray-500">Configure your SmartSpace experience.</p>

      <div className="bg-white p-6 rounded-2xl shadow border border-green-100 space-y-5">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-gray-700">Email notifications</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={updates}
            onChange={(e) => setUpdates(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-gray-700">Receive product updates</span>
        </label>

        <p className="text-sm text-gray-500">
          Settings are saved locally in this session. Implement persistence to backend for permanent storage.
        </p>
      </div>
    </div>
  );
}
