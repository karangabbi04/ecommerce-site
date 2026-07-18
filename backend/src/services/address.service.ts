import { OtpPurpose } from "@prisma/client";
import * as addressRepository from "../repositories/address.repository.js";

import { CreateAddressInput } from "../validations/address.validation.js";
import { otpService } from "./otp.service.js";
import { prisma } from "../lib/prisma.js";
import { otpRepository } from "../repositories/otp.repository.js";
import { ApiError } from "../utils/ApiError.js";

type CreateAddressParams = {
  userId?: string;
  guestId?: string;
  data: CreateAddressInput;
};

const DEFAULT_COUNTRY = "India";

function getOwner(
  userId?: string,
  guestId?: string
) {
  if (userId) {
    return {
      userId,
      guestId: null,
    };
  }

  if (guestId) {
    return {
      userId: null,
      guestId,
    };
  }

  throw new Error("Unauthorized");
}

export async function createAddressService(
  params: CreateAddressParams
) {
  const { userId, guestId, data } = params;

  const owner = getOwner(
    userId,
    guestId
  );

  console.log(owner)

  const otpRecord: any = await otpService.verifyOTP({
    email: data.email,
    otp: data.otp,
    purpose: OtpPurpose.SIGNUP,
   });

   console.log(otpRecord,"otep recodfldjaj lklkdsjflk sj kljfklsd ")
   console.log(otpRecord.id ,"otep recodfldjaj lklkdsjflk sj kljfklsd ")

        return prisma.$transaction(async( tx)=>{

               const address = await addressRepository.create(tx, {
        fullName: data.fullName,

        guestId: guestId,

        user: userId ? { connect: { id: userId } } : undefined,

        phone: data.phone,

        email: data.email,

        addressLine1: data.addressLine1,

        landmark: data.landmark,

        city: data.city,

        state: data.state,

        country: DEFAULT_COUNTRY,

        postalCode: data.pincode,

        latitude: data.latitude,

        longitude: data.longitude,

      });

      await otpRepository.deleteOTPById(tx, otpRecord?.id);

      return address;
        });
}

export async function getAddresses(
  userId?: string,
  guestId?: string
) {
  if (userId) {
    return addressRepository.findManyByUserId(
      userId
    );
  }

  if (guestId) {
    return addressRepository.findManyByGuestId(
      guestId
    );
  }

  throw new Error("Unauthorized");
}