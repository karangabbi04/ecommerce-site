"use client";

import Image from "next/image";
import { Eye, Heart } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Product = {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  category: string;
  price: number;
  sold: number;
  status: "available" | "out" | "low";
};

const products: Product[] = [
  {
    id: 1,
    name: "Modern Chair",
    subtitle: "Wooden Chair",
    image: "https://picsum.photos/100?1",
    category: "Home Accessories",
    price: 568,
    sold: 320,
    status: "out",
  },
  {
    id: 2,
    name: "Small Pot",
    subtitle: "Ceramic Pot",
    image: "https://picsum.photos/100?2",
    category: "Home Decor",
    price: 1027,
    sold: 287,
    status: "available",
  },
  {
    id: 3,
    name: "Classic T-Shirt",
    subtitle: "Half Sleeves",
    image: "https://picsum.photos/100?3",
    category: "Men Wear",
    price: 359,
    sold: 345,
    status: "out",
  },
  {
    id: 4,
    name: "Running Shoes",
    subtitle: "Casual Shoes",
    image: "https://picsum.photos/100?4",
    category: "Footwear",
    price: 499,
    sold: 254,
    status: "available",
  },
  {
    id: 5,
    name: "iPhone 15",
    subtitle: "Smartphone",
    image: "https://picsum.photos/100?5",
    category: "Electronics",
    price: 1049,
    sold: 151,
    status: "low",
  },
];

const statusVariant = {
  available:
    "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  out: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  low: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
};

const statusLabel = {
  available: "Available",
  out: "Out of Stock",
  low: "Low Stock",
};

export default function TopSellingProducts() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top Selling Products
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Sold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.subtitle}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{product.category}</TableCell>

                <TableCell className="text-right font-semibold">
                  ${product.price}
                </TableCell>

                <TableCell className="text-center">
                  {product.sold}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`${statusVariant[product.status]} rounded-full px-3`}
                  >
                    {statusLabel[product.status]}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}