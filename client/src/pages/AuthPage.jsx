import React, { useState } from "react";
import { LockKeyhole, Mail, UserRound, UtensilsCrossed } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export function AuthPage({ onSubmit, isSubmitting, errorMessage }) {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      mode,
      ...formData,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,130,32,0.25),_#fff7ef_35%,_#ecf2ff_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#0d1b52_0%,#18388f_100%)] p-8 text-white shadow-2xl sm:p-12">
          <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
            <UtensilsCrossed className="h-4 w-4 text-[#ffb06f]" />
            Uni Meals staff portal
          </div>
          <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl">
            Canteen staff control for orders, menu updates, and availability.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#d7e0ff]">
            Sign in to manage campus meal orders in real time. New canteen staff
            can create an account here and enter the dashboard immediately.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              "Track active orders",
              "Update menu items",
              "Toggle stock instantly",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#eef3ff]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#dfe5f2] bg-white/92 p-8 shadow-xl backdrop-blur sm:p-10">
          <div className="mb-8 flex rounded-full bg-[#eef2fa] p-1 text-sm font-medium text-[#5f6983]">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "login" ? "bg-[#0d1b52] text-white shadow" : ""}`}
            >
              Staff Login
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("register")}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "register" ? "bg-[#0d1b52] text-white shadow" : ""}`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#0d1b52]">
              {mode === "login" ? "Welcome back" : "Create staff account"}
            </h2>
            <p className="mt-2 text-sm text-[#6b7692]">
              {mode === "login"
                ? "Use your canteen staff email and password."
                : "Register a canteen staff profile for this portal."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#243356]">
                  Full name
                </span>
                <div className="flex items-center rounded-2xl border border-[#dfe5f2] bg-[#f4f6fb] px-4">
                  <UserRound className="h-4 w-4 text-[#7d87a3]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    className="w-full bg-transparent px-3 py-4 text-sm text-[#172033] outline-none"
                    placeholder="Amaya Perera"
                    required
                  />
                </div>
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#243356]">
                Email
              </span>
              <div className="flex items-center rounded-2xl border border-[#dfe5f2] bg-[#f4f6fb] px-4">
                <Mail className="h-4 w-4 text-[#7d87a3]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className="w-full bg-transparent px-3 py-4 text-sm text-[#172033] outline-none"
                  placeholder="staff@unimeals.lk"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#243356]">
                Password
              </span>
              <div className="flex items-center rounded-2xl border border-[#dfe5f2] bg-[#f4f6fb] px-4">
                <LockKeyhole className="h-4 w-4 text-[#7d87a3]" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  className="w-full bg-transparent px-3 py-4 text-sm text-[#172033] outline-none"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </label>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#f58220] px-4 py-4 text-sm font-bold text-white transition hover:bg-[#e46f0a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                  ? "Login to Staff Portal"
                  : "Create Staff Account"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
