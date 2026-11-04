import mongoose from "mongoose";
import multer from "multer";
import Car from "../models/Car.js";

const receiveImage = multer({
  storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, done) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) return done(new Error("Unsupported image"));
    done(null, true);
  }
}).single("image");

export const editCarUpload = (req, res, next) => receiveImage(req, res, (error) => {
  if (error) return res.status(400).json({ success: false, message: "Upload one JPG, PNG or WebP image, up to 5 MB" });
  next();
});

export async function loadOwnedCar(req, res, next) {
  try {
    if (req.user.role !== "owner") return res.status(403).json({ success: false, message: "Owner access required" });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid car ID" });
    req.car = await Car.findOne({ _id: req.params.id, owner: req.user._id });
    if (!req.car) return res.status(404).json({ success: false, message: "Car not found" });
    next();
  } catch { res.status(500).json({ success: false, message: "Could not load car" }); }
}

export function listingFields(input) {
  if (!input || typeof input !== "object") throw new Error("Car details are required");
  const fields = {};
  for (const key of ["brand", "model", "category", "transmission", "fuel_type", "location", "description"]) {
    if (typeof input[key] !== "string" || !input[key].trim() || input[key].length > (key === "description" ? 3000 : 120)) throw new Error(`Enter a valid ${key.replaceAll("_", " ")}`);
    fields[key] = input[key].trim();
  }
  for (const key of ["year", "pricePerDay", "seating_capacity"]) {
    if (!["string", "number"].includes(typeof input[key]) || String(input[key]).trim() === "") throw new Error(`Enter a valid ${key}`);
    fields[key] = Number(input[key]);
    if (!Number.isFinite(fields[key])) throw new Error(`Enter a valid ${key}`);
  }
  if (!Number.isInteger(fields.year) || fields.year < 1886 || fields.year > new Date().getFullYear() + 1) throw new Error("Enter a valid car year");
  if (!Number.isInteger(fields.seating_capacity) || fields.seating_capacity < 1 || fields.seating_capacity > 50) throw new Error("Seats must be between 1 and 50");
  if (fields.pricePerDay < 1 || fields.pricePerDay > 1000000) throw new Error("Daily price must be between 1 and 1,000,000");
  fields.pricePerDay = Math.round(fields.pricePerDay * 100) / 100;
  return fields;
}

export async function updateCar(req, res) {
  let fields;
  try { fields = listingFields(typeof req.body?.carData === "string" ? JSON.parse(req.body.carData) : req.body?.carData); }
  catch (error) { return res.status(400).json({ success: false, message: error instanceof SyntaxError ? "Invalid car details" : error.message }); }
  try {
    if (req.file) {
      const { default: imagekit } = await import("../configs/imagekit.js");
      const uploaded = await imagekit.upload({ file: req.file.buffer, fileName: req.file.originalname, folder: "/cars" });
      fields.image = imagekit.url({ path: uploaded.filePath, transformation: [{ width: "1280", quality: "auto", format: "webp" }] });
    }
    const car = await Car.findOneAndUpdate({ _id: req.car._id, owner: req.user._id }, { $set: fields }, { new: true, runValidators: true });
    if (!car) return res.status(404).json({ success: false, message: "Car no longer available to edit" });
    res.json({ success: true, message: "Car listing updated", car });
  } catch { res.status(500).json({ success: false, message: "Could not update the car. Please retry." }); }
}
