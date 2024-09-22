import { Circle, MapPin } from "lucide-react";
import React from "react";
import { TrackingNumberForm } from "./tracking-number-form";

interface OrderLogisticInfoProps {
  status: string;
  orderId: string;
}

const OrderLogisticInfo = ({ status, orderId }: OrderLogisticInfoProps) => {
  return (
    <div className="flex">
      <div className="flex flex-col">
        <p className="flex items-center gap-2  font-semibold text-sm">
          <MapPin className="h-4 w-4" />
          Logistic Information
        </p>
        <div className="pl-6">
          {status === "toShip" ? (
            <TrackingNumberForm orderId={orderId} />
          ) : (
            <div className="my-4 bg-muted p-4 dark:border rounded-md shadow-sm">
              <ul>
                <li className="relative flex gap-6 pb-5 items-baseline">
                  <div className="before:absolute before:left-[16px]  before:h-full before:w-[1px] before:bg-muted-foreground">
                    <div className="bg-muted relative rounded-full p-1 text-center ">
                      <Circle className="z-10 text-emerald-100" fill="green" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 w-full self-start py-1">
                    <p className="text-xs font-medium text-emerald-500">Parcel has been delivered to buyer</p>
                    <span className="text-[12px] text-muted-foreground">09/01/2023 15:32</span>
                  </div>
                </li>
                <li className="relative flex gap-6 pb-5 items-baseline">
                  <div className="before:absolute before:left-[16px]  before:h-full before:w-[1px] before:bg-muted-foreground">
                    <div className="bg-muted relative rounded-full p-1 text-center  py-1">
                      <Circle className="z-10 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 w-full self-start py-1">
                    <p className="text-xs font-medium text-muted-foreground">Parcel is out for delivery to buyer</p>
                    <span className="text-[12px] text-muted-foreground">09/01/2023 13:41</span>
                  </div>
                </li>
                <li className="relative flex gap-6 pb-5 items-baseline">
                  <div className="before:absolute before:left-[16px] before:h-full before:w-[1px] before:bg-muted-foreground">
                    <div className="bg-muted relative rounded-full p-1 text-center  ">
                      <Circle className="z-10 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 w-full self-start py-1">
                    <p className="text-xs font-medium text-muted-foreground">Parcel has arrived at sorting facility: J&T SHAHALAM GATEWAY</p>
                    <span className="text-[12px] text-muted-foreground">08/01/2023 20:25</span>
                  </div>
                </li>
                <li className="relative flex gap-6 pb-5 items-baseline">
                  <div>
                    <div className="bg-muted relative rounded-full p-1 text-center ">
                      <Circle className="z-10 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 w-full self-start py-1">
                    <p className="text-xs font-medium text-muted-foreground">Sender is preparing to ship your parcel</p>
                    <span className="text-[12px] text-muted-foreground">05/01/2023 11:36</span>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderLogisticInfo;
