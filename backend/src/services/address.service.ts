
import { CreateAddressInput } from "../validations/address.schema";
import { prisma } from "../lib/prisma";

type CreateAddressParams = {
  userId?: string;
  guestId?: string;
  data: CreateAddressInput;
};

export const createAddressService = 
  async ( params: CreateAddressParams) => {
    
    const {
        userId,
        guestId,
        data,
  } = params;


        const address = await prisma.address.create({
      data: {

        userId: userId ?? null,

        guestId: guestId ?? null,

        fullName:
          data.fullName,

        phone:
          data.phone,

        addressLine1:
          data.addressLine1,

        landmark:
          data.landmark,

        city:
          data.city,

        state:
          data.state,
        
        country:
          "india",

        postalCode:
          data.pincode,

        latitude:
          data.latitude,

        longitude:
          data.longitude,
      },
    });

  return address;

  }

export async function getAddresses(
  userId?: string,
  guestId?: string
) {

  return prisma.address.findMany({
    where: userId
      ? {
          userId,
        }
      : {
          guestId,
        },

    orderBy: {
      createdAt: "desc",
    },
  });

}

export async function attachAddressToCheckout(
  checkoutId: string,
  addressId: string
) {



  // const checkout =
  //   await prisma.checkoutSession.update({
  //     where: {
  //       id: checkoutId,
  //     },

  //     data: {
  //       addressId,
  //     },
    
  //   });


 const checkout =   await prisma.$transaction(
        async (tx) => {

          const attechAddress = await tx.checkoutSession.update({
            where: {
              id: checkoutId,
            },

            data: {
              addressId,
            },
          
          });

         

          return attechAddress
          


        })
  

   

  return checkout;
}