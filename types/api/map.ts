import { ZoneFormData } from "@/lib/validations/forms/map";

// --- Zone Types ---
export type ZoneData = {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
  transparency: number;
  borderWidth: number;
};

export interface MapDrawingLayerProps {
  /** Whether drawing mode is active */
  isDrawActive: boolean;
  /** Called when a polygon is completed */
  onPolygonComplete: (coordinates: [number, number][]) => void;
  /** Completed zones to render */
  zones: ZoneData[];
  /** Whether zone boundaries are visible */
  showBoundaries: boolean;
  /** Called when user wants to edit a zone */
  onEditZone: (zone: ZoneData) => void;
  /** Called when user wants to delete a zone */
  onDeleteZone: (zoneId: string) => void;
}

export interface ZonePropertiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ZoneFormData) => void;
  onDelete?: () => void;
  initialData?: Partial<ZoneFormData>;
  isEditing?: boolean;
}
