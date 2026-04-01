import React from "react";

export function AvailabilityPage({ menuItems, onToggleAvailability, isSaving }) {

  const groupedItems = menuItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }

    groups[item.category].push(item);
    return groups;
  }, {});

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#dfe5f2] bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-medium text-[#0d1b52]">
          Quick Availability Control
        </h2>
        <p className="mb-6 text-sm text-[#6b7692]">
          Toggle switches to instantly mark items as out of stock or available.
          Changes reflect immediately on the student ordering app.
        </p>
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-4 border-b border-[#edf1f8] pb-2 text-sm font-bold uppercase tracking-wider text-[#0d1b52]">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${item.available ? "border-[#dfe5f2] bg-white shadow-sm" : "border-[#dfe5f2] bg-[#f4f6fb] opacity-75"}`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={`h-12 w-12 rounded-lg object-cover ${!item.available ? "grayscale" : ""}`}
                      />
                      <div>
                        <p
                          className={`font-medium ${item.available ? "text-[#0d1b52]" : "text-[#6b7692] line-through"}`}
                        >
                          {item.name}
                        </p>
                        <p className="text-sm font-medium text-[#6b7692]">
                          Rs. {item.price}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onToggleAvailability(item.id, !item.available)
                      }
                      disabled={isSaving}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#f58220] focus:ring-offset-2 ${item.available ? "bg-[#0d1b52]" : "bg-[#cfd7ea]"}`}
                      role="switch"
                      aria-checked={item.available}
                    >
                      <span className="sr-only">
                        Toggle {item.name} availability
                      </span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.available ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
