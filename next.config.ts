import type { NextConfig } from "next";

// "output: export" casse le serveur de dev sur les routes dynamiques
// (bug connu de Next.js : https://github.com/vercel/next.js/issues/56477).
// On ne l'active donc que pour le build de production (npm run build),
// pas pour le dev (npm run dev).
const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "production" ? { output: "export" as const } : {}),
  images: { unoptimized: true },
};

export default nextConfig;
