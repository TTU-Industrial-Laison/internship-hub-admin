"use client";

import {
  MapPolygon,
  MapPopup,
  MapRoute,
  MapMarker,
  MarkerContent,
} from "@/components/ui/map";
import type { MapDrawingLayerProps } from "@/types/api/map";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useZoneDrawing } from "@/lib/hooks/map/use-zone-drawing";

function getPolygonCentroid(coordinates: [number, number][]): [number, number] {
  let sumLng = 0;
  let sumLat = 0;
  for (const [lng, lat] of coordinates) {
    sumLng += lng;
    sumLat += lat;
  }
  return [sumLng / coordinates.length, sumLat / coordinates.length];
}

export function MapDrawingLayer({
  isDrawActive,
  onPolygonComplete,
  zones,
  showBoundaries,
  onEditZone,
  onDeleteZone,
}: Readonly<MapDrawingLayerProps>) {
  const { drawingPoints, cursorPosition } = useZoneDrawing({
    isDrawActive,
    onPolygonComplete,
  });

  const [activePopupZoneId, setActivePopupZoneId] = useState<string | null>(
    null
  );

  // Build the preview polyline: drawing points + cursor position
  const previewLine: [number, number][] =
    drawingPoints.length > 0 && cursorPosition
      ? [...drawingPoints, cursorPosition]
      : drawingPoints;

  return (
    <>
      {/* Drawing preview polyline */}
      {previewLine.length >= 2 && (
        <MapRoute
          id="zone-drawing-preview"
          coordinates={previewLine}
          color="#3b82f6"
          width={2}
          opacity={0.8}
          dashArray={[4, 4]}
          interactive={false}
        />
      )}

      {/* Drawing vertex markers */}
      {drawingPoints.map((point, index) => (
        <MapMarker
          key={`draw-vertex-${point}-${index}`}
          longitude={point[0]}
          latitude={point[1]}
        >
          <MarkerContent>
            <div
              className={`size-3 rounded-full border-2 border-white shadow-md ${
                index === 0 && drawingPoints.length >= 3
                  ? "bg-green-500 ring-2 ring-green-500/30 size-4"
                  : "bg-blue-500"
              }`}
            />
          </MarkerContent>
        </MapMarker>
      ))}

      {/* Instructions tooltip when drawing */}
      {drawingPoints.length > 0 && drawingPoints.length < 3 && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 bg-primary text-white text-xs px-4 py-2 rounded-full whitespace-nowrap backdrop-blur-sm shadow-lg">
          Click to add points ({3 - drawingPoints.length} more needed) •{" "}
          <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">
            Esc
          </kbd>{" "}
          to cancel
        </div>
      )}

      {drawingPoints.length >= 3 && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 bg-primary text-white text-xs px-4 py-2 rounded-full whitespace-nowrap backdrop-blur-sm shadow-lg">
          Double-click or click{" "}
          <span className="px-1.5 py-0.5 bg-white/20 rounded font-medium">
            first point
          </span>{" "}
          to close •{" "}
          <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-medium">
            Esc
          </kbd>{" "}
          to cancel
        </div>
      )}

      {/* Completed zones */}
      {showBoundaries &&
        zones.map((zone) => (
          <MapPolygon
            key={zone.id}
            id={zone.id}
            coordinates={zone.coordinates}
            fillColor={zone.color}
            fillOpacity={zone.transparency}
            outlineColor={zone.color}
            outlineWidth={zone.borderWidth}
            onClick={() => setActivePopupZoneId(zone.id)}
          />
        ))}

      {/* Zone labels at centroid */}
      {showBoundaries &&
        zones.map((zone) => {
          const centroid = getPolygonCentroid(zone.coordinates);
          return (
            <MapMarker
              key={`label-${zone.id}`}
              longitude={centroid[0]}
              latitude={centroid[1]}
            >
              <MarkerContent>
                <div className="flex flex-col items-center pointer-events-none select-none">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap"
                    style={{
                      backgroundColor: `${zone.color}dd`,
                      color: "#fff",
                      border: `1px solid ${zone.color}`,
                    }}
                  >
                    {zone.name}
                  </span>
                </div>
              </MarkerContent>
            </MapMarker>
          );
        })}

      {/* Zone click popup */}
      {activePopupZoneId &&
        (() => {
          const zone = zones.find((z) => z.id === activePopupZoneId);
          if (!zone) return null;
          const centroid = getPolygonCentroid(zone.coordinates);
          return (
            <MapPopup
              longitude={centroid[0]}
              latitude={centroid[1]}
              onClose={() => setActivePopupZoneId(null)}
              closeButton
            >
              <div className="min-w-45 p-1">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="size-4 rounded-md shrink-0"
                    style={{ backgroundColor: zone.color }}
                  />
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {zone.name}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-8 border-gray-300"
                    onClick={() => {
                      setActivePopupZoneId(null);
                      onEditZone(zone);
                    }}
                  >
                    <Edit className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30"
                    onClick={() => {
                      setActivePopupZoneId(null);
                      onDeleteZone(zone.id);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </MapPopup>
          );
        })()}
    </>
  );
}
