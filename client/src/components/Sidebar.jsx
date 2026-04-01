import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  ToggleLeft,
  BarChart3,
  UserCircle2,
  LogOut,
} from "lucide-react";

export function Sidebar({ activeSection, onSectionChange, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "menu", label: "Menu", icon: Utensils },
    { id: "availability", label: "Availability", icon: ToggleLeft },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: UserCircle2 },
  ];

  return (
    <div className="z-20 flex h-screen w-20 flex-shrink-0 flex-col border-r border-[#1f3f97]/10 bg-[linear-gradient(180deg,#0d1b52_0%,#132c7a_100%)] text-white shadow-2xl transition-all duration-300 lg:w-64">
      <div className="flex h-16 items-center justify-center border-b border-white/10 lg:justify-start lg:px-6">
        <div className="flex items-center gap-3 text-[#ffd7b3]">
          <Utensils className="h-8 w-8 flex-shrink-0" />
          <span className="hidden whitespace-nowrap text-xl font-bold lg:block">
            Campus Canteen
          </span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-6 lg:px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${isActive ? "bg-white/12 text-white shadow-lg" : "text-white/72 hover:bg-white/8 hover:text-white"}`}
            >
              {isActive ? (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#f58220]" />
              ) : null}
              <Icon
                className={`h-6 w-6 flex-shrink-0 ${isActive ? "text-[#ffb06f]" : "text-white/60 group-hover:text-white"}`}
              />
              <span
                className={`hidden font-medium lg:block ${isActive ? "text-white" : ""}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-3 text-[#ffd0c7] transition-colors hover:bg-white/8 lg:justify-start"
        >
          <LogOut className="h-6 w-6 flex-shrink-0" />
          <span className="hidden font-medium lg:block">Logout</span>
        </button>
      </div>
    </div>
  );
}
