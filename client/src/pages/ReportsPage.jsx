import React, { useMemo } from "react";
import {
  BarChart3,
  CircleDollarSign,
  Clock3,
  ShoppingBag,
} from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";

const STATUS_LABELS = ["pending", "preparing", "ready", "completed", "cancelled"];

export function ReportsPage({ orders }) {
  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
      ),
    [orders]
  );

  const reportStats = useMemo(() => {
    const completedRevenue = orders
      .filter((order) => order.status === "completed")
      .reduce((total, order) => total + order.totalPrice, 0);

    const activeOrders = orders.filter(
      (order) => order.status === "pending" || order.status === "preparing"
    ).length;

    return [
      {
        label: "Total Orders",
        value: orders.length,
        icon: ShoppingBag,
        accent: "bg-[#e8eeff] text-[#0d1b52]",
      },
      {
        label: "Completed Revenue",
        value: `Rs. ${completedRevenue}`,
        icon: CircleDollarSign,
        accent: "bg-emerald-100 text-emerald-600",
      },
      {
        label: "Active Orders",
        value: activeOrders,
        icon: Clock3,
        accent: "bg-amber-100 text-amber-600",
      },
      {
        label: "Cancelled Orders",
        value: orders.filter((order) => order.status === "cancelled").length,
        icon: BarChart3,
        accent: "bg-rose-100 text-rose-600",
      },
    ];
  }, [orders]);

  const statusSummary = useMemo(
    () =>
      STATUS_LABELS.map((status) => ({
        status,
        count: orders.filter((order) => order.status === status).length,
      })),
    [orders]
  );

  const formatDateTime = (value) =>
    new Date(value).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#dfe5f2] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#6b7692]">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#0d1b52]">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
        <section className="rounded-xl border border-[#dfe5f2] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#0d1b52]">
                Report Summary
              </h2>
              <p className="text-sm text-[#6b7692]">
                Order counts grouped by current status.
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-[#f58220]" />
          </div>

          <div className="space-y-3">
            {statusSummary.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-lg bg-[#f8faff] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                </div>
                <span className="text-lg font-bold text-[#0d1b52]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#dfe5f2] bg-white shadow-sm">
          <div className="border-b border-[#edf1f8] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#0d1b52]">
              Order History
            </h2>
            <p className="mt-1 text-sm text-[#6b7692]">
              Full staff-facing history of all recorded canteen orders.
            </p>
          </div>

          {sortedOrders.length === 0 ? (
            <div className="px-6 py-10 text-sm text-[#6b7692]">
              No orders are available for reporting yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#edf1f8] bg-[#f8faff] text-xs uppercase tracking-wider text-[#7d87a3]">
                    <th className="px-6 py-3 font-medium">Order ID</th>
                    <th className="px-6 py-3 font-medium">Student</th>
                    <th className="px-6 py-3 font-medium">Placed At</th>
                    <th className="px-6 py-3 font-medium">Location</th>
                    <th className="px-6 py-3 font-medium">Items</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf1f8]">
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="align-top hover:bg-[#f8faff]">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#0d1b52]">
                        {order.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#243356]">
                        {order.studentName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7692]">
                        {formatDateTime(order.orderTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5f6983]">
                        {order.deliveryLocation}
                      </td>
                      <td className="min-w-56 px-6 py-4 text-sm text-[#5f6983]">
                        {order.items
                          .map((item) => `${item.quantity}x ${item.name}`)
                          .join(", ")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#0d1b52]">
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
          )}
        </section>
      </div>
    </div>
  );
}
