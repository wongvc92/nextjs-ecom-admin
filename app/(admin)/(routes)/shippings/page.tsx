"use client";

import { usePathname, useRouter } from "next/navigation";

const ShippingPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/shippings") {
    router.push("/shippings/sender");
  }
  return null;
};

export default ShippingPage;
