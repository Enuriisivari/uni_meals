import React, { useEffect, useState } from "react";
import { Camera, LoaderCircle, Mail, User } from "lucide-react";

export function StaffProfilePage({
  user,
  onSaveProfile,
  isSaving,
  errorMessage,
  successMessage,
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatarFile: null,
    avatarPreview: user?.avatarUrl || "",
  });

  useEffect(() => {
    setFormData((current) => {
      if (current.avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(current.avatarPreview);
      }

      return {
        name: user?.name || "",
        email: user?.email || "",
        avatarFile: null,
        avatarPreview: user?.avatarUrl || "",
      };
    });
  }, [user?.avatarUrl, user?.email, user?.name]);

  useEffect(() => {
    return () => {
      if (formData.avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.avatarPreview);
      }
    };
  }, [formData.avatarPreview]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFormData((current) => {
      if (current.avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(current.avatarPreview);
      }

      return {
        ...current,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("email", formData.email.trim());

    if (formData.avatarFile) {
      payload.append("avatar", formData.avatarFile);
    }

    await onSaveProfile(payload);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl border border-[#dfe5f2] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#0d1b52]">Staff Profile</h2>
        <p className="mt-2 text-sm text-[#6b7692]">
          Update your profile photo, display name, and email address.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-[#dfe5f2] bg-white p-6 shadow-sm lg:grid-cols-[280px_1fr]"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center rounded-2xl bg-[#f8faff] p-6 text-center">
            <img
              src={
                formData.avatarPreview ||
                "https://ui-avatars.com/api/?name=Staff&background=e8eeff&color=0d1b52"
              }
              alt="Staff avatar preview"
              className="h-32 w-32 rounded-full border border-[#dfe5f2] object-cover shadow-sm"
            />
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#f58220] px-4 py-2 text-sm font-medium text-white hover:bg-[#e46f0a]">
              <Camera className="h-4 w-4" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            <p className="mt-3 text-xs text-[#6b7692]">
              JPG, PNG or WebP up to 5MB.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#243356]">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d87a3]" />
              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#d3dced] bg-white py-3 pl-10 pr-4 text-sm focus:border-[#f58220] focus:outline-none focus:ring-1 focus:ring-[#f58220]"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#243356]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d87a3]" />
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#d3dced] bg-white py-3 pl-10 pr-4 text-sm focus:border-[#f58220] focus:outline-none focus:ring-1 focus:ring-[#f58220]"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0d1b52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#18388f] disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
