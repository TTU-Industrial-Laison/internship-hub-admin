"use client";

import { type MapViewport } from "@/components/ui/map";

interface MapViewportInfoProps {
  viewport: MapViewport;
}

export function MapViewportInfo({ viewport }: Readonly<MapViewportInfoProps>) {
  return (
    <section className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 text-[10px]   bg-white backdrop-blur px-2 py-1.5 rounded-lg border shadow-sm pointer-events-none">
      <span>
        <span className="text-muted-foreground font-bold">lng:</span>{" "}
        {viewport.center[0].toFixed(3)}
      </span>
      <span>
        <span className="text-muted-foreground font-bold">lat:</span>{" "}
        {viewport.center[1].toFixed(3)}
      </span>
      <span>
        <span className="text-muted-foreground font-bold">zoom:</span>{" "}
        {viewport.zoom.toFixed(1)}
      </span>
      <span>
        <span className="text-muted-foreground font-bold">bearing:</span>{" "}
        {viewport.bearing.toFixed(1)}°
      </span>
      <span>
        <span className="text-muted-foreground font-bold">pitch:</span>{" "}
        {viewport.pitch.toFixed(1)}°
      </span>
    </section>
  );
}
