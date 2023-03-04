import { RangeSearchOptions } from "@/services/paintings.service";
import { QueryDslDateRangeQuery } from "@elastic/elasticsearch/lib/api/types";

export function getDateRange(date: number | RangeSearchOptions): QueryDslDateRangeQuery {
  if (typeof date !== 'number') {
    return {
      format: 'epoch_millis',
      gte: date.min?.toString(),
      lte: date.max?.toString(),
    };
  }

  const dateObject = new Date(date);
  const day = dateObject.getUTCDate();
  const month = dateObject.getUTCMonth();
  const year = dateObject.getUTCFullYear();
  const gte = Date.UTC(year, month, day);
  const lt = Date.UTC(year, month, day + 1); // Works even on the last day of month

  return {
    format: 'epoch_millis',
    gte: gte.toString(),
    lt: lt.toString(),
  };
}
