"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "@/components/ui/map";
import type MapLibreGL from "maplibre-gl";

const CLOSE_DISTANCE_PX = 12;

type UseZoneDrawingOptions = {
  isDrawActive: boolean;
  onPolygonComplete: (coordinates: [number, number][]) => void;
};

export function useZoneDrawing({
  isDrawActive,
  onPolygonComplete,
}: UseZoneDrawingOptions) {
  const { map, isLoaded } = useMap();
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [cursorPosition, setCursorPosition] = useState<[number, number] | null>(
    null
  );
  const isDrawingRef = useRef(false);
  const onPolygonCompleteRef = useRef(onPolygonComplete);
  onPolygonCompleteRef.current = onPolygonComplete;

  const cancelDrawing = useCallback(() => {
    setDrawingPoints([]);
    setCursorPosition(null);
    isDrawingRef.current = false;
  }, []);

  // Handle escape key to cancel drawing
  useEffect(() => {
    if (!isDrawActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelDrawing();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawActive, cancelDrawing]);

  // Manage cursor style and map interactions
  useEffect(() => {
    if (!map || !isLoaded) return;

    if (isDrawActive) {
      map.getCanvas().style.cursor = "crosshair";
      // Disable double-click zoom during drawing
      map.doubleClickZoom.disable();
    } else {
      map.getCanvas().style.cursor = "";
      map.doubleClickZoom.enable();
      // Clear any in-progress drawing when draw mode is turned off
      cancelDrawing();
    }

    return () => {
      map.getCanvas().style.cursor = "";
      map.doubleClickZoom.enable();
    };
  }, [map, isLoaded, isDrawActive, cancelDrawing]);

  // Handle map clicks for vertex placement
  useEffect(() => {
    if (!map || !isLoaded || !isDrawActive) return;

    const handleClick = (e: MapLibreGL.MapMouseEvent) => {
      const point: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      setDrawingPoints((prev) => {
        // Check if clicking near the first point to close the polygon
        if (prev.length >= 3) {
          const firstPoint = map.project(prev[0] as [number, number]);
          const clickPoint = e.point;
          const dx = firstPoint.x - clickPoint.x;
          const dy = firstPoint.y - clickPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CLOSE_DISTANCE_PX) {
            // Close the polygon
            const completedCoords = [...prev];
            // Use setTimeout to avoid state update conflicts
            setTimeout(() => {
              onPolygonCompleteRef.current(completedCoords);
              setDrawingPoints([]);
              setCursorPosition(null);
              isDrawingRef.current = false;
            }, 0);
            return prev;
          }
        }

        isDrawingRef.current = true;
        return [...prev, point];
      });
    };

    const handleDblClick = (e: MapLibreGL.MapMouseEvent) => {
      e.preventDefault();

      setDrawingPoints((prev) => {
        if (prev.length >= 3) {
          const completedCoords = [...prev];
          setTimeout(() => {
            onPolygonCompleteRef.current(completedCoords);
            setDrawingPoints([]);
            setCursorPosition(null);
            isDrawingRef.current = false;
          }, 0);
        }
        return prev;
      });
    };

    const handleMouseMove = (e: MapLibreGL.MapMouseEvent) => {
      setCursorPosition([e.lngLat.lng, e.lngLat.lat]);
    };

    map.on("click", handleClick);
    map.on("dblclick", handleDblClick);
    map.on("mousemove", handleMouseMove);

    return () => {
      map.off("click", handleClick);
      map.off("dblclick", handleDblClick);
      map.off("mousemove", handleMouseMove);
    };
  }, [map, isLoaded, isDrawActive]);

  return {
    drawingPoints,
    cursorPosition,
    isDrawing: drawingPoints.length > 0,
    cancelDrawing,
  };
}
