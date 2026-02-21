import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDeviceInfo() {
  const ua = navigator.userAgent;

  const OS_PATTERNS: [RegExp, string][] = [
    [/Mac OS/, "macOS"],
    [/Windows/, "Windows"],
    [/Android/, "Android"],
    [/iPhone|iPad/, "iOS"],
    [/Linux/, "Linux"],
  ];

  const BROWSER_PATTERNS: [RegExp, string][] = [
    [/Chrome(?!.*Edg)/, "Chrome"],
    [/Safari(?!.*Chrome)/, "Safari"],
    [/Firefox/, "Firefox"],
    [/Edg/, "Edge"],
  ];

  const os =
    OS_PATTERNS.find(([pattern]) => pattern.test(ua))?.[1] ?? "Unknown OS";
  const browser =
    BROWSER_PATTERNS.find(([pattern]) => pattern.test(ua))?.[1] ??
    "Unknown Browser";
  const device = /Mobi|Android|iPhone|iPad/i.test(ua)
    ? "Mobile Device"
    : "Desktop";

  return { device, browser, os };
}

export const getStatusColor = (status: string) => {
   switch (status) {
     case "ONGOING":
       return "bg-yellow-400 text-black";
     case "COMPLETED":
       return "bg-green-600 text-white";
     default:
       return "bg-slate-500 text-white";
   }
};
 
// Formats ISO string to e.g. "2nd April 2024"
export const formatDate = (isoString: string): string => {
  return format(new Date(isoString), "do MMMM yyyy");
};


export function getPolygonCentroid(coordinates: [number, number][]): [number, number] {
  let sumLng = 0;
  let sumLat = 0;
  for (const [lng, lat] of coordinates) {
    sumLng += lng;
    sumLat += lat;
  }
  return [sumLng / coordinates.length, sumLat / coordinates.length];
}

export function getMidpoint(
  p1: [number, number],
  p2: [number, number]
): [number, number] {
  return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}