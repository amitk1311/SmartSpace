import { useState, useEffect } from "react";
import { api, getCurrentUserId } from "../services/api";
import CreateCommunityModal from "../components/CreateCommunityModal";
import CommunityWorkspace from "./CommunityWorkspace";

export default function CommunitySection({ communities = [] }) {
  const userId = getCurrentUserId();
  const [tab, setTab] = useState("created");
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [localCommunities, setLocalCommunities] = useState([]);
  const [createdCommunities, setCreatedCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch communities from backend when component mounts
    fetchCommunitiesFromBackend();
  }, []);

  const fetchCommunitiesFromBackend = async () => {
    try {
      setLoading(true);
      const data = await api.communities.list();
      console.log("CommunitySection fetched:", data);
      filterCommunities(data || []);
    } catch (err) {
      console.error("Failed to fetch communities:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Also filter when communities prop changes
    if (communities.length > 0) {
      filterCommunities(communities);
    }
  }, [communities]);

  const filterCommunities = (communitiesData) => {
    setLocalCommunities(communitiesData);
    
    const created = communitiesData.filter((c) => {
      const ownerId = typeof c.ownerId === "object" ? c.ownerId._id : c.ownerId;
      return ownerId === userId;
    });
    
    const joined = communitiesData.filter((c) => {
      const ownerId = typeof c.ownerId === "object" ? c.ownerId._id : c.ownerId;
      if (ownerId === userId) return false; // Don't show owned communities in joined
      
      if (!c.members) return false;
      const isMember = c.members.some(
        (m) => (typeof m === "object" ? m._id : m) === userId
      );
      return isMember;
    });
    
    setCreatedCommunities(created);
    setJoinedCommunities(joined);
    setLoading(false);
  };

  const handleCreate = async (newCommunity) => {
    try {
      const created = await api.communities.create(
        newCommunity.name,
        newCommunity.code,
        newCommunity.description,
        "General"
      );
      setLocalCommunities((prev) => [created, ...prev]);
      setCreatedCommunities((prev) => [created, ...prev]);
      setShowModal(false);
      // Refetch to ensure backend is in sync
      fetchCommunitiesFromBackend();
    } catch (err) {
      alert(err.message || "Failed to create community");
    }
  };

  const handleJoin = async () => {
    const name = joinName.trim();
    const code = joinCode.trim().toUpperCase();

    if (!name || !code) {
      setJoinError("Please enter name and community code.");
      return;
    }

    const community = localCommunities.find(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.code === code
    );

    if (!community) {
      setJoinError("Community not found with given name/code.");
      return;
    }

    const ownerId = typeof community.ownerId === "object" ? community.ownerId._id : community.ownerId;
    if (ownerId === userId) {
      setJoinError("You already own this community.");
      return;
    }

    const isMember = community.members && community.members.some(
      (m) => (typeof m === "object" ? m._id : m) === userId
    );

    if (isMember) {
      setJoinError("Already a member of this community.");
      return;
    }

    try {
      await api.communities.join(community._id);
      setJoinedCommunities((prev) => [...prev, community]);
      setJoinName("");
      setJoinCode("");
      setJoinError("");
      setShowJoinModal(false);
      // Refetch to ensure backend is in sync
      fetchCommunitiesFromBackend();
    } catch (err) {
      setJoinError(err.message || "Failed to join community");
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      await api.communities.leave(communityId);
      setJoinedCommunities((prev) => prev.filter((c) => c._id !== communityId));
      // Refetch to ensure backend is in sync
      fetchCommunitiesFromBackend();
    } catch (err) {
      alert(err.message || "Failed to leave community");
    }
  };

  const handleDeleteCommunity = async (communityId) => {
    try {
      await api.communities.delete(communityId);
      setCreatedCommunities((prev) => prev.filter((c) => c._id !== communityId));
      setLocalCommunities((prev) => prev.filter((c) => c._id !== communityId));
      setShowDeleteConfirm(null);
      // Refetch to ensure backend is in sync
      fetchCommunitiesFromBackend();
    } catch (err) {
      alert(err.message || "Failed to delete community");
    }
  };

  if (selectedCommunity) {
    return (
      <CommunityWorkspace
        community={selectedCommunity}
        onBack={() => setSelectedCommunity(null)}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Community</h1>
          <p className="text-gray-500 mt-1">
            Manage your created and joined communities
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="border border-green-600 text-green-600 px-6 py-3 rounded-xl hover:bg-green-50 transition"
          >
            Join Community
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
          >
            + Create Community
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-green-100 mb-6">
        <button
          onClick={() => setTab("created")}
          className={`pb-3 font-semibold transition ${
            tab === "created"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Created Communities
        </button>

        <button
          onClick={() => setTab("joined")}
          className={`pb-3 font-semibold transition ${
            tab === "joined"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Joined Communities
        </button>
      </div>

      {/* Created Communities Tab */}
      {tab === "created" && (
        <div className="space-y-4">
          {createdCommunities.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow border border-green-100 text-gray-500">
              You haven't created any community yet.
            </div>
          ) : (
            createdCommunities.map((community) => (
              <div
                key={community._id}
                className="bg-white p-6 rounded-2xl shadow border border-green-100 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => setSelectedCommunity(community)}
                    className="flex-1 cursor-pointer hover:opacity-80 transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {community.name}
                    </h3>

                    {community.description && (
                      <p className="text-gray-500 mt-2">
                        {community.description}
                      </p>
                    )}

                    <p className="text-sm text-gray-400 mt-3">
                      Code: {community.code} | Members: {community.members?.length || 0}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowDeleteConfirm(community._id)}
                    className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Joined Communities Tab */}
      {tab === "joined" && (
        <div className="space-y-4">
          {joinedCommunities.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow border border-green-100 text-gray-500">
              You haven't joined any community yet.
            </div>
          ) : (
            joinedCommunities.map((community) => (
              <div
                key={community._id}
                className="bg-white p-6 rounded-2xl shadow border border-green-100 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => setSelectedCommunity(community)}
                    className="flex-1 cursor-pointer hover:opacity-80 transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {community.name}
                    </h3>

                    {community.description && (
                      <p className="text-gray-500 mt-2">
                        {community.description}
                      </p>
                    )}

                    <p className="text-sm text-gray-400 mt-3">
                      Code: {community.code} | Members: {community.members?.length || 0}
                    </p>
                  </div>

                  <button
                    onClick={() => handleLeaveCommunity(community._id)}
                    className="ml-4 px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-sm hover:bg-orange-200 transition whitespace-nowrap"
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Community Modal */}
      {showModal && (
        <CreateCommunityModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Join Community Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
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
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinName("");
                  setJoinCode("");
                  setJoinError("");
                }}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Delete Community</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this community? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCommunity(showDeleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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
