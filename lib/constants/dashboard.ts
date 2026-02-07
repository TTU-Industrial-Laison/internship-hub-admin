import {
  LayoutDashboard,
  Calendar,
  Users,
  GraduationCap,
  Map,
} from "lucide-react";

export const sideBarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Map & Zones", href: "/dashboard/map", icon: Map },
  {
    label: "Internship Periods",
    href: "/dashboard/periods",
    icon: Calendar,
  },
  { label: "Supervisors", href: "/dashboard/supervisors", icon: Users },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap },
] as const;
