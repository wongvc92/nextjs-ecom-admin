import xlsx, { IContent, IJsonSheet } from "json-as-xlsx";

import { format } from "date-fns";

export const downloadToExcel = (order: IContent[]) => {
  let columns: IJsonSheet[] = [
    {
      sheet: "Order",
      columns: [
        { label: "order Id", value: "id" },
        { label: "productName", value: "productName" },
        { label: "status", value: "status" },
        { label: "guestEmail", value: "guestEmail" },
        { label: "createdAt", value: (row) => format(row.createdAt as string, "dd/MM/yy") },
      ],
      content: order,
    },
  ];
  let settings = {
    fileName: "Order excel",
  };
  xlsx(columns, settings);
};
