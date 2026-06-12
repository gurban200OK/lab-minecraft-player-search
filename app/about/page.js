export const metadata = {
  title: "About | CraftSeeker",
  description: "Learn more about CraftSeeker, a Minecraft player lookup tool powered by mc-api.io.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-12 sm:py-20">
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-4 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            📚 About the App
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            What is CraftSeeker?
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            CraftSeeker is a utility web application designed to help you search for
            Minecraft players. By querying public databases, it retrieves player profiles,
            resolves their UUIDs, and renders their 2D skin textures.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Card 1 */}
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
            <span className="text-3xl">🔍</span>
            <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Instant Lookup
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Search by Java or Bedrock Minecraft names. We query the profile
              API and show the exact matched player metadata and skin in real-time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
            <span className="text-3xl">🧩</span>
            <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              UUID & Skins
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Copy resolved Minecraft UUIDs with a single click, and view or download 
              the full player skin texture directly from Mojang&apos;s servers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
            <span className="text-3xl">🔌</span>
            <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              API Powered
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CraftSeeker is built on top of the free and open API provided by{" "}
              <a
                href="https://mc-api.io"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                mc-api.io
              </a>
              . No registration or api keys required.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
            <span className="text-3xl">⚡</span>
            <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Built with Next.js 16
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              This lab demonstrates the power of Next.js routing, navigation, Layouts, 
              client-side data fetching, and URL query synchronization.
            </p>
          </div>
        </div>

        {/* Footer Credit Link */}
        <div className="mt-12 text-center sm:text-left">
          <a
            href="https://mc-api.io"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-200/50 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Visit mc-api.io
            <span>→</span>
          </a>
        </div>
      </main>
    </div>
  );
}
