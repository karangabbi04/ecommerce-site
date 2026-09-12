import { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "../lib/prisma.js";




class ProductRepository {


   async create( db:PrismaClient | Prisma.TransactionClient,data: {
    name: string;
    slug: string;
    description: string;
    tag: string;
    price: number;
    stock: number;
    status: Prisma.ProductCreateInput['status'];
    images: {
      url: string;
      publicId: string;
    }[];
  }) {
    return db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        tag: data.tag,
        price: data.price,
        stock: data.stock,
        status: data.status,
        images: {
          create: data.images.map((image) => ({
            url: image.url,
            publicId: image.publicId,
          })),
        },
      },
      include: {
        images: true,
      },
    });
  }

   /**
   * Find By Slug
   */
  async findbyslug(slug: string) {
    return prisma.product.findUnique({
      where: {
        slug,
      },
    });
  }


  //find many 

  async findMany(args: Prisma.ProductFindManyArgs) {
    return prisma.product.findMany(args);
  }

  //count
  async count(where?: Prisma.ProductWhereInput) {
    return prisma.product.count({
      where,
    });
  }
  // find by id
  async findById(args: Prisma.ProductFindUniqueArgs) {
    return prisma.product.findUnique(args);
  }

  //update
  async update(args: Prisma.ProductUpdateArgs) {
    return prisma.product.update(args);
  }

  //delete
  async remove(args: Prisma.ProductDeleteArgs) {
    return prisma.product.delete(args);
  }

}


export const productRepository = new ProductRepository();