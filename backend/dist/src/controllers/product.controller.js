"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductBySlug = exports.getProductById = exports.deleteProduct = exports.createProduct = exports.getAllProducts = void 0;
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const ApiError_js_1 = require("../utils/ApiError.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const prisma_js_1 = require("../lib/prisma.js");
const CloudinaryUpload_js_1 = require("../utils/CloudinaryUpload.js");
const slugify_1 = __importDefault(require("slugify"));
const product_validation_js_1 = require("../validations/product-validation.js");
const product_service_1 = require("../services/product.service");
// Create a new product
const createProduct = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { name, description, price, stock, isFeatured, tag, } = req.body;
    const files = req.files;
    if (!name || !description || price === undefined || stock === undefined) {
        throw new ApiError_js_1.ApiError(400, "Name, description, price and stock are required");
    }
    if (!files || files.length === 0) {
        throw new ApiError_js_1.ApiError(400, "At least one product image is required");
    }
    //generate slug
    const baseSlug = (0, slugify_1.default)(name, {
        lower: true,
        strict: true,
        trim: true,
    });
    // 2. check karo same slug pehle se exist to nahi karta
    const existingProduct = await prisma_js_1.prisma.product.findUnique({
        where: {
            slug: baseSlug,
        },
    });
    // 3. agar same slug exist karta hai to unique slug banao
    const slug = existingProduct
        ? `${baseSlug}-${Date.now()}`
        : baseSlug;
    const uploadedImages = await Promise.all(files.map((file) => (0, CloudinaryUpload_js_1.uploadToCloudinary)(file.path, "ecocraft/products")));
    const product = await prisma_js_1.prisma.product.create({
        data: {
            name,
            slug,
            description,
            tag,
            price: Number(price),
            stock: Number(stock),
            isFeatured: isFeatured === "true",
            images: {
                create: uploadedImages.map((image) => ({
                    url: image.url,
                    publicId: image.publicId,
                })),
            },
        },
        include: {
            images: true,
        },
    });
    console.log("product created successfully:", product);
    res
        .status(201)
        .json(new apiResponse_js_1.ApiResponse(201, product, "Product created successfully"));
});
exports.createProduct = createProduct;
// delete a product by ID
const deleteProduct = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    // 1. Check id diya hai ya nahi
    if (!id || Array.isArray(id)) {
        throw new ApiError_js_1.ApiError(400, "Product id is required");
    }
    // 2. Check product exist karta hai ya nahi
    const product = await prisma_js_1.prisma.product.findUnique({
        where: { id },
    });
    if (!product) {
        throw new ApiError_js_1.ApiError(404, "Product not found");
    }
    // 3. Delete product
    await prisma_js_1.prisma.product.delete({
        where: { id },
    });
    // 4. Response
    res
        .status(200)
        .json(new apiResponse_js_1.ApiResponse(200, null, "Product deleted successfully"));
});
exports.deleteProduct = deleteProduct;
// get single product by ID
const getProductById = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    const { id } = product_validation_js_1.productIdParamsSchema.parse(req.params);
    if (!id) {
        throw new ApiError_js_1.ApiError(400, "Product id is required");
    }
    const product = await product_service_1.productService.getProductById(id);
    res.status(200).json(new apiResponse_js_1.ApiResponse(200, product, "Product fetched successfully"));
});
exports.getProductById = getProductById;
//get products by slug
const getProductBySlug = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        throw new ApiError_js_1.ApiError(400, "Product slug is required");
    }
    const product = await prisma_js_1.prisma.product.findUnique({
        where: { slug },
        include: {
            images: true,
        },
    });
    if (!product) {
        throw new ApiError_js_1.ApiError(404, "Product not found");
    }
    res
        .status(200)
        .json(new apiResponse_js_1.ApiResponse(200, product, "Product fetched successfully"));
});
exports.getProductBySlug = getProductBySlug;
//get all products with pagination, filtering, sorting
exports.getAllProducts = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const query = product_validation_js_1.productQuerySchema.parse(req.query);
    const result = await product_service_1.productService.getAllProducts(query);
    res.status(200).json(new apiResponse_js_1.ApiResponse(200, result, "Products fetched successfully"));
});
