// components/home/why-choose-us/types.ts

export interface Reason {
  id: number;
  value: string;
  title: string;
  description: string;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
}

export interface PromiseData {
  stats: [];
  badge: string;
  title: string;
  description: string;
}