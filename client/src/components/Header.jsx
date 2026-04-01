import React from "react";
import { Bell, Search, ChevronDown } from "lucide-react";

export function Header({
  title,
  user,
  notifications = [],
  unreadCount = 0,
  isNotificationsOpen = false,
  onToggleNotifications,
  onNotificationClick,
}) {
  const avatarUrl =
    user?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Canteen Staff"
    )}&background=e5e7eb&color=111827`;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#dfe5f2] bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold capitalize text-[#0d1b52]">
        {title}
      </h1>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-[#7d87a3]" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full rounded-xl border border-[#dfe5f2] bg-[#f4f6fb] py-2 pl-10 pr-3 leading-5 text-sm placeholder-[#7d87a3] transition-colors focus:border-[#f58220] focus:outline-none focus:ring-1 focus:ring-[#f58220]"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative rounded-full p-2 text-[#5f6983] transition-colors hover:bg-[#fff1e2] hover:text-[#f58220] focus:outline-none"
          >
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#f58220] px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
            <Bell className="h-6 w-6" />
          </button>

          {isNotificationsOpen ? (
            <div className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-2xl border border-[#dfe5f2] bg-white shadow-xl">
              <div className="border-b border-[#edf1f8] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[#0d1b52]">
                    Notifications
                  </h3>
                  <span className="text-xs text-[#6b7692]">
                    {notifications.length} items
                  </span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-[#6b7692]">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => onNotificationClick?.(notification)}
                      className="block w-full border-b border-[#edf1f8] px-4 py-3 text-left transition-colors hover:bg-[#f8faff]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#0d1b52]">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#6b7692]">
                            {notification.message}
                          </p>
                        </div>
                        {notification.isUnread ? (
                          <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#f58220]" />
                        ) : null}
                      </div>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#9aa4bf]">
                        {notification.timeLabel}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex cursor-pointer items-center gap-2 border-l border-[#dfe5f2] pl-2 transition-opacity hover:opacity-80">
          <img
            className="h-8 w-8 rounded-full border border-[#dfe5f2] object-cover"
            src={avatarUrl}
            alt="User avatar"
          />
          <div className="hidden items-center gap-1 md:flex">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#243356]">
                {user?.name || "Canteen Staff"}
              </span>
              <span className="text-xs text-[#6b7692]">{user?.email}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-[#6b7692]" />
          </div>
        </div>
      </div>
    </header>
  );
}
