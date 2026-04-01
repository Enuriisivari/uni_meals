import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, GraduationCap } from "lucide-react";

export function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,130,32,0.24),_#fff7ef_24%,_#eef3ff_100%)] px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/60 bg-white/90 p-8 shadow-[0_30px_80px_rgba(13,27,82,0.14)] backdrop-blur sm:p-12">
        <div className="mb-8 max-w-3xl">
          <div className="mb-4 inline-flex rounded-full bg-[#0d1b52] px-4 py-2 text-sm font-semibold text-white">
            Uni Meals Portal
          </div>
          <h1 className="text-5xl font-black leading-tight text-[#0d1b52]">
            Two dashboards. One canteen workflow.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f6983]">
            Students can browse the menu and place orders. Canteen staff can
            manage menu items, availability, and live operations.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            to="/student"
            className="group rounded-[2rem] bg-[linear-gradient(135deg,#0d1b52_0%,#18388f_100%)] p-8 text-white shadow-xl transition hover:-translate-y-1"
          >
            <GraduationCap className="h-10 w-10 text-[#ffb06f]" />
            <h2 className="mt-6 text-3xl font-black">Student Dashboard</h2>
            <p className="mt-3 text-sm leading-6 text-[#d7e0ff]">
              Explore available meals, build a cart, and track recent orders.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ffb06f]">
              Open student portal <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          <Link
            to="/staff"
            className="group rounded-[2rem] border border-[#dfe5f2] bg-white p-8 shadow-xl transition hover:-translate-y-1"
          >
            <ChefHat className="h-10 w-10 text-[#f58220]" />
            <h2 className="mt-6 text-3xl font-black text-[#0d1b52]">
              Canteen Staff
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f6983]">
              Sign in to manage menu items, stock availability, and order
              operations.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#f58220]">
              Open staff portal <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
