// src/components/tracking/OrderDetails.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrackingData } from "@/types/tracking.types"
import { MapPin, Calendar, Package } from "lucide-react";

interface OrderDetailsProps {
  data: any;
}

export function OrderDetails({ data }: OrderDetailsProps) {
console.log(data.orderItem)

  return (
    <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Summary Card */}
      <Card className="md:col-span-1 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" /> Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">Order ID</p>
            <p className="font-mono font-semibold">{data.response.orderNumber}</p>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3"/> Order Date</p>
            <p className="font-medium">{new Date(data.response.createdAt).toLocaleDateString()}</p>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant="default" className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">
              {data.response.status}
            </Badge>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3"/> Delivery Address</p>
            <p className="font-medium mt-1">{data.response?.customername}</p>
            <p className="text-xs text-muted-foreground">
              {data.response?.addressSnapshot?.street}, {data.response?.addressSnapshot?.city},
               {data.response?.addressSnapshot?.state} - {data.response?.addressSnapshot?.postalCode}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Items Card */}
      <Card className="md:col-span-2 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Order Items ({data.orderItem.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.orderItem.map((item:any) => (
             <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"> 
               Image Placeholder 
              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0"> 
               <Package className="w-6 h-6 text-muted-foreground" /> 
            </div> 
               <div className="flex-1 min-w-0"> 
               <p className="font-medium text-sm truncate">{item.productName}</p> 
               <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p> 
             </div> 
               <p className="font-semibold text-sm">₹{item.totalPrice.toLocaleString()}</p> 
           </div> 
         ))} 
          <Separator className="mt-4" />
          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold">Total Amount</span>
            <span className="text-lg font-bold text-primary">
              {/* ₹{data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()} */}
              {data.response.total}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}