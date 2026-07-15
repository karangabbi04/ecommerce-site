import { prisma } from "../lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";


export async function create(db: PrismaClient | Prisma.TransactionClient,
  data: Prisma.AddressCreateInput
) {
  return db.address.create({
    data,
  });
}

export async function findById(
  id: string
) {
  return prisma.address.findUnique({
    where: {
      id,
    },
  });
}

export async function findManyByUserId(
  userId: string
) {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findManyByGuestId(
  guestId: string
) {
  return prisma.address.findMany({
    where: {
      guestId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function update(
  id: string,
  data: Prisma.AddressUpdateInput
) {
  return prisma.address.update({
    where: {
      id,
    },
    data,
  });
}

export async function remove(
  id: string
) {
  return prisma.address.delete({
    where: {
      id,
    },
  });
}