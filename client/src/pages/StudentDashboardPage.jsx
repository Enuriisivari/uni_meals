import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  Clock3,
} from "lucide-react";
import api from "../lib/api";

const initialCheckout = {
  studentName: "",
  deliveryLocation: "",
  notes: "",
};

export function StudentDashboardPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [checkout, setCheckout] = useState(initialCheckout);
  const [orders, setOrders] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const { data } = await api.get("/student/menu-items");
        setMenuItems(Array.isArray(data) ? data : []);
      } catch {
        setErrorMessage("Unable to load menu items right now.");
      } finally {
        setIsLoadingMenu(false);
      }
    };

    loadMenu();
  }, []);

  const cartItems = useMemo(
    () =>
      menuItems
        .filter((item) => cart[item.id] > 0)
        .map((item) => ({
          ...item,
          quantity: cart[item.id],
        })),
    [cart, menuItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const loadOrders = async (studentName) => {
    if (!studentName.trim()) {
      setOrders([]);
      return;
    }

    try {
      const { data } = await api.get("/student/orders", {
        params: { studentName },
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setErrorMessage("Unable to load your recent orders.");
    }
  };

  const updateQuantity = (id, nextQuantity) => {
    setCart((current) => {
      if (nextQuantity <= 0) {
        const nextCart = { ...current };
        delete nextCart[id];
        return nextCart;
      }

      return {
        ...current,
        [id]: nextQuantity,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!checkout.studentName.trim() || !checkout.deliveryLocation.trim()) {
      setErrorMessage("Student name and delivery location are required.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage("Add at least one menu item before placing an order.");
      return;
    }

    setIsSubmittingOrder(true);

    try {
      await api.post("/student/orders", {
        studentName: checkout.studentName,
        deliveryLocation: checkout.deliveryLocation,
        notes: checkout.notes,
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      });

      setSuccessMessage("Order placed successfully.");
      setCart({});
      setCheckout((current) => ({ ...current, notes: "" }));
      await loadOrders(checkout.studentName);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Unable to place your order."
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleLookupOrders = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    await loadOrders(checkout.studentName);
  };

  const formatTime = (value) =>
    new Date(value).toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#fff8f0_0%,_#ffffff_32%,_#eef3ff_100%)] text-[#172033]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0d1b52_0%,#18388f_100%)] px-6 py-8 text-white shadow-2xl sm:px-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm">
            <Sparkles className="h-4 w-4 text-[#ffb06f]" />
            Student dashboard
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-2xl text-4xl font-black leading-tight">
                Order meals from the canteen without waiting in line.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#d7e0ff]">
                Browse available items, place your order, and track recent
                requests from one page.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-2xl font-bold">{menuItems.length}</div>
                <div className="text-[#d7e0ff]">Available Items</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-2xl font-bold">{cartItems.length}</div>
                <div className="text-[#d7e0ff]">Cart Items</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-2xl font-bold">Rs. {totalPrice}</div>
                <div className="text-[#d7e0ff]">Cart Total</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="h-5 w-5 text-[#f58220]" />
              <h2 className="text-2xl font-bold">Today&apos;s Menu</h2>
            </div>

            {isLoadingMenu ? (
              <div className="rounded-3xl border border-[#dfe5f2] bg-white p-8 text-sm text-[#6b7692] shadow-sm">
                Loading available menu items...
              </div>
            ) : menuItems.length === 0 ? (
              <div className="rounded-3xl border border-[#dfe5f2] bg-white p-8 text-sm text-[#6b7692] shadow-sm">
                No items are available right now.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {menuItems.map((item) => {
                  const quantity = cart[item.id] || 0;

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-[1.75rem] border border-[#dfe5f2] bg-white shadow-sm"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-48 w-full object-cover"
                      />
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f58220]">
                              {item.category}
                            </div>
                            <h3 className="text-xl font-bold">{item.name}</h3>
                          </div>
                          <div className="rounded-full bg-[#0d1b52] px-3 py-1 text-sm font-semibold text-white">
                            Rs. {item.price}
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-[#6b7692]">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-[#dfe5f2] bg-[#f4f6fb] p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, quantity - 1)}
                              className="h-9 w-9 rounded-full bg-white text-lg text-[#243356] shadow-sm"
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, quantity + 1)}
                              className="h-9 w-9 rounded-full bg-white text-lg text-[#243356] shadow-sm"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="rounded-full bg-[#f58220] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e46f0a]"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="rounded-[1.75rem] border border-[#dfe5f2] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[#f58220]" />
                <h2 className="text-2xl font-bold">Your Order</h2>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#243356]">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={checkout.studentName}
                    onChange={(event) =>
                      setCheckout((current) => ({
                        ...current,
                        studentName: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-[#dfe5f2] bg-[#f4f6fb] px-4 py-3 text-sm outline-none focus:border-[#f58220]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#243356]">
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    value={checkout.deliveryLocation}
                    onChange={(event) =>
                      setCheckout((current) => ({
                        ...current,
                        deliveryLocation: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-[#dfe5f2] bg-[#f4f6fb] px-4 py-3 text-sm outline-none focus:border-[#f58220]"
                    placeholder="Library entrance, lecture hall, hostel gate"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#243356]">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={checkout.notes}
                    onChange={(event) =>
                      setCheckout((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    className="w-full resize-none rounded-2xl border border-[#dfe5f2] bg-[#f4f6fb] px-4 py-3 text-sm outline-none focus:border-[#f58220]"
                    placeholder="Extra sambol, less spicy, call on arrival..."
                  />
                </div>

                <div className="rounded-2xl bg-[#f4f6fb] p-4">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-[#6b7692]">
                      Your cart is empty.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-semibold">
                            Rs. {item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t border-[#dfe5f2] pt-3 text-sm font-bold">
                        <span>Total</span>
                        <span>Rs. {totalPrice}</span>
                      </div>
                    </div>
                  )}
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {successMessage}
                  </div>
                ) : null}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="flex-1 rounded-2xl bg-[#0d1b52] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#18388f] disabled:opacity-60"
                  >
                    {isSubmittingOrder ? "Placing Order..." : "Place Order"}
                  </button>
                  <button
                    type="button"
                    onClick={handleLookupOrders}
                    className="rounded-2xl border border-[#dfe5f2] bg-white px-4 py-3 text-sm font-semibold text-[#243356]"
                  >
                    My Orders
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-[1.75rem] border border-[#dfe5f2] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-[#f58220]" />
                <h2 className="text-2xl font-bold">Recent Orders</h2>
              </div>

              {orders.length === 0 ? (
                <p className="text-sm text-[#6b7692]">
                  Enter your name and click `My Orders` to view recent orders.
                </p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-[#dfe5f2] bg-[#f4f6fb] p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="font-semibold text-[#0d1b52]">
                          {order.id}
                        </div>
                        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-[#243356]">
                          {order.status}
                        </div>
                      </div>
                      <div className="mb-2 flex items-center gap-2 text-sm text-[#6b7692]">
                        <MapPin className="h-4 w-4" />
                        {order.deliveryLocation}
                      </div>
                      <div className="mb-2 text-xs text-[#9aa4bf]">
                        {formatTime(order.orderTime)}
                      </div>
                      <div className="text-sm text-[#5f6983]">
                        {order.items
                          .map((item) => `${item.quantity}x ${item.name}`)
                          .join(", ")}
                      </div>
                      <div className="mt-3 text-sm font-bold text-[#0d1b52]">
                        Rs. {order.totalPrice}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
