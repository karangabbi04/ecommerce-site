import type { ToolDefinition } from "../interface.js";

export const ProductDefinitions: ToolDefinition[] = [
	{
		name: "create_product",
		description:
			"Create a store product when an admin explicitly requests it. Require the product name, description, positive price, non-negative stock, existing category name, and one to five HTTPS image URLs. Never invent product details or image URLs; ask for missing information.",
		parameters: {
			type: "OBJECT",
			properties: {
				name: { type: "STRING", description: "Product name, 3 to 120 characters." },
				description: { type: "STRING", description: "Product description, 10 to 5000 characters." },
				price: { type: "NUMBER", description: "Positive price in the store currency." },
				stock: { type: "INTEGER", description: "Non-negative inventory quantity." },
				category: { type: "STRING", description: "Existing category name or slug." },
				imageUrls: {
					type: "ARRAY",
					description: "One to five HTTPS image URLs provided by the admin.",
					items: { type: "STRING", format: "uri" },
				},
				status: {
					type: "STRING",
					enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
					description: "Product status; defaults to DRAFT if omitted.",
				},
				tag: { type: "STRING", description: "Optional product tag." },
			},
			required: ["name", "description", "price", "stock", "category", "imageUrls"],
		},
	},
	{
		name: "get_product_details",
		description:
			"Fetch one product by its UUID, including its category and images. Do not invent a product ID; ask for it if it is unavailable in the conversation.",
		parameters: {
			type: "OBJECT",
			properties: {
				id: { type: "STRING", format: "uuid", description: "Product UUID." },
			},
			required: ["id"],
		},
	},
	{
		name: "get_all_products",
		description:
			"Search and browse the store's product catalog with optional category, featured, search, pagination, and sort filters.",
		parameters: {
			type: "OBJECT",
			properties: {
				page: { type: "INTEGER", description: "Page number, starting at 1." },
				limit: { type: "INTEGER", description: "Results per page, between 1 and 50." },
				search: { type: "STRING", description: "Optional product search text." },
				category: { type: "STRING", description: "Optional category filter." },
				featured: { type: "BOOLEAN", description: "Optional featured-products filter." },
				sort: {
					type: "STRING",
					enum: ["newest", "oldest", "price_asc", "price_desc"],
					description: "Optional result sort order.",
				},
			},
			required: [],
		},
	},
	{
		name: "get_admin_products",
		description:
			"Find products for admin inventory management, with optional status, stock, category, and name filters. Includes order count and stock status.",
		parameters: {
			type: "OBJECT",
			properties: {
				page: { type: "INTEGER", description: "Page number, starting at 1." },
				limit: { type: "INTEGER", description: "Results per page, between 1 and 50." },
				status: {
					type: "STRING",
					enum: ["ALL", "ACTIVE", "DRAFT", "ARCHIVED"],
					description: "Optional product status filter.",
				},
				stockStatus: {
					type: "STRING",
					enum: ["LOW_STOCK", "OUT_OF_STOCK", "IN_STOCK"],
					description: "Optional stock status filter.",
				},
				categoryId: { type: "STRING", format: "uuid", description: "Optional category UUID." },
				search: { type: "STRING", description: "Optional product-name search." },
				lowStockThreshold: {
					type: "INTEGER",
					description: "Threshold used to classify low stock; defaults to 10.",
				},
			},
			required: [],
		},
	},
	{
		name: "update_product_status",
		description:
			"Change a product's status when an admin explicitly requests it. Do not invent a product ID.",
		parameters: {
			type: "OBJECT",
			properties: {
				id: { type: "STRING", format: "uuid", description: "Product UUID." },
				status: {
					type: "STRING",
					enum: ["ACTIVE", "ARCHIVED"],
					description: "New product status.",
				},
			},
			required: ["id", "status"],
		},
	},
	{
		name: "update_product_price",
		description:
			"Change a product's price when an admin explicitly requests it. Price must be positive and a reason is required.",
		parameters: {
			type: "OBJECT",
			properties: {
				id: { type: "STRING", format: "uuid", description: "Product UUID." },
				price: { type: "NUMBER", description: "New positive price in store currency." },
				reason: { type: "STRING", description: "Reason for the price change." },
			},
			required: ["id", "price", "reason"],
		},
	},
	{
		name: "bulk_update_product_prices",
		description:
			"Update prices for multiple products in one operation. Use this instead of calling update_product_price repeatedly when the admin specifies a group or filter, such as all products below a price threshold. Require the exact priceBelow threshold, newPrice, and reason; never guess the filter or price.",
		parameters: {
			type: "OBJECT",
			properties: {
				priceBelow: {
					type: "NUMBER",
					description: "Only products with a current price strictly below this value are updated.",
				},
				newPrice: {
					type: "NUMBER",
					description: "New positive price to set on each matching product.",
				},
				reason: {
					type: "STRING",
					description: "Reason recorded in price history for the bulk update.",
				},
				categoryId: {
					type: "STRING",
					format: "uuid",
					description: "Optional category UUID to narrow the matching products.",
				},
				status: {
					type: "STRING",
					enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
					description: "Optional product status to narrow the matching products.",
				},
			},
			required: ["priceBelow", "newPrice", "reason"],
		},
	},
	{
		name: "get_product_price_history",
		description:
			"Fetch the recent price history for a product. Do not invent a product ID.",
		parameters: {
			type: "OBJECT",
			properties: {
				id: { type: "STRING", format: "uuid", description: "Product UUID." },
			},
			required: ["id"],
		},
	},
];
