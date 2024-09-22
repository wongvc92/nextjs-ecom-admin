import { CheckCircle, DollarSign, ReceiptText, ShieldCheck } from "lucide-react";
import React from "react";

const OrderHistory = () => {
  return (
    <div className="xl:w-1/3  bg-white dark:bg-inherit shadow-sm p-4 border rounded-md space-y-4 h-fit">
      <div className="flex justify-center">
        <p className="text-sm font-semibold">ORDER HISTORY</p>
      </div>
      <ul>
        <li className="relative flex gap-6 pb-5 items-baseline">
          <div className="before:absolute before:left-[16px]  before:h-full before:w-[1px] before:bg-muted-foreground">
            <div className="bg-emerald-500 relative rounded-full p-1 text-center ">
              <ShieldCheck className="z-10 text-white" />
            </div>
          </div>
          <div className="flex flex-col space-y-1 w-full self-start">
            <p className="text-xs font-medium text-emerald-500">Fund transfer has completed</p>
            <span className="text-[12px] text-muted-foreground">The payment has been successfully transferred.</span>
          </div>
        </li>
        <li className="relative flex gap-6 pb-5 items-baseline">
          <div className="before:absolute before:left-[16px]  before:h-full before:w-[1px] before:bg-muted-foreground">
            <div className="bg-muted relative rounded-full p-1 text-center ">
              <CheckCircle className="z-10 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-col space-y-1 w-full self-start">
            <p className="text-xs font-medium text-muted-foreground">Completed</p>
            <span className="text-[12px] text-muted-foreground">16/01/2023 03:51</span>
          </div>
        </li>
        <li className="relative flex gap-6 pb-5 items-baseline">
          <div className="before:absolute before:left-[16px] before:h-full before:w-[1px] before:bg-muted-foreground">
            <div className="bg-muted relative rounded-full p-1 text-center ">
              <DollarSign className="z-10 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-col space-y-1 w-full self-start">
            <p className="text-xs font-medium text-muted-foreground">Buyer confirmed order received</p>
            <span className="text-[12px] text-muted-foreground">Order has been received and payment is being processed.</span>
            <span className="text-[12px] text-muted-foreground">16/01/2023 03:51</span>
          </div>
        </li>
        <li className="relative flex gap-6 pb-5 items-baseline">
          <div>
            <div className="bg-muted relative rounded-full p-1 text-center ">
              <ReceiptText className="z-10 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-col space-y-1 w-full self-start">
            <p className="text-xs font-medium text-muted-foreground">New Order</p>
            <span className="text-[12px] text-muted-foreground">04/01/2023 23:20</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default OrderHistory;
