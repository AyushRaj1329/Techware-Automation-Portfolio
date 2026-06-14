import { LayoutDashboard, FolderKanban } from "lucide-react";

// Single source of truth for customer modules.
// Sidebar navigation and routes are both generated from this list.
export const customerModules = [
  {
    key: "overview",
    label: "Dashboard",
    path: "/customer",
    icon: LayoutDashboard,
    description: "Your personal dashboard overview.",
  },
  {
    key: "projects",
    label: "Projects",
    path: "/customer/projects",
    icon: FolderKanban,
    description: "View the status and details of your projects.",
  },
];
