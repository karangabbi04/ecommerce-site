import type { ToolDefinition } from "../interface.js";

export const CategoryDefinitions: ToolDefinition[] = [
	{
		name: "create_category",
		description:
			"Create a category for store products. Use this when an admin explicitly asks to add or create a category. Do not invent a category name.",
		parameters: {
			type: "OBJECT",
			properties: {
				name: {
					type: "STRING",
					description: "Name for the new category.",
				},
			},
			required: ["name"],
		},
	},
	{
		name: "update_category",
		description:
			"Rename an existing category. Use only when an admin explicitly requests a category rename. Do not invent the category ID or new name.",
		parameters: {
			type: "OBJECT",
			properties: {
				id: {
					type: "STRING",
					format: "uuid",
					description: "UUID of the category to rename.",
				},
				name: {
					type: "STRING",
					description: "New name for the category.",
				},
			},
			required: ["id", "name"],
		},
	},
	{
		name: "get_all_categories",
		description:
			"Fetch all categories. Use when an admin asks to list or view categories.",
		parameters: {
			type: "OBJECT",
			properties: {},
			required: [],
		},
	},
	{
		name: "get_admin_categories",
		description:
			"Fetch categories for the admin view, including the product count for each category.",
		parameters: {
			type: "OBJECT",
			properties: {},
			required: [],
		},
	},
	{
		name: "delete_category",
		description:
			"Delete a category permanently. Use only after the admin explicitly requests deletion and confirms it. Never treat a general question as confirmation.",
		parameters: {
			type: "OBJECT",
			properties: {
				id: {
					type: "STRING",
					format: "uuid",
					description: "UUID of the category to delete.",
				},
				confirmed: {
					type: "BOOLEAN",
					description: "Must be true only after the admin explicitly confirms deletion.",
				},
			},
			required: ["id", "confirmed"],
		},
	},
];
