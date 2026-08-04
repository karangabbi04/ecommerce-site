
export type RevenueGroupBy =
    | "day"
    | "week"
    | "month"
    | "year";



export interface RevenueFilter {

    groupBy: RevenueGroupBy;

    startDate?: Date;

    endDate?: Date;

}