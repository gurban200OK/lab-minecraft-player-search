"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function SearchLoadingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* Minecraft style pulsing block */}
        <div className="h-12 w-12 animate-pulse bg-emerald-600 rounded-lg dark:bg-emerald-500 shadow-lg shadow-emerald-500/30" />
        <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400 animate-bounce">
          Locating player in the database...
        </p>
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const nameParam = searchParams.get("name") || "";
  const editionParam = searchParams.get("edition") || "java";

  const [prevNameParam, setPrevNameParam] = useState(nameParam);
  const [prevEditionParam, setPrevEditionParam] = useState(editionParam);
  const [inputName, setInputName] = useState(nameParam);
  const [inputEdition, setInputEdition] = useState(editionParam);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [copied, setCopied] = useState(false);

  // Sync state during render if URL parameters change
  if (nameParam !== prevNameParam || editionParam !== prevEditionParam) {
    setPrevNameParam(nameParam);
    setPrevEditionParam(editionParam);
    setInputName(nameParam);
    setInputEdition(editionParam);
    if (!nameParam.trim()) {
      setPlayerData(null);
      setError(null);
    }
  }

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("recent_mc_searches");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setRecentSearches(parsed);
        }, 0);
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  // Fetch player details whenever nameParam or editionParam change
  useEffect(() => {
    if (!nameParam.trim()) {
      return;
    }

    const fetchPlayer = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from mc-api.io
        const response = await fetch(
          `https://mc-api.io/profile/${encodeURIComponent(nameParam.trim())}/${editionParam}`
        );

        if (!response.ok) {
          throw new Error("Player not found");
        }

        const data = await response.json();
        setPlayerData(data);

        // Add to recent searches
        const searchItem = { name: data.name || nameParam, edition: editionParam };
        setRecentSearches((prev) => {
          const filtered = prev.filter(
            (item) =>
              item.name.toLowerCase() !== searchItem.name.toLowerCase() ||
              item.edition !== searchItem.edition
          );
          const updated = [searchItem, ...filtered].slice(0, 5);
          localStorage.setItem("recent_mc_searches", JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        console.error(err);
        setPlayerData(null);
        setError(`We couldn't find a player named "${nameParam}" on ${editionParam === "java" ? "Java Edition" : "Bedrock Edition"}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [nameParam, editionParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    // Push params to URL to trigger state update via URL params synchronization
    const params = new URLSearchParams();
    params.set("name", inputName.trim());
    params.set("edition", inputEdition);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRecentClick = (name, edition) => {
    setInputName(name);
    setInputEdition(edition);
    const params = new URLSearchParams();
    params.set("name", name);
    params.set("edition", edition);
    router.push(`${pathname}?${params.toString()}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_mc_searches");
  };

  const skinUrl = playerData?.decodedTexture?.textures?.SKIN?.url;
  const capeUrl = playerData?.decodedTexture?.textures?.CAPE?.url;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        {/* Title Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Player Database Lookup
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Query Minecraft profiles from the official Mojang servers.
          </p>
        </div>

        {/* Two column grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Search controls + history */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Search Card */}
            <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Search Player
              </h2>
              <form onSubmit={handleSearchSubmit} className="mt-4 flex flex-col gap-4">
                {/* Username input */}
                <div>
                  <label htmlFor="username" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Notch, jeb_"
                    className="mt-1 block w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:placeholder-zinc-600"
                    required
                  />
                </div>

                {/* Edition select */}
                <div>
                  <label htmlFor="edition" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Edition
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-2 rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-950">
                    <button
                      type="button"
                      onClick={() => setInputEdition("java")}
                      className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                        inputEdition === "java"
                          ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                          : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      🎮 Java Edition
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputEdition("bedrock")}
                      className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                        inputEdition === "bedrock"
                          ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                          : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      📱 Bedrock
                    </button>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex h-12 items-center justify-center rounded-2xl bg-emerald-600 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Searching...
                    </div>
                  ) : (
                    "Search Database"
                  )}
                </button>
              </form>
            </div>

            {/* History Card */}
            {recentSearches.length > 0 && (
              <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Recent Searches
                  </h2>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRecentClick(item.name, item.edition)}
                      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      <span>{item.edition === "java" ? "☕" : "📱"}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results display */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {loading ? (
              <div className="flex flex-1 flex-col items-center justify-center min-h-[300px] rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                <p className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Retrieving user profile...
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Checking Mojang authentication systems
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-1 flex-col items-center justify-center min-h-[300px] rounded-3xl border border-red-200 bg-red-50/20 p-6 text-center shadow-sm dark:border-red-900/40 dark:bg-red-950/10">
                <span className="text-4xl">👾</span>
                <h3 className="mt-4 text-lg font-bold text-red-800 dark:text-red-400">
                  Player Not Found
                </h3>
                <p className="mt-2 max-w-sm text-sm text-red-700/80 dark:text-red-400/80">
                  {error}
                </p>
                <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                  Tip: Check capitalization. Java usernames are case-sensitive.
                </p>
              </div>
            ) : playerData ? (
              <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40 flex flex-col gap-6">
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-5 dark:border-zinc-800/60">
                  <div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {editionParam === "java" ? "Java Player" : "Bedrock Player"}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      {playerData.name}
                    </h3>
                  </div>

                  {/* Copy UUID button */}
                  <button
                    onClick={() => copyToClipboard(playerData.uuid)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 w-full sm:w-auto justify-center"
                  >
                    <span>{copied ? "✅ Copied!" : "📋 Copy UUID"}</span>
                  </button>
                </div>

                {/* UUID field */}
                <div>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Full UUID
                  </span>
                  <div className="mt-1 rounded-2xl bg-zinc-100/60 px-4 py-3 font-mono text-sm text-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300 break-all select-all">
                    {playerData.uuid}
                  </div>
                </div>

                {/* Skin section */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Skin Image */}
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/30 flex flex-col items-center gap-4 text-center">
                    <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Skin Texture Sheet
                    </h4>
                    {skinUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative border border-zinc-300 dark:border-zinc-700 rounded-lg p-1 bg-zinc-200 dark:bg-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={skinUrl}
                            alt={`${playerData.name}'s Minecraft skin texture`}
                            className="h-28 w-28 object-contain"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </div>
                        <a
                          href={skinUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          View Original Texture File ↗
                        </a>
                      </div>
                    ) : (
                      <div className="flex h-36 flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
                        <span className="text-2xl">👤</span>
                        <p className="mt-2 text-xs">No skin texture linked.</p>
                        <p className="text-[10px] text-zinc-400">Default Steve skin applies.</p>
                      </div>
                    )}
                  </div>

                  {/* Cape section */}
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/30 flex flex-col items-center gap-4 text-center">
                    <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Cape Texture Sheet
                    </h4>
                    {capeUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative border border-zinc-300 dark:border-zinc-700 rounded-lg p-1 bg-zinc-200 dark:bg-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={capeUrl}
                            alt={`${playerData.name}'s Minecraft cape texture`}
                            className="h-28 w-28 object-contain"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </div>
                        <a
                          href={capeUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          View Original Cape File ↗
                        </a>
                      </div>
                    ) : (
                      <div className="flex h-36 flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
                        <span className="text-2xl">🧥</span>
                        <p className="mt-2 text-xs">No cape texture equipped.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center min-h-[300px] rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/20 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/10">
                <span className="text-4xl animate-bounce">👋</span>
                <h3 className="mt-4 text-lg font-bold text-zinc-700 dark:text-zinc-300">
                  Ready for Lookup
                </h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                  Enter a player username in the form on the left to resolve their account
                  profile, UUID, and skin files.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoadingState />}>
      <SearchContent />
    </Suspense>
  );
}
