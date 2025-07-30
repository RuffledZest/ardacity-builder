import React, { useEffect, useState } from "react";
import Arweave from "arweave";
import { getWalletAddress } from "../../lib/getWalletAddress";
import Toast from "../ui/toast";

interface AtomicAsset {
  id: string;
  name: string;
  description: string;
  creator: string;
  topics: string[];
  dateCreated: number;
  assetType: string;
  contentType: string;
  transactionHash: string;
}

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

const AtomicAssetsManager: React.FC = () => {
  const [assets, setAssets] = useState<AtomicAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: "Transaction hash copied to clipboard!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to copy to clipboard", type: "error" });
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    topics: "",
    contentType: "",
    file: null as File | null,
  });

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const address = await getWalletAddress();
      if (!address) {
        setError("Wallet not connected");
        return;
      }
      const query = {
        query: `
          query {
            transactions(owners: ["${address}"], tags: [{ name: "Protocol-Name", values: ["Permaweb Atomic Asset"] }]) {
              edges {
                node {
                  id
                  tags {
                    name
                    value
                  }
                  block {
                    timestamp
                  }
                }
              }
            }
          }
        `,
      };

      const response = await fetch("https://arweave.net/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      const result = await response.json();
      const nodes = result?.data?.transactions?.edges || [];

      const parsedAssets: AtomicAsset[] = nodes.map(({ node }: any) => {
        const tags: Record<string, string> = {};
        node.tags.forEach((tag: any) => {
          tags[tag.name] = tag.value;
        });

        return {
          id: node.id,
          name: tags["Title"] || "Untitled",
          description: tags["Description"] || "No description",
          creator: address,
          topics: tags["Topics"]?.split(",") || [],
          dateCreated: node.block?.timestamp * 1000 || Date.now(),
          assetType: tags["Type"] || "Unknown",
          contentType: tags["Content-Type"] || "N/A",
          transactionHash: node.id,
        };
      });

      setAssets(parsedAssets);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      setToast({ message: "File is required", type: "error" });
      return;
    }

    try {
      await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"]);

      const data = await formData.file.arrayBuffer();
      const tx = await arweave.createTransaction({ data });

      tx.addTag("App-Name", "Permaweb Atomic Asset Uploader");
      tx.addTag("Protocol-Name", "Permaweb Atomic Asset");
      tx.addTag("Title", formData.title);
      tx.addTag("Description", formData.description);
      tx.addTag("Type", formData.type);
      tx.addTag("Topics", formData.topics);
      tx.addTag("Content-Type", formData.contentType);

      // Use ArConnect dispatch to sign and upload
      await window.arweaveWallet.dispatch(tx);

      setToast({ message: "Asset uploaded successfully!", type: "success" });
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        type: "",
        topics: "",
        contentType: "",
        file: null,
      });
      fetchAssets();
    } catch (err: any) {
      console.error("Upload error:", err);
      setToast({ 
        message: "Upload error: " + (err?.message || "Unknown error"), 
        type: "error" 
      });
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="bg-zinc-950 py-10 px-2 flex flex-col items-center">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Your Atomic Assets</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleCreateAsset}
            className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 via-blue-700 to-purple-600 shadow-lg flex items-center gap-2 relative overflow-hidden group transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Upload or Create Asset
            </span>
            {/* Glowing animated effect on hover */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400 via-blue-600 to-purple-500 blur-lg animate-pulse" />
          </button>
        </div>
        <div className="relative flex flex-col items-center">
          {/* Slide-up Form */}
          <div
            className={`w-full max-w-md mx-auto transition-all duration-500 ease-in-out z-50 ${showForm ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'} fixed left-1/2 -translate-x-1/2 top-32`}
          >
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 w-full flex flex-col relative">
              <button
                type="button"
                onClick={closeForm}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-white">Create Atomic Asset</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <textarea
                  className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="type"
                  placeholder="Type (e.g. image, doc)"
                  value={formData.type}
                  onChange={handleChange}
                />
                <input
                  className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="topics"
                  placeholder="Topics (comma-separated)"
                  value={formData.topics}
                  onChange={handleChange}
                />
                <input
                  className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="contentType"
                  placeholder="Content-Type (e.g. image/png)"
                  value={formData.contentType}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100 rounded px-3 py-2"
                  type="file"
                  name="file"
                  accept="*"
                  onChange={handleChange}
                  required
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 border-1 border-zinc-700 text-zinc-100 rounded hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-900 cursor-pointer transition duration-200 hover:outline-2"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Asset List or Empty State */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : assets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-lg p-5 flex flex-col hover:shadow-2xl hover:border-blue-500 transition group"
                >
                  <h3 className="font-semibold text-lg mb-1 text-white group-hover:text-blue-400 transition">{asset.name}</h3>
                  <p className="text-sm mb-1 text-zinc-300">{asset.description}</p>
                  <p className="text-xs text-zinc-500 mb-1">
                    Created: {new Date(asset.dateCreated).toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-400 mb-1">
                    Type: {asset.assetType}
                  </p>
                  {asset.topics?.length > 0 && (
                    <p className="text-xs mt-1 text-zinc-400">
                      Topics: {asset.topics.join(", ")}
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-zinc-700">
                    <p className="text-xs text-zinc-500 mb-1">Transaction Hash:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-blue-400 font-mono break-all flex-1">
                        {asset.transactionHash}
                      </p>
                      <button
                        onClick={() => copyToClipboard(asset.transactionHash)}
                        className="text-xs text-zinc-400 hover:text-blue-400 transition-colors"
                        title="Copy transaction hash"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-zinc-900 rounded-2xl border border-zinc-700 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-zinc-500 text-lg mb-4">You have no Atomic Assets yet.</span>
              <button
                onClick={handleCreateAsset}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
              >
                Upload or Create Asset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtomicAssetsManager;


