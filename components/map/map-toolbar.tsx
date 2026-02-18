"use client";

import { Search, Pentagon, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function MapToolbar() {
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(true);

  return (
    <div className="absolute top-4 left-2 z-10 flex items-center bg-white rounded-lg px-2 h-12 min-w-[500px] border border-gray-400 shadow-card">
      {/* Search Section */}
      <div className="flex items-center gap-1 px-2 flex-1">
        <Search className="size-4" />
        <Input
          type="text"
          placeholder="Search zones..."
          className="bg-transparent border-none outline-none shadow-none text-sm w-full h-8 focus-visible:ring-0"
        />
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />

      {/* Actions */}
      <div className="flex items-center gap-1 px-1 h-full">
        {/* Draw Zone Button */}
        <Button
          variant={isDrawActive ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsDrawActive(!isDrawActive)}
          className={cn(
            "flex items-center gap-2 h-9 px-4 rounded-lg transition-all text-xs",
            isDrawActive
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : ""
          )}
        >
          <Pentagon className="size-4" />
          <span>Draw Zone</span>
        </Button>

        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />

        {/* Zone Boundaries Toggle */}
        <div className="flex items-center gap-4 px-4 py-1.5 h-9 text-xs whitespace-nowrap">
          <div className="flex items-center gap-2">
            <MapIcon className="size-4" />
            <span>Boundaries</span>
          </div>
          <Switch
            checked={showBoundaries}
            onCheckedChange={setShowBoundaries}
            className="scale-75 data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    </div>
  );
}
