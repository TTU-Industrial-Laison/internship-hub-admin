"use client";

import { useState, useRef, useEffect } from "react";
import {
  Map,
  MapControls,
  type MapViewport,
  type MapRef,
} from "@/components/ui/map";
import { Card } from "@/components/ui/card";
import { MapViewportInfo } from "./map-viewport-info";

import { MapStyleSelector } from "./map-style-selector";
import { MAP_STYLES, type MapStyleKey } from "@/lib/constants/map";

export function MapZones() {
  const mapRef = useRef<MapRef>(null);
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-74.006, 40.7128],
    zoom: 11,
    bearing: 0,
    pitch: 0,
  });

  const [style, setStyle] = useState<MapStyleKey>("osm_bright");
  const selectedStyle = MAP_STYLES[style];
  const is3D = style === "osm_liberty";

  // Transition to 3D pitch when 3D style is selected
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        pitch: is3D ? 60 : 0,
        duration: 800,
      });
    }
  }, [is3D]);

  return (
    <Card className="h-full rounded-lg p-0 overflow-hidden relative border border-gray-300 shadow-none">
      <Map
        ref={mapRef}
        viewport={viewport}
        onViewportChange={setViewport}
        styles={
          selectedStyle
            ? { light: selectedStyle, dark: selectedStyle }
            : undefined
        }
      >
        <MapControls showFullscreen showCompass showZoom show3D />
        <MapStyleSelector value={style} onChange={setStyle} />
        <MapViewportInfo viewport={viewport} />
      </Map>
    </Card>
  );
}
