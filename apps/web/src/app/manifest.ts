import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kid Zone · Catholic Learning for Children",
    short_name: "Kid Zone",
    description:
      "Catholic learning platform for children aged 3 to 15: Bible, saints, catechism, quizzes, and church puzzles.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF1D6",
    theme_color: "#FF7A1A",
    icons: [
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
