import React from "react";
import { ShoppingBag, Clock, ChefHat, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";

export function DashboardPage({ orders }) {
  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-[#0d1b52]",
      bgColor: "bg-[#e8eeff]",
    },
    {
      label: "Pending",
      value: orders.filter((order) => order.status === "pending").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      label: "Preparing",
      value: orders.filter((order) => order.status === "preparing").length,
      icon: ChefHat,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Completed",
      value: orders.filter((order) => order.status === "completed").length,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
    )
    .slice(0, 5);

  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl border border-[#dfe5f2] bg-white p-6 shadow-sm"
            >
              <div className={`rounded-lg p-3 ${stat.bgColor} ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#6b7692]">{stat.label}</p>
                <p className="text-2xl font-bold text-[#0d1b52]">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#dfe5f2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#edf1f8] px-6 py-5">
          <h2 className="text-lg font-semibold text-[#0d1b52]">Recent Orders</h2>
          <button className="text-sm font-medium text-[#f58220] hover:text-[#e46f0a]">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf1f8] bg-[#f8faff] text-xs uppercase tracking-wider text-[#7d87a3]">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1f8]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#f8faff]">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#0d1b52]">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[#5f6983]">
                    {order.studentName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7692]">
                    {formatTime(order.orderTime)}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 text-sm text-[#5f6983]">
                    {order.items
                      .map((item) => `${item.quantity}x ${item.name}`)
                      .join(", ")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#0d1b52]">
                    Rs. {order.totalPrice}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
