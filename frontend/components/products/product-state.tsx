interface ProductStatsProps {
  total: number;
}

export default function ProductStats({
  total,
}: ProductStatsProps) {
  return (
    <div className="mb-8 flex items-center justify-between">

      <div>

        <h2 className="text-xl font-semibold">

          Products

        </h2>

        <p className="text-muted-foreground">

          Showing

          <span className="mx-2 font-semibold text-primary">

            {total}

          </span>

          products

        </p>

      </div>

    </div>
  );
}