"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_js_1 = require("./db/index.js");
const product_routes_js_1 = __importDefault(require("./routes/product.routes.js"));
const ai_routes_js_1 = __importDefault(require("./routes/ai.routes.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const cart_routes_js_1 = __importDefault(require("./routes/cart.routes.js"));
const checkout_routes_js_1 = __importDefault(require("./routes/checkout.routes.js"));
const address_routes_js_1 = __importDefault(require("./routes/address.routes.js"));
const order_routes_js_1 = __importDefault(require("./routes/order.routes.js"));
const payment_routes_js_1 = __importDefault(require("./routes/payment.routes.js"));
const notFound_js_1 = require("./middlewares/notFound.js");
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (_req, res) => {
    res.send("API is running...");
});
app.use("/api/v1", product_routes_js_1.default);
app.use("/api/v1/ai", ai_routes_js_1.default);
app.use("/api/v1/auth", user_routes_js_1.default);
app.use("/api/v1/otp", auth_routes_js_1.default);
app.use("/api/v1/cart", cart_routes_js_1.default);
app.use("/api/v1/checkout", checkout_routes_js_1.default);
app.use("/api/v1/addresses", address_routes_js_1.default);
app.use("/api/v1/order", order_routes_js_1.default);
app.use("/api/v1/payment", payment_routes_js_1.default);
app.use(notFound_js_1.notFound);
app.get("/db-test", async (_req, res) => {
    const result = await index_js_1.pool.query("SELECT NOW()");
    res.json({
        success: true,
        time: result.rows[0],
    });
});
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
