"use client";

import Image from "next/image";

interface Props {
  image: string;
  name: string;
  subtitle: string;
}

export default function ProductImage({
  image,
  name,
  subtitle,
}: Props) {
  return (
    <div className="flex items-center gap-3 ">
      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <p className="font-medium">{name}</p>

        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}