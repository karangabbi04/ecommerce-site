import type { ToolDefinition } from "./interface.js";

export const productTools: ToolDefinition[] = [
    {
        name: "create_product",
        description:
            "Create a product in the store. Use only when an admin explicitly asks to create/add a product and provides its name, description, price, stock, category, and at least one HTTPS image URL. Never invent product facts or image URLs; ask for missing required details first.",
        parameters: {
            type: "OBJECT",
            properties: {
                name: {
                    type: "STRING",
                    description: "Product name, between 3 and 120 characters.",
                },
                description: {
                    type: "STRING",
                    description: "Product description, between 10 and 5000 characters.",
                },
                price: {
                    type: "NUMBER",
                    description: "Positive product price in the store currency.",
                },
                stock: {
                    type: "INTEGER",
                    description: "Non-negative integer quantity in stock.",
                },
                category: {
                    type: "STRING",
                    description: "Existing product category name or slug.",
                },
                imageUrls: {
                    type: "ARRAY",
                    description: "One to five HTTPS image URLs supplied by the admin.",
                    items: { type: "STRING", format: "uri" },
                },
                status: {
                    type: "STRING",
                    enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
                    description: "Product status. Defaults to DRAFT when omitted.",
                },
                tag: {
                    type: "STRING",
                    description: "Optional product tag.",
                },
            },
            required: ["name", "description", "price", "stock", "category", "imageUrls"],
        },
    },
    {
        name: "get_product_details",
        description:
            "Fetch the details of an existing product by its product ID. Use this when an admin asks to view or inspect a product. Do not invent an ID; ask for the product ID if it is not available in the conversation.",
        parameters: {
            type: "OBJECT",
            properties: {
                productId: {
                    type: "STRING",
                    format: "uuid",
                    description: "The UUID of the product to fetch.",
                },
            },
            required: ["productId"],
        },
    },
    {
        name: "list_products",
        description:
            "Find products in the store. Use search and filters when an admin asks to find, list, or inspect products. Do not modify product data with this tool.",
        parameters: {
            type: "OBJECT",
            properties: {
                search: {
                    type: "STRING",
                    description: "Optional text to search in product names.",
                },
                status: {
                    type: "STRING",
                    enum: ["ALL", "ACTIVE", "DRAFT", "ARCHIVED"],
                    description: "Optional product status filter.",
                },
                stockStatus: {
                    type: "STRING",
                    enum: ["LOW_STOCK", "OUT_OF_STOCK", "IN_STOCK"],
                    description: "Optional inventory status filter.",
                },
                categoryId: {
                    type: "STRING",
                    description: "Optional category UUID filter.",
                },
                page: {
                    type: "INTEGER",
                    description: "Page number, defaults to 1.",
                },
                limit: {
                    type: "INTEGER",
                    description: "Number of products to return, from 1 to 50.",
                },
            },
            required: [],
        },
    },
    {
        name: "update_product_status",
        description:
            "Change an existing product's status. Use only when an admin explicitly requests a status change. Do not invent the product ID.",
        parameters: {
            type: "OBJECT",
            properties: {
                productId: {
                    type: "STRING",
                    format: "uuid",
                    description: "UUID of the product to update.",
                },
                status: {
                    type: "STRING",
                    enum: ["ACTIVE", "ARCHIVED"],
                    description: "New product status.",
                },
            },
            required: ["productId", "status"],
        },
    },
    {
        name: "update_product_price",
        description:
            "Change an existing product's price. Use only when an admin explicitly requests the price change. A reason is required and the price must be greater than zero.",
        parameters: {
            type: "OBJECT",
            properties: {
                productId: {
                    type: "STRING",
                    format: "uuid",
                    description: "UUID of the product to update.",
                },
                price: {
                    type: "NUMBER",
                    description: "New price greater than zero, in store currency.",
                },
                reason: {
                    type: "STRING",
                    description: "Reason for changing the price.",
                },
            },
            required: ["productId", "price", "reason"],
        },
    },
    
];