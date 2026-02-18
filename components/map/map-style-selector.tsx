"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers } from "lucide-react";
import { useMap } from "@/components/ui/map";
import { useMemo } from "react";
import { MapStyleKey } from "@/lib/constants/map";

interface MapStyleSelectorProps {
  value: MapStyleKey;
  onChange: (value: MapStyleKey) => void;
}

export function MapStyleSelector({
  value,
  onChange,
}: Readonly<MapStyleSelectorProps>) {
  const { map } = useMap();
  const mapContainer = useMemo(() => map?.getContainer(), [map]);

  return (
    <div className="absolute top-4 right-3 z-10 w-48">
      <Select
        value={value}
        onValueChange={(val) => onChange(val as MapStyleKey)}
      >
        <SelectTrigger className="h-11! bg-white! backdrop-blur rounded-lg text-xs shadow-none hover:bg-white transition-all font-medium border border-gray-400">
          <div className="flex items-center gap-2">
            <Layers className="size-3.5 text-slate-500" />
            <SelectValue placeholder="Map Style" />
          </div>
        </SelectTrigger>
        <SelectContent
          container={mapContainer}
          className="bg-white backdrop-blur border-slate-200 rounded-lg shadow-card"
        >
          <SelectItem
            value="osm_bright"
            className="text-xs font-medium focus:bg-primary/5"
          >
            OpenFreeMap Bright
          </SelectItem>
          <SelectSeparator />
          <SelectItem
            value="osm_liberty"
            className="text-xs font-medium focus:bg-primary/5"
          >
            OpenFreeMap 3D
          </SelectItem>
          <SelectSeparator />
          <SelectItem
            value="carto_voyager"
            className="text-xs font-medium focus:bg-primary/5"
          >
            Carto Voyager
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
