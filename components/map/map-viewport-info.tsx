"use client";

import { type MapViewport } from "@/components/ui/map";

interface MapViewportInfoProps {
  viewport: MapViewport;
}

export function MapViewportInfo({ viewport }: Readonly<MapViewportInfoProps>) {
  return (
    <section className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 text-[10px] bg-white rounded-lg p-2 border border-gray-400">
      <p>
        <span className="font-bold">lng:</span> {viewport.center[0].toFixed(3)}
      </p>
      <p>
        <span className="font-bold">lat:</span> {viewport.center[1].toFixed(3)}
      </p>
      <p>
        <span className="font-bold">zoom:</span> {viewport.zoom.toFixed(1)}
      </p>
      <p>
        <span className="font-bold">bearing:</span>{" "}
        {viewport.bearing.toFixed(1)}°
      </p>
      <p>
        <span className="font-bold">pitch:</span> {viewport.pitch.toFixed(1)}°
      </p>
    </section>
  );
}
