import { Badge } from "@/components/ui/badge";
import { ProductStatus } from "./types";

interface Props {
  status: ProductStatus;
}

export default function ProductStatusBadge({
  status,
}: Props) {
  const styles = {
    available: "bg-green-500",
    low: "bg-yellow-500",
    out: "bg-red-500",
  };

  return (
    <Badge className={styles[status]}>
      {status}
    </Badge>
  );
}