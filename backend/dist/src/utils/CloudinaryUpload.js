"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const uploadToCloudinary = async (localFilePath, folder = "ecocraft/products") => {
    try {
        const result = await cloudinary_1.default.uploader.upload(localFilePath, {
            folder,
            resource_type: "image",
            transformation: [
                { width: 1200, height: 1200, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ],
        });
        fs_1.default.unlinkSync(localFilePath);
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
    catch (error) {
        if (fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath);
        }
        throw error;
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
