import { SelectOption } from "./AnalyticsSelect";

export const metricOptions: SelectOption[] = [
  {
    label: "Revenue",
    value: "revenue",
  },
  {
    label: "Orders",
    value: "orders",
  },
  {
    label: "Users",
    value: "users",
  },
];

export const dateOptions: SelectOption[] = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "This Month",
    value: "thisMonth",
  },
  {
    label: "Last 3 Months",
    value: "last3Months",
  },
  {
    label: "Last 6 Months",
    value: "last6Months",
  },
  {
    label: "this year",
    value: "thisYear",
  },
];

export const chartOptions: SelectOption[] = [
  {
    label: "Line",
    value: "line",
  },
  {
    label: "Bar",
    value: "bar",
  },
  {
    label: "Area",
    value: "area",
  },
];