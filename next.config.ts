import type { NextConfig } from "next";

// Situs diekspor statis agar bisa di-hosting di GitHub Pages.
// BASE_PATH diisi nama repo saat deploy (mis. "/risalatu-asy-syukriyyah").
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
