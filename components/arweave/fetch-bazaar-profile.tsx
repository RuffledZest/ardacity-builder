import React, { useState, useRef, useEffect } from "react";
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

function getAverageRGB(imgEl: HTMLImageElement | null): string {
  // fallback to blue if not possible
  if (!imgEl) return "#2563eb";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext && canvas.getContext("2d");
  if (!context) return "#2563eb";
  canvas.width = imgEl.naturalWidth;
  canvas.height = imgEl.naturalHeight;
  context.drawImage(imgEl, 0, 0);
  try {
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);
    return `rgb(${r},${g},${b})`;
  } catch {
    return "#2563eb";
  }
}

const FetchProfileCard: React.FC = () => {
  const [fetchType, setFetchType] = useState<"profileId" | "walletAddress">(
    "profileId"
  );
  const [profileId, setProfileId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [copied, setCopied] = useState(false);
  const [borderColor, setBorderColor] = useState<string>("#2563eb");
  const bannerRef = useRef<HTMLImageElement>(null);
  const [permaweb, setPermaweb] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

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
  useEffect(() => {
    if (profile && profile.banner && bannerRef.current) {
      const img = bannerRef.current;
      if (img.complete) {
        setBorderColor(getAverageRGB(img));
      } else {
        img.onload = () => setBorderColor(getAverageRGB(img));
      }
    } else {
      setBorderColor("#2563eb");
    }
  }, [profile?.banner]);

  const fetchById = async () => {
    if (!profileId) return alert("Enter Profile ID first");
    setLoading(true);

    try {
      const fetchedProfile = await permaweb.getProfileById(profileId);
      if (!fetchedProfile) {
        alert("No profile found with this ID.");
        return;
      }
      setProfile(fetchedProfile);
    } catch (err) {
      console.error("Fetch by ID failed:", err);
      alert("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchByWallet = async () => {
    if (!walletAddress) return alert("Enter Wallet Address first");
    setLoading(true);

    try {
      const fetchedProfile = await permaweb.getProfileByWalletAddress(
        walletAddress
      );
      if (!fetchedProfile) {
        alert("No profile found for this wallet.");
        return;
      }
      setProfile(fetchedProfile);
    } catch (err) {
      console.error("Fetch by Wallet failed:", err);
      alert("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  // Copy wallet address
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center bg-zinc-900 py-10">
      {/* Profile Card */}
      <div
        className="relative mx-auto max-w-md w-full bg-zinc-900 border-2 rounded-2xl shadow-2xl p-0 overflow-visible"
        style={{
          borderColor: "#a1a1aa", // zinc-400
          boxShadow: `0 8px 32px 0 rgba(31,41,55,0.4), 0 0 0 4px #27272a33`, // zinc-800
        }}
      >
        {/* Shiny border animation */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-10 animate-[shimmer_2.5s_linear_infinite]"
          style={{
            background: `linear-gradient(120deg, #a1a1aa 0%, #27272a 60%, #a1a1aa 100%)`,
            opacity: 0.18,
            filter: "blur(8px)",
          }}
        />
        {profile ? (
          <>
            {/* Banner as cover */}
            <div className="relative w-full h-36 bg-zinc-800 rounded-2xl">
              {profile.banner ? (
                <img
                  ref={bannerRef}
                  src={
                    profile.banner.startsWith("data:image")
                      ? profile.banner
                      : `https://arweave.net/${profile.banner}`
                  }
                  alt="Banner"
                  className="w-full h-36 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-36 bg-zinc-800 flex rounded-t-2xl items-center justify-center text-zinc-500 text-sm">
                  No Banner
                </div>
              )}
              {/* Circular thumbnail, overlapping */}
              <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 z-10">
                {profile.thumbnail ? (
                  <img
                    src={
                      profile.thumbnail.startsWith("data:image")
                        ? profile.thumbnail
                        : `https://arweave.net/${profile.thumbnail}`
                    }
                    alt="Thumbnail"
                    className="w-24 h-24 object-cover rounded-full border-4 border-zinc-900 shadow-lg bg-zinc-800"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-zinc-900 shadow-lg bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                    No Image
                  </div>
                )}
              </div>
            </div>
            {/* Main profile info */}
            <div className="pt-16 pb-6 px-6 flex flex-col items-center">
              <h3 className="text-2xl font-bold text-white mb-1">
                {profile.displayName || (
                  <span className="text-zinc-500">No Display Name</span>
                )}
              </h3>
              <span className="text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-zinc-400 mb-2">
                @{profile.username || "username"}
              </span>
              <div className="flex items-center gap-2 mt-2 mb-2">
                <span className="text-zinc-400 text-xs font-mono truncate max-w-[120px]">
                  {profile.owner}
                </span>
                <button
                  onClick={() => handleCopy(profile.owner)}
                  className="ml-1 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition text-xs"
                  title="Copy wallet address"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="text-zinc-500 text-xs mb-2">
                Profile ID:{" "}
                <span className="font-mono break-all">{profile.id}</span>
              </div>
              <p className="text-zinc-300 text-sm mb-4 text-center max-w-xl">
                {profile.description || (
                  <span className="italic">No description</span>
                )}
              </p>
              {/* Asset section */}
              <div className="w-full mt-2">
                <h4 className="font-bold text-zinc-200 mb-2 text-left">
                  Assets
                </h4>
                {profile.assets?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex flex-col hover:shadow-lg transition"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-zinc-100 text-xs">
                            ID:
                          </span>
                          <span className="font-mono text-zinc-400 text-xs truncate">
                            {asset.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-zinc-100 text-xs">
                            Qty:
                          </span>
                          <span className="text-zinc-300 text-xs text-right">
                            {asset.quantity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-zinc-100 text-xs">
                            Created:
                          </span>
                          <span className="text-zinc-400 text-xs text-right">
                            {new Date(asset.dateCreated).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-100 text-xs">
                            Updated:
                          </span>
                          <span className="text-zinc-400 text-xs text-right">
                            {new Date(asset.lastUpdate).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 bg-zinc-800 rounded-lg border border-zinc-700 mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-zinc-600 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-zinc-500 text-sm">
                      No assets found for this profile.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Skeleton loader (unchanged)
          <div className="w-full flex flex-col items-center animate-pulse pb-8 rounded-2xl">
            {/* Banner skeleton */}
            <div className="relative w-full h-36 bg-zinc-800 rounded-2xl">
              <div className="w-full h-36 bg-zinc-800 rounded-t-2xl" />
              {/* Thumbnail skeleton */}
              <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 z-10">
                <div className="w-24 h-24 rounded-full border-4 border-zinc-900 bg-zinc-800" />
              </div>
            </div>
            <div className="pt-16 pb-6 px-6 flex flex-col items-center w-full">
              <div className="h-6 w-40 bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-24 bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-32 bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-64 bg-zinc-800 rounded mb-4" />
              {/* Asset skeletons */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-4 flex flex-col gap-2"
                  >
                    <div className="h-3 w-24 bg-zinc-700 rounded" />
                    <div className="h-3 w-16 bg-zinc-700 rounded" />
                    <div className="h-3 w-28 bg-zinc-700 rounded" />
                    <div className="h-3 w-20 bg-zinc-700 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Fetch Form */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Fetch Permaweb/Bazaar Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (fetchType === "profileId") fetchById();
            else fetchByWallet();
          }}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="flex w-full md:w-auto gap-2 items-center">
            <select
              value={fetchType}
              onChange={(e) =>
                setFetchType(e.target.value as "profileId" | "walletAddress")
              }
              className="border border-zinc-700 rounded px-2 py-2 bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              <option value="profileId">Profile ID</option>
              <option value="walletAddress">Wallet Address</option>
            </select>
            <input
              placeholder={
                fetchType === "profileId" ? "Profile ID" : "Wallet Address"
              }
              value={fetchType === "profileId" ? profileId : walletAddress}
              onChange={(e) =>
                fetchType === "profileId"
                  ? setProfileId(e.target.value)
                  : setWalletAddress(e.target.value)
              }
              className="border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 w-full md:w-64"
              required
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-semibold transition w-full md:w-auto flex items-center justify-center
              ${
                loading
                  ? "bg-zinc-600 text-zinc-300 cursor-not-allowed"
                  : "bg-zinc-700 hover:bg-zinc-600 text-white"
              }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-zinc-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Fetching...
              </>
            ) : (
              "Fetch"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FetchProfileCard;
