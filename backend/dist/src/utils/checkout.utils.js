"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = exports.calculateTax = exports.calculateShipping = exports.round = void 0;
const round = (value) => {
    return Number(value.toFixed(2));
};
exports.round = round;
const calculateShipping = (subtotal) => {
    return subtotal >= 1000 ? 0 : 100;
};
exports.calculateShipping = calculateShipping;
const calculateTax = (subtotal, gstRate) => {
    return (0, exports.round)((subtotal * gstRate) / 100);
};
exports.calculateTax = calculateTax;
const calculateTotal = (subtotal, shipping, tax) => {
    return (0, exports.round)(subtotal + shipping + tax);
};
exports.calculateTotal = calculateTotal;
