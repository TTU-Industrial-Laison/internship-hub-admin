import { type MapStyleOption } from "@/components/ui/map";

export const MAP_STYLES: Record<string, MapStyleOption> = {
  osm_bright: "https://tiles.openfreemap.org/styles/bright",
  osm_liberty: "https://tiles.openfreemap.org/styles/liberty",
  carto_voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
};

export type MapStyleKey = keyof typeof MAP_STYLES;


// --- Preset Colors for Zone Theming ---
export const PRESET_COLORS = [
  // Row 1
  { name: "Crimson", value: "#dc2626" },
  { name: "Rose", value: "#fb7185" },
  { name: "Pink", value: "#f472b6" },
  { name: "Fuchsia", value: "#e879f9" },
  { name: "Purple", value: "#c084fc" },
  { name: "Violet", value: "#a78bfa" },
  { name: "Indigo", value: "#818cf8" },
  { name: "Blue", value: "#60a5fa" },

  // Row 2
  { name: "Sky", value: "#38bdf8" },
  { name: "Cyan", value: "#22d3ee" },
  { name: "Teal", value: "#2dd4bf" },
  { name: "Emerald", value: "#34d399" },
  { name: "Green", value: "#4ade80" },
  { name: "Lime", value: "#a3e635" },
  { name: "Yellow", value: "#facc15" },
  { name: "Amber", value: "#fbbf24" },

  // Row 3
  { name: "Orange", value: "#fb923c" },
  { name: "Red", value: "#f87171" },
  { name: "Warm Gray", value: "#78716c" },
  { name: "Slate", value: "#64748b" },
  { name: "Zinc", value: "#71717a" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Forest", value: "#14532d" },
  { name: "Burgundy", value: "#881337" },
] as const;
