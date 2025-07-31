import React, { useEffect, useState } from "react";
import { MdOutlineSwapVert } from "react-icons/md";
import { initPermaweb } from "../../lib/permaweb";

type ProfileData = {
  id: string;
  walletAddress: string;
  owner: string;
  username: string;
  displayName: string;
  description: string;
  thumbnail: string;
  banner: string;
  assets: {
    id: string;
    quantity: string;
    dateCreated: number;
    lastUpdate: number;
  }[];
};
const ProfileManager: React.FC= () => {
  const [permaweb, setPermaweb] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const pw = await initPermaweb();
        setPermaweb(pw);
      } catch (err) {
        console.error("Failed to initialize permaweb:", err);
        alert(
          "Failed to connect to ArConnect. Please ensure it's installed and unlocked."
        );
      }
    };
    init();
  }, []);
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    description: "",
    thumbnail: "",
    banner: "",
  });
  const [profileId, setProfileId] = useState("");
  const [mode, setMode] = useState<"create" | "update">("create");
  const [bannerError, setBannerError] = useState("");
  const [thumbError, setThumbError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Image upload handler with size check
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 102400) {
        // 100kb
        if (type === "banner") setBannerError("Image must be 100kb or less");
        if (type === "thumbnail") setThumbError("Image must be 100kb or less");
        return;
      } else {
        if (type === "banner") setBannerError("");
        if (type === "thumbnail") setThumbError("");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  // Copy wallet address
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const createProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const newProfileId = await permaweb.createProfile(form);
      setProfileId(newProfileId);
      setSuccess("Profile created successfully! ID: " + newProfileId);
    } catch (err: any) {
      console.error("Create profile failed:", err);
      if (err?.message?.includes("cancelled")) {
        setError("You cancelled the signing. Please try again.");
      } else {
        setError("Failed to create profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    if (!profileId) {
      setError("Please provide a profile ID to update.");
      setLoading(false);
      return;
    }
    try {
      const updatedId = await permaweb.updateProfile(form, profileId);
      setSuccess("Profile updated. Update ID: " + updatedId);
    } catch (err: any) {
      console.error("Update failed:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-800 via-zinc-950  to-zinc-950 py-10 px-2">
      <div className="max-w-md mx-auto flex flex-col gap-8">
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-lg relative overflow-visible">
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex items-center gap-2 z-20">
            <span className="text-lg font-bold text-white bg-zinc-900 px-4 py-1 rounded-full shadow border border-zinc-700">
              {mode === "create" ? "Create Profile" : "Update Profile"}
            </span>
            <div className="relative group">
              <button
                type="button"
                onClick={() => setMode(mode === "create" ? "update" : "create")}
                className="ml-1 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition"
                aria-label={
                  mode === "create"
                    ? "Switch to Update Profile"
                    : "Switch to Create Profile"
                }
              >
                <MdOutlineSwapVert />
              </button>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-10 bg-zinc-800 text-zinc-100 text-xs rounded px-3 py-1 shadow opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-30">
                {mode === "create"
                  ? "Switch to Update Profile"
                  : "Switch to Create Profile"}
              </div>
            </div>
          </div>
          {/* Banner and Thumbnail Preview as File Inputs */}
          <div className="flex flex-col items-center mb-6">
            {/* Banner as file input */}
            <div className="w-full flex justify-center">
              <label className="w-full h-38 max-w-md block cursor-pointer group relative">
                {form.banner ? (
                  <img
                    src={
                      form.banner.startsWith("data:image")
                        ? form.banner
                        : `https://arweave.net/${form.banner}`
                    }
                    alt="Banner"
                    className="w-full h-38 object-cover rounded-t-2xl border border-zinc-700"
                  />
                ) : (
                  <div className="w-full h-36 bg-zinc-800 rounded-t-xl flex flex-col border border-zinc-700 flex items-center justify-center text-zinc-500 text-sm">
                    No Banner/Click to upload image
                    {bannerError && (
                      <div className="text-red-500 text-xs">{bannerError}</div>
                    )}
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-zinc-900 bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-zinc-200 rounded-t-2xl transition pointer-events-none">
                  Max size: 100kb
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "banner")}
                  className="hidden"
                />
              </label>
            </div>
            {/* Thumbnail as file input (circular, overlaps banner) */}
            <div className="-mt-12 mb-2 z-10">
              <label className="block cursor-pointer group relative">
                {form.thumbnail ? (
                  <img
                    src={
                      form.thumbnail.startsWith("data:image")
                        ? form.thumbnail
                        : `https://arweave.net/${form.thumbnail}`
                    }
                    alt="Thumbnail"
                    className="w-24 h-24 object-cover rounded-full border-4 border-zinc-900 shadow-lg bg-zinc-800"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-zinc-900 shadow-lg bg-zinc-800 flex items-center justify-center text-zinc-500 text-[10px]">
                    Upload image
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-zinc-900 bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-zinc-200 rounded-full transition pointer-events-none">
                  Max size: 100kb
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "thumbnail")}
                  className="hidden"
                />
              </label>
            </div>
            {thumbError && (
              <div className="text-red-500 text-xs text-center">
                {thumbError}
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === "create") createProfile();
              else updateProfile();
            }}
            className="space-y-4 px-6 pb-6"
          >
            {mode === "update" && (
              <input
                name="profileId"
                placeholder="Profile ID"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 w-full"
                required
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleInputChange}
                className="border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 w-full"
                required
              />
              <input
                name="displayName"
                placeholder="Display Name"
                value={form.displayName}
                onChange={handleInputChange}
                className="border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 w-full"
                required
              />
            </div>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleInputChange}
              className="border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 w-full min-h-[60px]"
            />
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg font-semibold transition w-full md:w-auto flex items-center justify-center
                  ${loading ? 'bg-zinc-600 text-zinc-300 cursor-not-allowed' : success ? 'bg-green-600 text-white border-2 border-zinc-500' : 'bg-zinc-700 hover:bg-zinc-600 text-white'}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-zinc-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : success ? (
                  <>
                    <svg className="h-5 w-5 mr-2 text-green-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Success
                  </>
                ) : (
                  mode === "create" ? "Create Profile" : "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
        {/* Feedback messages */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 rounded-lg px-4 py-3 text-center shadow">
            {error}
          </div>
        )}
        {success && (<>
          <div className="relative bg-zinc-900 border border-zinc-300/20 text-green-300 rounded-lg px-4 py-3 text-center shadow">
            {success}
          <button
            onClick={() => handleCopy(profileId)}
            className="absolute top-0 right-0 ml-1 px-2 py-1 rounded bg-zinc-100/10 text-zinc-400 hover:text-white hover:bg-zinc-700 transition text-xs"
            title="Copy wallet address"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default ProfileManager;