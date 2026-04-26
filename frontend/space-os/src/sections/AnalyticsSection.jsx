import { useState } from "react";

export default function AnalyticsSection() {
  const [autosendReports, setAutosendReports] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full space-y-8">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-500 mt-1">
            Track usage, revenue-driven space metrics, and system performance.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="bg-white p-6 rounded-2xl shadow border border-green-100">
          <h3 className="text-gray-500 text-sm">Total Bookings</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">1,280</p>
          <p className="text-xs text-gray-400 mt-2">24% increase vs last month</p>
        </article>

        <article className="bg-white p-6 rounded-2xl shadow border border-green-100">
          <h3 className="text-gray-500 text-sm">Avg Utilization</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">73%</p>
          <div className="relative h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-green-500 rounded-full" style={{ width: "73%" }} />
          </div>
        </article>

        <article className="bg-white p-6 rounded-2xl shadow border border-green-100">
          <h3 className="text-gray-500 text-sm">Active Communities</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">38</p>
          <p className="text-xs text-gray-400 mt-2">Steady compared to yesterday</p>
        </article>
      </div>

      <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Usage Trend</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Workspace Hours</span>
              <span className="font-semibold text-gray-800">1,980</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: "82%" }} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>New Members</span>
              <span className="font-semibold text-gray-800">120</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: "65%" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800">Top Spaces</h3>
          <ul className="mt-4 space-y-3 text-gray-700 text-sm">
            <li className="flex justify-between">
              <span>Conference Room B</span>
              <span className="font-semibold">92%</span>
            </li>
            <li className="flex justify-between">
              <span>Quiet Pods</span>
              <span className="font-semibold">86%</span>
            </li>
            <li className="flex justify-between">
              <span>Event Hall</span>
              <span className="font-semibold">80%</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800">Notable Insights</h3>
          <ul className="mt-4 list-disc list-inside text-gray-700 text-sm space-y-2">
            <li>Peak bookings occur on Wednesdays between 11 AM - 2 PM.</li>
            <li>“Study Room 3” has a 12% higher retention rate.</li>
            <li>70% of users prefer booking via mobile.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800">Analytics Settings</h3>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={autosendReports}
              onChange={(e) => setAutosendReports(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 text-sm">Auto-send weekly reports</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 text-sm">Dark theme for analytics panels</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={(e) => setShowAdvanced(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 text-sm">Show advanced metrics</span>
          </label>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Changes are live and only affect your current session display.
        </p>
      </div>

    </div>
  );
}
