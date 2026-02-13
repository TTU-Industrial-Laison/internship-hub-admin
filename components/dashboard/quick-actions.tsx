import { PlusCircle, UserPlus, Map, Download, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export const QuickActions = () => {
  const actions = [
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

  return (
    <section className="max-w-70 w-full p-4 bg-white rounded-lg border border-gray-300 shadow-card">
      <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              variant="secondary"
              className="w-full flex bg-secondary/40 hover:bg-primary hover:text-white items-center justify-between px-4 py-3 rounded-lg transition"
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                <p className="text-base">{action.label}</p>
              </div>
              <ArrowRight size={16} />
            </Button>
          );
        })}
      </div>
    </section>
  );
};
