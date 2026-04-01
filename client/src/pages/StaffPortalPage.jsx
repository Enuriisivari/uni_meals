import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { DashboardPage } from "./DashboardPage";
import { OrdersPage } from "./OrdersPage";
import { MenuPage } from "./MenuPage";
import { AvailabilityPage } from "./AvailabilityPage";
import { ReportsPage } from "./ReportsPage";
import { StaffProfilePage } from "./StaffProfilePage";
import { AuthPage } from "./AuthPage";
import api from "../lib/api";

const SESSION_KEY = "canteenStaffSession";
const NOTIFICATION_READ_KEY = "canteenStaffNotificationReadKeys";

const getStoredSession = () => {
  const storedSession = localStorage.getItem(SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export function StaffPortalPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [session, setSession] = useState(getStoredSession);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [authError, setAuthError] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [isSavingMenuItem, setIsSavingMenuItem] = useState(false);
  const [menuSaveError, setMenuSaveError] = useState("");
  const [isDeletingMenuItem, setIsDeletingMenuItem] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [orderUpdateError, setOrderUpdateError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [readNotificationKeys, setReadNotificationKeys] = useState(() => {
    const storedKeys = localStorage.getItem(NOTIFICATION_READ_KEY);

    if (!storedKeys) {
      return [];
    }

    try {
      const parsedKeys = JSON.parse(storedKeys);
      return Array.isArray(parsedKeys) ? parsedKeys : [];
    } catch {
      localStorage.removeItem(NOTIFICATION_READ_KEY);
      return [];
    }
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      if (!session?.token) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        const nextSession = {
          ...session,
          user: data,
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      } catch {
        localStorage.removeItem(SESSION_KEY);
        setSession(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!session?.token) {
        return;
      }

      try {
        const { data } = await api.get("/menu-items");
        if (Array.isArray(data)) {
          setMenuItems(data);
        }
      } catch {
        setMenuItems([]);
      }
    };

    const fetchOrders = async () => {
      if (!session?.token) {
        return;
      }

      try {
        const { data } = await api.get("/orders");
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch {
        setOrders([]);
      }
    };

    fetchOrders();
    fetchMenuItems();

    const intervalId = window.setInterval(fetchOrders, 20000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [session?.token]);

  useEffect(() => {
    localStorage.setItem(
      NOTIFICATION_READ_KEY,
      JSON.stringify(readNotificationKeys)
    );
  }, [readNotificationKeys]);

  const persistSession = ({ user, token }) => {
    const nextSession = { user, token };
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const handleAuthSubmit = async ({ mode, name, email, password }) => {
    setIsSubmittingAuth(true);
    setAuthError("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login" ? { email, password } : { name, email, password };
      const { data } = await api.post(endpoint, payload);

      persistSession({
        user: data.user,
        token: data.token,
      });
    } catch (error) {
      setAuthError(
        error.response?.data?.error || "Unable to complete authentication."
      );
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setAuthError("");
    setActiveSection("dashboard");
  };

  const handleSaveProfile = async (profileData) => {
    setIsSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const { data } = await api.put("/auth/me", profileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const nextSession = {
        ...session,
        user: data.user,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setProfileSuccess("Profile updated successfully.");
      return data.user;
    } catch (error) {
      setProfileError(
        error.response?.data?.error || "Unable to update profile."
      );
      return null;
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddMenuItem = async (itemData) => {
    setIsSavingMenuItem(true);
    setMenuSaveError("");

    try {
      const { data } = await api.post("/menu-items", itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMenuItems((previousItems) => [data.item, ...previousItems]);
      return data.item;
    } catch (error) {
      setMenuSaveError(
        error.response?.data?.error || "Unable to create menu item."
      );
      return null;
    } finally {
      setIsSavingMenuItem(false);
    }
  };

  const handleUpdateMenuItem = async (itemId, itemData) => {
    setIsSavingMenuItem(true);
    setMenuSaveError("");

    try {
      const { data } = await api.put(`/menu-items/${itemId}`, itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMenuItems((previousItems) =>
        previousItems.map((item) => (item.id === itemId ? data.item : item))
      );

      return data.item;
    } catch (error) {
      setMenuSaveError(
        error.response?.data?.error || "Unable to update menu item."
      );
      return null;
    } finally {
      setIsSavingMenuItem(false);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    setIsDeletingMenuItem(true);
    setMenuSaveError("");

    try {
      await api.delete(`/menu-items/${itemId}`);
      setMenuItems((previousItems) =>
        previousItems.filter((item) => item.id !== itemId)
      );
      return true;
    } catch (error) {
      setMenuSaveError(
        error.response?.data?.error || "Unable to delete menu item."
      );
      return false;
    } finally {
      setIsDeletingMenuItem(false);
    }
  };

  const handleToggleMenuAvailability = async (itemId, available) => {
    setMenuSaveError("");

    const targetItem = menuItems.find((item) => item.id === itemId);

    if (!targetItem) {
      return false;
    }

    const payload = new FormData();
    payload.append("name", targetItem.name);
    payload.append("price", String(targetItem.price));
    payload.append("category", targetItem.category);
    payload.append("description", targetItem.description);
    payload.append("available", String(available));

    return Boolean(await handleUpdateMenuItem(itemId, payload));
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    setIsUpdatingOrder(true);
    setOrderUpdateError("");

    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId ? data.order : order
        )
      );
    } catch (error) {
      setOrderUpdateError(
        error.response?.data?.error || "Unable to update order status."
      );
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const notifications = useMemo(() => {
    const getNotificationContent = (order) => {
      switch (order.status) {
        case "pending":
          return {
            title: `New order from ${order.studentName}`,
            message: `${order.id} is waiting for acceptance at ${order.deliveryLocation}.`,
          };
        case "preparing":
          return {
            title: `Order in preparation`,
            message: `${order.id} is currently being prepared for ${order.studentName}.`,
          };
        case "ready":
          return {
            title: `Order ready for handoff`,
            message: `${order.id} is ready for pickup or delivery.`,
          };
        case "completed":
          return {
            title: `Order completed`,
            message: `${order.id} has been completed successfully.`,
          };
        case "cancelled":
          return {
            title: `Order cancelled`,
            message: `${order.id} was cancelled.`,
          };
        default:
          return {
            title: `Order update`,
            message: `${order.id} has a new status.`,
          };
      }
    };

    const formatNotificationTime = (value) =>
      new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.orderTime).getTime() -
          new Date(a.updatedAt || a.orderTime).getTime()
      )
      .slice(0, 12)
      .map((order) => {
        const eventTime = order.updatedAt || order.orderTime;
        const content = getNotificationContent(order);
        const notificationId = `${order.id}:${order.status}:${eventTime}`;

        return {
          id: notificationId,
          orderId: order.id,
          title: content.title,
          message: content.message,
          timeLabel: formatNotificationTime(eventTime),
          isUnread: !readNotificationKeys.includes(notificationId),
        };
      });
  }, [orders, readNotificationKeys]);

  const unreadNotificationCount = notifications.filter(
    (notification) => notification.isUnread
  ).length;

  const handleToggleNotifications = () => {
    setIsNotificationsOpen((current) => {
      const nextValue = !current;

      if (!current && notifications.length > 0) {
        setReadNotificationKeys((previousKeys) => {
          const mergedKeys = new Set(previousKeys);
          notifications.forEach((notification) => mergedKeys.add(notification.id));
          return [...mergedKeys];
        });
      }

      return nextValue;
    });
  };

  const handleNotificationClick = () => {
    setActiveSection("orders");
    setIsNotificationsOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage orders={orders} />;
      case "orders":
        return (
          <OrdersPage
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            isUpdatingOrder={isUpdatingOrder}
            updateError={orderUpdateError}
          />
        );
      case "menu":
        return (
          <MenuPage
            menuItems={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            isSavingNewItem={isSavingMenuItem}
            isDeletingItem={isDeletingMenuItem}
            saveError={menuSaveError}
          />
        );
      case "availability":
        return (
          <AvailabilityPage
            menuItems={menuItems}
            onToggleAvailability={handleToggleMenuAvailability}
            isSaving={isSavingMenuItem}
          />
        );
      case "reports":
        return <ReportsPage orders={orders} />;
      case "profile":
        return (
          <StaffProfilePage
            user={session?.user}
            onSaveProfile={handleSaveProfile}
            isSaving={isSavingProfile}
            errorMessage={profileError}
            successMessage={profileSuccess}
          />
        );
      default:
        return <DashboardPage orders={orders} />;
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0d1b52_0%,#18388f_100%)] text-sm font-medium text-[#eef3ff]">
        Verifying staff session...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <AuthPage
        onSubmit={handleAuthSubmit}
        isSubmitting={isSubmittingAuth}
        errorMessage={authError}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[linear-gradient(180deg,#f9fbff_0%,#fff8f0_100%)] font-sans">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          title={activeSection}
          user={session.user}
          notifications={notifications}
          unreadCount={unreadNotificationCount}
          isNotificationsOpen={isNotificationsOpen}
          onToggleNotifications={handleToggleNotifications}
          onNotificationClick={handleNotificationClick}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
