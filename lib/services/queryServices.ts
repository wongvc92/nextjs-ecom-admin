import { arrayContains, SQL } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

export const buildQueryArrayCondition = (field: AnyPgColumn, values: string[]): SQL | undefined => {
  return values.length > 0
    ? arrayContains(
        field,
        values.map((v) => v.toLocaleLowerCase())
      )
    : undefined;
};
