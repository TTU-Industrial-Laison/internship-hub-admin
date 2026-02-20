import {
  Calendar,
  Download,
  GraduationCap,
  LayoutDashboard,
  Map,
  PlusCircle,
  UserPlus,
  Users,
} from "lucide-react";

export const sideBarNavItems = [
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


 export const actions = [
   {
     label: "Add Student",
     icon: PlusCircle,
   },
   {
     label: "Invite Supervisor",
     icon: UserPlus,
   },
   {
     label: "Manage Zones",
     icon: Map,
   },
   {
     label: "Export Report",
     icon: Download,
   },
 ];
