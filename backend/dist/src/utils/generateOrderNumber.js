"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = void 0;
const generateOrderNumber = (sequence) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = `${year}${month}${day}`;
    const paddedSequence = sequence
        .toString()
        .padStart(6, "0");
    return `ORD-${formattedDate}-${paddedSequence}`;
};
exports.generateOrderNumber = generateOrderNumber;
