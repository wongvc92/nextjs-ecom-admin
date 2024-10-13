import { CourierService } from "@/lib/types";
import React from "react";

const trackingList = async () => {
  const res = await fetch(
    "https://seller.tracking.my/api/v1/services?from_postcode=50200&to_postcode=15000&weight=1.6&from_country=MY&to_country=MY&type=normal",
    {
      method: "GET",
      headers: {
        "Tracking-Api-Key": "7Q0nfOFr3kL4lmNEj7VlvFXw3po1vqjJ",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    console.log("Failed fetch Tracking list");
    return null;
  }

  const data = await res.json();
  return data.services as CourierService[];
};

const CourierPage = async () => {
  const trackingListCourier = await trackingList();
  if (!trackingListCourier) {
    return <div>Courier not available</div>;
  }

  const filteredCouriers = trackingListCourier.filter((item) => item.courier_title === "J&T Express" || item.courier_title === "Pos Malaysia");
  return (
    <div>
      <pre>{JSON.stringify(filteredCouriers, null, 2)}</pre>
    </div>
  );
};

export default CourierPage;
