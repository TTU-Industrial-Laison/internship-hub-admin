"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import { ZonePropertiesPanel } from "./zone-properties-panel";
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

  // Dialog/Panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneData | null>(null);
  const [pendingCoordinates, setPendingCoordinates] = useState<
    [number, number][] | null
  >(null);
  const [previewZoneParams, setPreviewZoneParams] =
    useState<ZoneFormData | null>(null);

  // Memoized zones list including preview/editing state
  const zonesWithPreview = useMemo(() => {
    // If editing, merge the preview params into the existing zone
    if (editingZone && previewZoneParams) {
      return zones.map((z) =>
        z.id === editingZone.id
          ? {
              ...z,
              name: previewZoneParams.name,
              color: previewZoneParams.color,
              transparency: previewZoneParams.transparency,
              borderWidth: previewZoneParams.borderWidth,
            }
          : z
      );
    }

    // If creating, add a temporary zone
    if (pendingCoordinates) {
      const tempId = "temp-new-zone";
      const newZone: ZoneData = {
        id: tempId,
        name: previewZoneParams?.name || "",
        color: previewZoneParams?.color || "#60a5fa",
        transparency: previewZoneParams?.transparency ?? 0.5,
        borderWidth: previewZoneParams?.borderWidth ?? 2,
        coordinates: pendingCoordinates,
      };
      return [...zones, newZone];
    }

    return zones;
  }, [zones, editingZone, pendingCoordinates, previewZoneParams]);

  // Handle polygon completion from drawing
  const handlePolygonComplete = useCallback(
    (coordinates: [number, number][]) => {
      setPendingCoordinates(coordinates);
      setEditingZone(null);
      setPreviewZoneParams(null);
      setPanelOpen(true);
      setIsDrawActive(false);
    },
    []
  );

  // Handle zone creation/update from panel
  const handlePanelSubmit = useCallback(
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
                  // Keep current coordinates (they might have been edited)
                  coordinates: editingZone.coordinates,
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
      setPanelOpen(false);
      setPendingCoordinates(null);
      setEditingZone(null);
      setPreviewZoneParams(null);
    },
    [editingZone, pendingCoordinates]
  );

  // Handle coordinate updates from vertex editing
  const handleUpdateZoneCoordinates = useCallback(
    (zoneId: string, newCoords: [number, number][]) => {
      // If updating the temp new zone, update pendingCoordinates
      if (zoneId === "temp-new-zone") {
        setPendingCoordinates(newCoords);
        return;
      }

      // Update zone list
      setZones((prev) =>
        prev.map((z) =>
          z.id === zoneId ? { ...z, coordinates: newCoords } : z
        )
      );
      // Also update editingZone state if it's the one being edited
      if (editingZone && editingZone.id === zoneId) {
        setEditingZone((prev) =>
          prev ? { ...prev, coordinates: newCoords } : null
        );
      }
    },
    [editingZone]
  );

  // Handle edit zone
  const handleEditZone = useCallback((zone: ZoneData) => {
    setEditingZone(zone);
    setPendingCoordinates(null);
    setPreviewZoneParams({
      name: zone.name,
      color: zone.color,
      transparency: zone.transparency,
      borderWidth: zone.borderWidth,
    });
    setPanelOpen(true);
  }, []);

  // Handle delete zone
  const handleDeleteZone = useCallback((zoneId: string) => {
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
  }, []);

  // Handle delete from panel
  const handleDeleteFromPanel = useCallback(() => {
    if (editingZone) {
      setZones((prev) => prev.filter((z) => z.id !== editingZone.id));
      setPanelOpen(false);
      setEditingZone(null);
      setPreviewZoneParams(null);
    }
  }, [editingZone]);

  // Handle panel close
  const handlePanelClose = useCallback(() => {
    setPanelOpen(false);
    setPendingCoordinates(null);
    setEditingZone(null);
    setPreviewZoneParams(null);
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
          zones={zonesWithPreview}
          showBoundaries={showBoundaries}
          onEditZone={handleEditZone}
          onDeleteZone={handleDeleteZone}
          editingZoneId={
            editingZone?.id ??
            (pendingCoordinates ? "temp-new-zone" : undefined)
          }
          onUpdateZoneCoordinates={handleUpdateZoneCoordinates}
        />

        {panelOpen && (
          <ZonePropertiesPanel
            onClose={handlePanelClose}
            onSubmit={handlePanelSubmit}
            onDelete={editingZone ? handleDeleteFromPanel : undefined}
            onValuesChange={setPreviewZoneParams}
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
        )}
      </Map>
    </Card>
  );
}
