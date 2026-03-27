import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";

export function OrdersPage({
  orders,
  onUpdateOrderStatus,
  isUpdatingOrder,
  updateError,
}) {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!orders.length) {
      setSelectedOrderId(null);
      return;
    }

    const stillExists = orders.some((order) => order.id === selectedOrderId);

    if (!stillExists) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  const filteredOrders = useMemo(
    () =>
      orders
        .filter(
          (order) => filterStatus === "all" || order.status === filterStatus
        )
        .filter((order) => {
          const searchValue = searchTerm.trim().toLowerCase();

          if (!searchValue) {
            return true;
          }

          return (
            order.id.toLowerCase().includes(searchValue) ||
            order.studentName.toLowerCase().includes(searchValue) ||
            order.deliveryLocation.toLowerCase().includes(searchValue)
          );
        })
        .sort(
          (a, b) =>
            new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
        ),
    [filterStatus, orders, searchTerm]
  );

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 lg:flex-row">
      <div className="flex w-full flex-shrink-0 flex-col overflow-hidden rounded-xl border border-[#dfe5f2] bg-white shadow-sm lg:w-1/3">
        <div className="space-y-4 border-b border-[#dfe5f2] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d87a3]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search orders..."
              className="w-full rounded-lg border border-[#dfe5f2] bg-[#f8faff] py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f58220]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {["all", "pending", "preparing", "ready", "completed", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filterStatus === status ? "bg-[#0d1b52] text-white" : "bg-[#eef2fa] text-[#5f6983] hover:bg-[#e3e9f5]"}`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-2">
          {filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#6b7692]">
              No orders found.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${selectedOrderId === order.id ? "border-[#f1c48d] bg-[#fff5eb] shadow-sm" : "border-[#edf1f8] hover:border-[#d3dced] hover:bg-[#f8faff]"}`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="font-semibold text-[#0d1b52]">{order.id}</span>
                  <span className="text-xs text-[#6b7692]">
                    {formatTime(order.orderTime)}
                  </span>
                </div>
                <div className="mb-2 text-sm font-medium text-[#243356]">
                  {order.studentName}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0d1b52]">
                    Rs. {order.totalPrice}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#dfe5f2] bg-white shadow-sm lg:w-2/3">
        {selectedOrder ? (
          <>
            <div className="flex items-start justify-between border-b border-[#dfe5f2] bg-[#f8faff] p-6">
              <div>
                <h2 className="mb-1 text-2xl font-bold text-[#0d1b52]">
                  Order {selectedOrder.id}
                </h2>
                <p className="flex items-center gap-1 text-sm text-[#6b7692]">
                  <Clock className="h-4 w-4" /> Placed at{" "}
                  {formatTime(selectedOrder.orderTime)}
                </p>
              </div>
              <StatusBadge
                status={selectedOrder.status}
                className="px-3 py-1 text-sm"
              />
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              {updateError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {updateError}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#0d1b52]">
                    Customer Details
                  </h3>
                  <div className="space-y-3 rounded-lg bg-[#f8faff] p-4">
                    <p className="font-medium text-[#0d1b52]">
                      {selectedOrder.studentName}
                    </p>
                    <div className="flex items-start gap-2 text-sm text-[#5f6983]">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7d87a3]" />
                      <span>{selectedOrder.deliveryLocation}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes ? (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#0d1b52]">
                      Order Notes
                    </h3>
                    <div className="flex items-start gap-2 rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                      <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#0d1b52]">
                  Order Items
                </h3>
                <div className="overflow-hidden rounded-lg border border-[#dfe5f2]">
                  <table className="w-full text-left">
                    <thead className="border-b border-[#dfe5f2] bg-[#f8faff] text-xs uppercase text-[#7d87a3]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Item</th>
                        <th className="px-4 py-3 text-center font-medium">Qty</th>
                        <th className="px-4 py-3 text-right font-medium">Price</th>
                        <th className="px-4 py-3 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dfe5f2]">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0d1b52]">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-[#5f6983]">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-[#5f6983]">
                            Rs. {item.price}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-[#0d1b52]">
                            Rs. {item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-[#dfe5f2] bg-[#f8faff]">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-4 text-right text-sm font-bold text-[#0d1b52]"
                        >
                          Total Amount
                        </td>
                        <td className="px-4 py-4 text-right text-lg font-bold text-[#f58220]">
                          Rs. {selectedOrder.totalPrice}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#dfe5f2] bg-[#f8faff] p-4">
              {selectedOrder.status === "pending" ? (
                <>
                  <button
                    onClick={() =>
                      onUpdateOrderStatus(selectedOrder.id, "cancelled")
                    }
                    disabled={isUpdatingOrder}
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    Reject Order
                  </button>
                  <button
                    onClick={() =>
                      onUpdateOrderStatus(selectedOrder.id, "preparing")
                    }
                    disabled={isUpdatingOrder}
                    className="rounded-lg bg-[#0d1b52] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#18388f] disabled:opacity-60"
                  >
                    Accept Order
                  </button>
                </>
              ) : null}

              {selectedOrder.status === "preparing" ? (
                <button
                  onClick={() => onUpdateOrderStatus(selectedOrder.id, "ready")}
                  disabled={isUpdatingOrder}
                  className="rounded-lg bg-[#f58220] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#e46f0a] disabled:opacity-60"
                >
                  Mark Preparation Complete
                </button>
              ) : null}

              {selectedOrder.status === "ready" ? (
                <button
                  onClick={() =>
                    onUpdateOrderStatus(selectedOrder.id, "completed")
                  }
                  disabled={isUpdatingOrder}
                  className="rounded-lg bg-[#0f7b58] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0b6a4c] disabled:opacity-60"
                >
                  Mark as Completed
                </button>
              ) : null}

              {selectedOrder.status === "completed" ||
              selectedOrder.status === "cancelled" ? (
                <div className="py-2 text-sm italic text-[#6b7692]">
                  This order is {selectedOrder.status} and cannot be modified.
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-[#9aa4bf]">
            <ShoppingCart className="mb-4 h-16 w-16 text-[#c8d1e3]" />
            <p className="text-lg font-medium text-[#6b7692]">
              Select an order to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
