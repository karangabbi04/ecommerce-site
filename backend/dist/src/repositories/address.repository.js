"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.findManyByUserId = findManyByUserId;
exports.findManyByGuestId = findManyByGuestId;
exports.update = update;
exports.remove = remove;
const prisma_1 = require("../lib/prisma");
async function create(db, data) {
    return db.address.create({
        data,
    });
}
async function findById(id) {
    return prisma_1.prisma.address.findUnique({
        where: {
            id,
        },
    });
}
async function findManyByUserId(userId) {
    return prisma_1.prisma.address.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function findManyByGuestId(guestId) {
    return prisma_1.prisma.address.findMany({
        where: {
            guestId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function update(id, data) {
    return prisma_1.prisma.address.update({
        where: {
            id,
        },
        data,
    });
}
async function remove(id) {
    return prisma_1.prisma.address.delete({
        where: {
            id,
        },
    });
}
