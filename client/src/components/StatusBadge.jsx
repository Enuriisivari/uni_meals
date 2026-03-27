import React from "react";

export function StatusBadge({ status, className = "" }) {
  const getStatusStyles = (value) => {
    switch (value) {
      case "pending":
        return "border-[#ffd9ad] bg-[#fff1e2] text-[#b56714]";
      case "preparing":
        return "border-[#c9d8ff] bg-[#edf2ff] text-[#3154a5]";
      case "ready":
        return "border-[#bfcdf8] bg-[#e8eeff] text-[#0d1b52]";
      case "completed":
        return "border-[#caecd8] bg-[#ecfaf2] text-[#2d7a4a]";
      case "cancelled":
        return "border-[#f1c4be] bg-[#fff0ee] text-[#b24d40]";
      default:
        return "border-[#dfe5f2] bg-[#f4f6fb] text-[#44516d]";
    }
  };

  const getStatusLabel = (value) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(status)} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
