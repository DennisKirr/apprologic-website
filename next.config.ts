import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // erzeugt statische HTML-Dateien in ./out
  trailingSlash: true,     // /funktionen/ statt /funktionen -> läuft auf jedem Webserver
  images: { unoptimized: true },
};

export default nextConfig;
