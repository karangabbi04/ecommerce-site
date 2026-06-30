import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

type ChartType = "line" | "bar" | "area";


const chartConfig = {
  line: {
    Chart: LineChart,
    Graph: Line,
    props: {
      stroke: "#2563eb",
      strokeWidth: 3,
    },
  },

  bar: {
    Chart: BarChart,
    Graph: Bar,
    props: {
      fill: "#2563eb",
    },
  },

  area: {
    Chart: AreaChart,
    Graph: Area,
    props: {
      stroke: "#2563eb",
      fill: "#93c5fd",
    },
  },
};

interface AnalyticsChartProps {
  type: ChartType;
  data: any[];
   dataKey: string;
}

export default function AnalyticsChart({
  type,
  data,
   dataKey
}: AnalyticsChartProps) {



const config = chartConfig[type];

const Chart = config.Chart;

const Graph = config.Graph;




console.log(type);
console.log(data);

  return (
  <ResponsiveContainer width="100%" height={350}>
  <Chart data={data}>
    <CartesianGrid />

    <XAxis dataKey="month" />

    <YAxis />

   <Tooltip
        cursor={{
          stroke: 'var(--color-border-2)',
        }}
        contentStyle={{
          backgroundColor: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border-2)',
        }}
      />

    <Graph
      dataKey={dataKey}
      {...config.props}
    />
  </Chart>
</ResponsiveContainer>
  );
}