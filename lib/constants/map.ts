import { type MapStyleOption } from "@/components/ui/map";

export const MAP_STYLES: Record<string, MapStyleOption> = {
  osm_bright: "https://tiles.openfreemap.org/styles/bright",
  osm_liberty: "https://tiles.openfreemap.org/styles/liberty",
  carto_voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
};

export type MapStyleKey = keyof typeof MAP_STYLES;
