"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
import type { ZoneData } from "@/types/api/map";
import { MapToolbar } from "./map-toolbar";
import { MapDrawingLayer } from "./map-drawing-layer";
import { ZonePropertiesDialog } from "./zone-properties-dialog";
import type { ZoneFormData } from "@/lib/validations/forms/map";

export function MapZones() {
  const mapRef = useRef<MapRef>(null);

  const initialViewport: MapViewport = {
    center: [-1.755722, 4.909667],
    zoom: 17.5,
    bearing: 0,
    pitch: 0,
  };

  const [viewport, setViewport] = useState<MapViewport>(initialViewport);
  const [style, setStyle] = useState<MapStyleKey>("osm_bright");
  const selectedStyle = MAP_STYLES[style];
  const is3D = style === "osm_liberty";

  // Zone state
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneData | null>(null);
  const [pendingCoordinates, setPendingCoordinates] = useState<
    [number, number][] | null
  >(null);

  // Handle polygon completion from drawing
  const handlePolygonComplete = useCallback(
    (coordinates: [number, number][]) => {
      setPendingCoordinates(coordinates);
      setEditingZone(null);
      setDialogOpen(true);
      setIsDrawActive(false);
    },
    []
  );

  // Handle zone creation/update from dialog
  const handleDialogSubmit = useCallback(
    (data: ZoneFormData) => {
      if (editingZone) {
        setZones((prev) =>
          prev.map((zone) =>
            zone.id === editingZone.id
              ? {
                  ...zone,
                  name: data.name,
                  color: data.color,
                  transparency: data.transparency,
                  borderWidth: data.borderWidth,
                }
              : zone
          )
        );
      } else if (pendingCoordinates) {
        const newZone: ZoneData = {
          id: `zone-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: data.name,
          color: data.color,
          coordinates: pendingCoordinates,
          transparency: data.transparency,
          borderWidth: data.borderWidth,
        };
        setZones((prev) => [...prev, newZone]);
      }
      setDialogOpen(false);
      setPendingCoordinates(null);
      setEditingZone(null);
    },
    [editingZone, pendingCoordinates]
  );

  // Handle edit zone
  const handleEditZone = useCallback((zone: ZoneData) => {
    setEditingZone(zone);
    setPendingCoordinates(null);
    setDialogOpen(true);
  }, []);

  // Handle delete zone
  const handleDeleteZone = useCallback((zoneId: string) => {
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
  }, []);

  // Handle delete from dialog
  const handleDeleteFromDialog = useCallback(() => {
    if (editingZone) {
      setZones((prev) => prev.filter((z) => z.id !== editingZone.id));
      setDialogOpen(false);
      setEditingZone(null);
    }
  }, [editingZone]);

  // Handle dialog close
  const handleDialogOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setPendingCoordinates(null);
      setEditingZone(null);
    }
  }, []);

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
    <>
      <Card className="h-full rounded-lg p-0 overflow-hidden relative border border-gray-300 shadow-none">
        <Map
          ref={mapRef}
          viewport={viewport}
          onViewportChange={setViewport}
          theme="light"
          styles={selectedStyle}
        >
          <MapControls
            showFullscreen
            showZoom
            show3D
            showHome
            homeViewport={initialViewport}
          />
          <MapToolbar
            isDrawActive={isDrawActive}
            onDrawActiveChange={setIsDrawActive}
            showBoundaries={showBoundaries}
            onShowBoundariesChange={setShowBoundaries}
          />
          <MapStyleSelector value={style} onChange={setStyle} />
          <MapViewportInfo viewport={viewport} />

          {/* Drawing layer */}
          <MapDrawingLayer
            isDrawActive={isDrawActive}
            onPolygonComplete={handlePolygonComplete}
            zones={zones}
            showBoundaries={showBoundaries}
            onEditZone={handleEditZone}
            onDeleteZone={handleDeleteZone}
          />
        </Map>
      </Card>

      <ZonePropertiesDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleDialogSubmit}
        onDelete={editingZone ? handleDeleteFromDialog : undefined}
        isEditing={!!editingZone}
        initialData={
          editingZone
            ? {
                name: editingZone.name,
                color: editingZone.color,
                transparency: editingZone.transparency,
                borderWidth: editingZone.borderWidth,
              }
            : undefined
        }
      />
    </>
  );
}
