import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pine X School OS",
    short_name: "Pine X",
    description: "Parent portal for school life, notices, fees, forms, and transport.",
    start_url: "/parent",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#111c34",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
