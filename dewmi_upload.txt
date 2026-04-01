import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const createDiskStorage = (folderName, fallbackBaseName) => {
  const uploadDirectory = path.resolve("uploads", folderName);

  fs.mkdirSync(uploadDirectory, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname || "").toLowerCase();
      const safeBaseName = path
        .basename(file.originalname || fallbackBaseName, extension)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40);

      cb(
        null,
        `${safeBaseName || fallbackBaseName}-${Date.now()}${extension || ".jpg"}`
      );
    },
  });
};

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image files are allowed"));
};

const createImageUpload = (storage) =>
  multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

export const menuItemUpload = createImageUpload(
  createDiskStorage("menu-items", "menu-item")
);

export const staffProfileUpload = createImageUpload(
  createDiskStorage("staff-profiles", "staff-profile")
);
