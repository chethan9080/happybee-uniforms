import {
  LayoutDashboard, Package, UserCheck, Receipt,
  FileText, RotateCcw, ShirtIcon, LogOut,
  BarChart3, Database, ClipboardList,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const workerGroups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, color: "text-yellow-600", bg: "bg-yellow-50" }],
  },
  {
    label: "Inventory",
    items: [
      { title: "Stock",   url: "/stock",   icon: Package,   color: "text-yellow-600", bg: "bg-yellow-50" },
      { title: "Returns", url: "/returns", icon: RotateCcw, color: "text-yellow-600", bg: "bg-yellow-50" },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Attendance",   url: "/attendance",   icon: UserCheck, color: "text-yellow-600", bg: "bg-yellow-50" },
      { title: "Billing",      url: "/billing",      icon: Receipt,   color: "text-yellow-600", bg: "bg-yellow-50" },
      { title: "Bills Record", url: "/bills-record", icon: FileText,  color: "text-yellow-600", bg: "bg-yellow-50" },
    ],
  },
];

const ownerGroups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/owner", icon: BarChart3, color: "text-yellow-600", bg: "bg-yellow-50" }],
  },
  {
    label: "Inventory",
    items: [
      { title: "Stock Overview",  url: "/owner/stock",     icon: Package,  color: "text-yellow-600", bg: "bg-yellow-50" },
      { title: "Remaining Stock", url: "/owner/remaining", icon: Database, color: "text-yellow-600", bg: "bg-yellow-50" },
    ],
  },
  {
    label: "Planning & Records",
    items: [
      { title: "New Data",     url: "/owner/planning", icon: ClipboardList, color: "text-yellow-600", bg: "bg-yellow-50" },
      { title: "Bills Record", url: "/owner/bills",    icon: FileText,      color: "text-yellow-600", bg: "bg-yellow-50" },
    ],
  },
];

interface AppSidebarProps { role: "worker" | "owner"; }

export function AppSidebar({ role }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const groups = role === "owner" ? ownerGroups : workerGroups;

  return (
    <Sidebar collapsible="icon" className="border-r border-yellow-100 bg-[#fffdf5]">
      <SidebarContent className="flex flex-col gap-0 py-4 bg-[#fffdf5]">

        {/* Brand */}
        <div className={`flex items-center gap-3 px-5 pb-6 mb-2 border-b border-yellow-100 ${collapsed ? "justify-center px-3" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-200 flex items-center justify-center shrink-0 shadow-md shadow-yellow-100">
            <ShirtIcon className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-base text-yellow-700">
                HappyB.Pvt.Ltd
              </span>
              <p className="text-[10px] text-stone-400 leading-none mt-0.5">Uniform Management</p>
            </div>
          )}
        </div>

        {/* Nav groups */}
        <div className="flex-1 px-3 space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    end
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-500 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-150 ${collapsed ? "justify-center" : ""}`}
                    activeClassName="bg-yellow-300 text-yellow-900 font-semibold shadow-sm shadow-yellow-100"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`${item.color}`} style={{ width: "16px", height: "16px" }} />
                    </div>
                    {!collapsed && <span className="text-[14px]">{item.title}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-yellow-100 bg-[#fffdf5]">
        <Button
          variant="ghost"
          className={`w-full h-11 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors ${collapsed ? "justify-center px-0" : "justify-start"}`}
          onClick={() => navigate("/")}
        >
          <LogOut className={`h-4 w-4 ${!collapsed ? "mr-3" : ""}`} />
          {!collapsed && <span className="text-[14px] font-medium">Sign out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
